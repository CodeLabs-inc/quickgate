import sys
import os
import re
from datetime import datetime
import time

def verificar_dependencias():
    dependencias = {
        'cv2': 'opencv-python',
        'numpy': 'numpy',
        'imutils': 'imutils',
        'easyocr': 'easyocr',
        'torch': 'torch',
        'torchvision': 'torchvision',
        'PIL': 'Pillow'
    }
    
    faltantes = []
    for modulo, paquete in dependencias.items():
        try:
            __import__(modulo)
        except ImportError:
            faltantes.append(paquete)
    
    if faltantes:
        print("Error: Faltan las siguientes dependencias:")
        for paquete in faltantes:
            print(f"  - {paquete}")
        print("\nPor favor, instale las dependencias usando:")
        print(f"pip install {' '.join(faltantes)}")
        sys.exit(1)

# Verificar dependencias antes de importar
verificar_dependencias()

# Importar dependencias
import cv2
import numpy as np
import imutils
import easyocr
import torch
import torchvision
from PIL import Image

# Configurar PyTorch para usar CPU y optimizar rendimiento
torch.set_num_threads(2)  # Limitar threads para evitar sobrecarga
torch.set_grad_enabled(False)  # Desactivar gradientes ya que solo hacemos inferencia

from camera_manager import CameraManager
from api_client import APIClient
from config import CAMERA_ENTRADA, CAMERA_SALIDA, API_CONFIG

# Letras válidas según la DGII
LETRAS_VALIDAS = {
    'A': 'Vehículos privados',
    'E': 'Vehículos exentos',
    'G': 'Vehículos gubernamentales',
    'K': 'Motocicletas',
    'L': 'Alquiler',
    'O': 'Vehículos oficiales',
    'P': 'Vehículos privados',
    'X': 'Vehículos de uso temporal'
}

def es_placa_dominicana(texto):
    # Limpiar y normalizar el texto
    texto = texto.replace('O', '0')  # Reemplazar O por 0, error común de OCR
    texto = texto.replace('I', '1')  # Reemplazar I por 1, error común de OCR
    texto = texto.replace('S', '5')  # Reemplazar S por 5, error común de OCR
    texto = texto.replace('B', '8')  # Reemplazar B por 8, error común de OCR
    
    texto_limpio = ''.join(c for c in texto if c.isalnum()).upper()
    
    # Si el texto es muy corto, no puede ser una placa
    if len(texto_limpio) < 7:
        return None
    
    print(f"Texto detectado: {texto_limpio}")
    
    # Buscar una letra válida al inicio o cerca del inicio
    for i in range(min(3, len(texto_limpio))):
        letra = texto_limpio[i]
        if letra in LETRAS_VALIDAS:
            # Buscar 6 dígitos después de la letra
            resto = texto_limpio[i+1:]
            numeros = ''.join(c for c in resto if c.isdigit())
            if len(numeros) >= 6:
                placa = f"{letra}{numeros[:6]}"
                print(f"Placa válida encontrada ({LETRAS_VALIDAS[letra]}): {placa}")
                return placa
    
    # Si no encontramos una letra válida al inicio, buscar en todo el texto
    for i in range(len(texto_limpio)):
        letra = texto_limpio[i]
        if letra in LETRAS_VALIDAS:
            # Verificar si hay suficientes dígitos después de la letra
            resto = texto_limpio[i+1:]
            numeros = ''.join(c for c in resto if c.isdigit())
            if len(numeros) >= 6:
                placa = f"{letra}{numeros[:6]}"
                print(f"Placa válida encontrada ({LETRAS_VALIDAS[letra]}): {placa}")
                return placa
    
    return None

class DetectorPlacas:
    def __init__(self, nombre=""):
        print(f"Inicializando detector de placas para {nombre}...")
        self.nombre = nombre
        # Configurar EasyOCR optimizado para CPU
        self.reader = easyocr.Reader(
            ['es'],  # Solo español para mayor velocidad
            gpu=False,  # Usar CPU
            model_storage_directory=os.path.join(os.path.dirname(__file__), 'models'),
            download_enabled=True,
            detector=True,  # Usar detector de texto para mejor precisión
            recognizer=True,  # Usar reconocedor de texto
            quantize=True,  # Cuantizar modelo para CPU
            cudnn_benchmark=False  # Desactivar optimizaciones CUDA
        )
        self.api_client = APIClient(API_CONFIG)
        self.ultima_deteccion = {}
        self.tiempo_minimo_entre_detecciones = 2  # Reducido a 2 segundos
        self.placa_detectada = False
        self.detecciones_totales = 0  # Contador de detecciones
        # Configurar parámetros de detección
        self.min_confidence = 0.3  # Reducido para detectar más placas
        
    def procesar_frame(self, frame, timestamp):
        if frame is None:
            return frame

        # Obtener dimensiones del frame
        height, width = frame.shape[:2]
        
        # Redimensionar para procesamiento más rápido
        scale = 800 / width  # Aumentado para mejor detección
        frame_resized = cv2.resize(frame, (800, int(height * scale)))
        
        # Convertir a escala de grises
        gray = cv2.cvtColor(frame_resized, cv2.COLOR_BGR2GRAY)
        
        # Normalizar la iluminación
        clahe = cv2.createCLAHE(clipLimit=3.0, tileGridSize=(8,8))  # Aumentado para mejor contraste
        gray = clahe.apply(gray)
        
        # Mejorar el contraste
        gray = cv2.convertScaleAbs(gray, alpha=1.5, beta=30)  # Aumentado para mejor contraste
        
        # Suavizado bilateral para reducir ruido manteniendo bordes
        blurred = cv2.bilateralFilter(gray, 9, 75, 75)  # Ajustado para mejor detección de bordes
        
        # Detectar bordes con Canny
        edged = cv2.Canny(blurred, 50, 150)  # Ajustado para mejor detección de bordes
        
        # Dilatación para conectar bordes
        kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (3,3))
        edged = cv2.dilate(edged, kernel, iterations=2)  # Más iteraciones
        
        # Encontrar contornos
        keypoints = cv2.findContours(edged.copy(), cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)  # Cambiado a TREE
        contours = imutils.grab_contours(keypoints)
        contours = sorted(contours, key=cv2.contourArea, reverse=True)[:8]  # Aumentado a 8
        
        mejor_deteccion = None
        mejor_confianza = 0
        
        for contour in contours:
            # Usar menor epsilon para aproximación más precisa
            epsilon = 0.02 * cv2.arcLength(contour, True)
            approx = cv2.approxPolyDP(contour, epsilon, True)
            
            # Aceptar formas con 4-6 vértices (más permisivo)
            if 4 <= len(approx) <= 6:
                # Obtener rectángulo delimitador directamente
                x, y, w, h = cv2.boundingRect(contour)
                
                # Obtener ancho y alto del rectángulo rotado
                width = w
                height = h
                if width < height:
                    width, height = height, width
                
                # Verificar tamaño mínimo y máximo
                min_width = 60    # Reducido para detectar placas más lejanas
                max_width = 500   # Aumentado para placas muy cercanas
                min_height = 20   # Reducido proporcionalmente
                max_height = 150  # Aumentado proporcionalmente
                
                if width < min_width or height < min_height or width > max_width or height > max_height:
                    continue
                
                # Verificar proporciones típicas de una placa dominicana (ancho:alto ~ 3:1)
                aspect_ratio = width/height
                if not (2.0 <= aspect_ratio <= 4.5):  # Más permisivo con la proporción
                    continue
                
                # Ajustar coordenadas al tamaño original
                x1 = int(x / scale)
                y1 = int(y / scale)
                x2 = int((x + w) / scale)
                y2 = int((y + h) / scale)
                
                # Añadir padding para incluir más contexto
                padding_x = int(w * 0.15)  # Aumentado
                padding_y = int(h * 0.25)  # Aumentado
                x1 = max(0, x1 - padding_x)
                y1 = max(0, y1 - padding_y)
                x2 = min(frame.shape[1], x2 + padding_x)
                y2 = min(frame.shape[0], y2 + padding_y)
                
                # Extraer la región de la placa del frame original
                cropped_image = frame[y1:y2, x1:x2]
                
                if cropped_image.size == 0 or cropped_image.shape[0] < 15 or cropped_image.shape[1] < 30:
                    continue
                
                # Preprocesamiento para mejorar el OCR
                # Redimensionar manteniendo la proporción
                target_width = 400  # Aumentado para mejor detección
                scale = target_width / cropped_image.shape[1]
                target_height = int(cropped_image.shape[0] * scale)
                resized = cv2.resize(cropped_image, (target_width, target_height))
                
                # Lista para almacenar imágenes procesadas
                processed_images = []
                
                # 1. Imagen en escala de grises normal
                gray_plate = cv2.cvtColor(resized, cv2.COLOR_BGR2GRAY)
                processed_images.append(gray_plate)
                
                # 2. Imagen con alto contraste
                contrast = cv2.convertScaleAbs(gray_plate, alpha=2.0, beta=0)
                processed_images.append(contrast)
                
                # 3. Imagen ecualizada
                equ = cv2.equalizeHist(gray_plate)
                processed_images.append(equ)
                
                # 4. Imagen binarizada
                _, binary = cv2.threshold(gray_plate, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
                processed_images.append(binary)
                
                # Procesar cada variante de la imagen
                for img in processed_images:
                    # Detectar texto con parámetros optimizados
                    result = self.reader.readtext(
                        img,
                        allowlist=''.join(LETRAS_VALIDAS.keys()) + '0123456789',
                        batch_size=1,
                        detail=0,
                        paragraph=False,
                        height_ths=0.3,      # Más permisivo
                        width_ths=0.3,       # Más permisivo
                        contrast_ths=0.1,    # Más permisivo
                        low_text=0.2,        # Más permisivo
                        text_threshold=0.4,  # Más permisivo
                        link_threshold=0.2,  # Más permisivo
                        mag_ratio=1.5,
                        slope_ths=0.2        # Más permisivo
                    )
                    
                    # Procesar cada detección
                    for text in result:
                        # Limpiar y normalizar el texto
                        text = text.replace('O', '0').replace('I', '1').replace('S', '5').replace('B', '8')
                        text = text.replace('o', '0').replace('i', '1').replace('s', '5').replace('b', '8')
                        text = text.replace('D', '0').replace('l', '1').replace('Z', '2')
                        text = ''.join(c for c in text if c.isalnum()).upper()
                        
                        # Verificar longitud mínima
                        if len(text) < 6:  # Más permisivo
                            continue
                        
                        # Verificar si el texto comienza con una letra válida
                        letra = text[0]
                        if letra in LETRAS_VALIDAS:
                            # Buscar una secuencia de dígitos
                            numeros = ''.join(c for c in text[1:] if c.isdigit())
                            if len(numeros) >= 5:  # Más permisivo
                                placa_candidata = letra + numeros[:6]
                                
                                # Calcular confianza
                                confidence = 0.4  # Base más permisiva
                                if len(text) == 7:
                                    confidence += 0.3
                                if text[0] in ['G', 'A', 'L', 'O', 'P', 'E', 'I']:
                                    confidence += 0.2
                                if text[1:].isdigit():
                                    confidence += 0.2
                                if all(c in '0123456789' for c in text[1:]):
                                    confidence += 0.1
                                
                                # Penalizaciones reducidas
                                if any(c in 'B8' for c in text[1:]):
                                    confidence -= 0.05
                                if any(c in 'O0' for c in text[1:]):
                                    confidence -= 0.05
                                if any(c in 'I1' for c in text[1:]):
                                    confidence -= 0.05
                                if any(c in 'S5' for c in text[1:]):
                                    confidence -= 0.05
                                
                                if confidence > mejor_confianza:
                                    mejor_deteccion = placa_candidata
                                    mejor_confianza = confidence
                                    print(f"\n¡Nueva detección en {self.nombre}! (#{self.detecciones_totales})")
                                    print(f"Tipo: {LETRAS_VALIDAS[letra]}")
                                    print(f"Placa: {placa_candidata}")
                                    print(f"Confianza: {confidence:.2f}\n")
                
                # Si encontramos una detección válida
                if mejor_deteccion:
                    # Dibujar rectángulo y texto en el frame
                    cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
                    cv2.putText(frame, mejor_deteccion, (x1, y1-10), 
                              cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 0), 2)
                    
                    # Verificar tiempo desde última detección
                    tiempo_actual = time.time()
                    ultima_deteccion = self.ultima_deteccion.get(mejor_deteccion, 0)
                    if tiempo_actual - ultima_deteccion > self.tiempo_minimo_entre_detecciones:
                        self.ultima_deteccion[mejor_deteccion] = tiempo_actual
                        self.detecciones_totales += 1
                        
                        # Enviar detección al API
                        try:
                            self.api_client.enviar_deteccion({
                                'placa': mejor_deteccion,
                                'tipo': LETRAS_VALIDAS[mejor_deteccion[0]],
                                'camara': self.nombre,
                                'confianza': mejor_confianza,
                                'timestamp': timestamp
                            })
                        except Exception as e:
                            print(f"Error al enviar detección al API: {str(e)}")
        
        return frame

def main():
    print("Iniciando sistema de detección de placas...")
    
    # Inicializar detectores
    detector_entrada = DetectorPlacas("Cámara Entrada")
    detector_salida = None
    if CAMERA_SALIDA is not None:
        detector_salida = DetectorPlacas("Cámara Salida")
    
    print("Configurando cámaras...")
    
    # Inicializar cámaras
    camara_entrada = CameraManager(CAMERA_ENTRADA)
    camara_salida = None
    if CAMERA_SALIDA is not None:
        camara_salida = CameraManager(CAMERA_SALIDA)
    
    try:
        # Crear y configurar ventana
        cv2.namedWindow('Cámara Entrada', cv2.WINDOW_NORMAL)
        cv2.resizeWindow('Cámara Entrada', 800, 600)
        cv2.moveWindow('Cámara Entrada', 50, 50)
        
        # Iniciar cámara de entrada
        print("Iniciando cámara de entrada...")
        camara_entrada.iniciar()
        
        print("Sistema listo para detectar placas...")
        
        while True:
            # Procesar cámara de entrada
            ret_entrada, timestamp_entrada, frame_entrada = camara_entrada.obtener_frame()
            if ret_entrada:
                # Procesar frame y mostrar resultado
                frame_procesado = detector_entrada.procesar_frame(frame_entrada, timestamp_entrada)
                cv2.imshow('Cámara Entrada', frame_entrada)
            
            # Salir si se presiona 'q'
            if cv2.waitKey(1) & 0xFF == ord('q'):
                print("\nCerrando sistema...")
                break
        
    except KeyboardInterrupt:
        print("\nDetección interrumpida por el usuario")
    except Exception as e:
        print(f"\nError durante la detección: {str(e)}")
    finally:
        # Detener cámaras
        if camara_entrada:
            camara_entrada.detener()
        
        # Cerrar ventanas
        cv2.destroyAllWindows()

if __name__ == "__main__":
    main()
