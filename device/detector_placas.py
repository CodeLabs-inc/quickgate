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

class DetectorPlacas:
    def __init__(self, nombre=""):
        print(f"Inicializando detector de placas para {nombre}...")
        self.nombre = nombre
        
        # Configurar EasyOCR optimizado para CPU/GPU
        self.reader = easyocr.Reader(
            ['es'],  # Solo español para mayor velocidad
            gpu=torch.cuda.is_available(),  # Usar GPU si está disponible
            model_storage_directory=os.path.join(os.path.dirname(__file__), 'models'),
            download_enabled=True,
            detector=True,
            recognizer=True,
            quantize=not torch.cuda.is_available(),  # Cuantizar solo si usamos CPU
            cudnn_benchmark=torch.cuda.is_available()  # Optimizaciones CUDA si está disponible
        )
        
        # Configuración para procesamiento de video
        self.frame_buffer = []  # Buffer para frames
        self.buffer_size = 3    # Tamaño del buffer para promediar detecciones
        self.skip_frames = 2    # Frames a saltar para optimizar rendimiento
        self.frame_count = 0    # Contador de frames
        self.fps_start_time = time.time()  # Para cálculo de FPS
        self.fps_counter = 0    # Contador para FPS
        self.current_fps = 0    # FPS actual
        
        # Cliente API y configuración de detecciones
        self.api_client = APIClient(API_CONFIG)
        self.ultima_deteccion = {}
        self.tiempo_minimo_entre_detecciones = 2  # Segundos entre detecciones
        self.placa_detectada = False
        self.detecciones_totales = 0
        self.min_confidence = 0.3
        
        # Cache de resultados para evitar procesamiento redundante
        self.cache_resultados = {}
        self.cache_timeout = 1.0  # Tiempo de vida del cache en segundos
        
    def actualizar_fps(self):
        """Actualiza el contador de FPS"""
        self.fps_counter += 1
        tiempo_actual = time.time()
        if tiempo_actual - self.fps_start_time > 1.0:
            self.current_fps = self.fps_counter
            self.fps_counter = 0
            self.fps_start_time = tiempo_actual
            print(f"FPS: {self.current_fps}")
    
    def procesar_frame(self, frame, timestamp):
        if frame is None:
            return frame
            
        # Actualizar FPS
        self.actualizar_fps()
        
        # Incrementar contador de frames
        self.frame_count += 1
        
        # Saltar frames para optimizar rendimiento
        if self.frame_count % self.skip_frames != 0:
            return frame
            
        # Verificar cache
        frame_hash = hash(frame.tobytes())
        if frame_hash in self.cache_resultados:
            cache_time, resultado = self.cache_resultados[frame_hash]
            if time.time() - cache_time < self.cache_timeout:
                return resultado
        
        # Obtener dimensiones del frame
        height, width = frame.shape[:2]
        
        # Redimensionar para procesamiento más rápido
        scale = 800 / width
        frame_resized = cv2.resize(frame, (800, int(height * scale)))
        
        # Convertir a escala de grises y optimizar
        gray = cv2.cvtColor(frame_resized, cv2.COLOR_BGR2GRAY)
        clahe = cv2.createCLAHE(clipLimit=3.0, tileGridSize=(8,8))
        gray = clahe.apply(gray)
        gray = cv2.convertScaleAbs(gray, alpha=1.5, beta=30)
        
        # Procesamiento optimizado para video
        blurred = cv2.bilateralFilter(gray, 9, 75, 75)
        edged = cv2.Canny(blurred, 50, 150)
        kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (3,3))
        edged = cv2.dilate(edged, kernel, iterations=2)
        
        # Encontrar y procesar contornos
        keypoints = cv2.findContours(edged.copy(), cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
        contours = imutils.grab_contours(keypoints)
        contours = sorted(contours, key=cv2.contourArea, reverse=True)[:8]
        
        mejor_deteccion = None
        mejor_confianza = 0
        
        # Procesar cada contorno
        for contour in contours:
            epsilon = 0.02 * cv2.arcLength(contour, True)
            approx = cv2.approxPolyDP(contour, epsilon, True)
            
            if 4 <= len(approx) <= 6:
                x, y, w, h = cv2.boundingRect(contour)
                
                # Verificar dimensiones
                if not self._validar_dimensiones(w, h):
                    continue
                    
                # Extraer y procesar región de interés
                roi = self._extraer_roi(frame, x, y, w, h, scale)
                if roi is None:
                    continue
                    
                # Detectar texto en ROI
                resultado = self._detectar_texto(roi)
                if resultado:
                    mejor_deteccion, mejor_confianza = resultado
                    
        # Actualizar frame con resultados
        if mejor_deteccion:
            frame = self._dibujar_resultados(frame, x, y, w, h, mejor_deteccion)
            
            # Actualizar cache
            self.cache_resultados[frame_hash] = (time.time(), frame)
            
            # Procesar detección
            self._procesar_deteccion(mejor_deteccion, mejor_confianza, timestamp)
        
        return frame
        
    def _validar_dimensiones(self, w, h):
        """Valida las dimensiones de un posible plate"""
        min_width, max_width = 60, 500
        min_height, max_height = 20, 150
        aspect_ratio = w/h
        
        return (min_width <= w <= max_width and 
                min_height <= h <= max_height and 
                2.0 <= aspect_ratio <= 4.5)
                
    def _extraer_roi(self, frame, x, y, w, h, scale):
        """Extrae y preprocesa la región de interés"""
        x1 = max(0, int(x/scale))
        y1 = max(0, int(y/scale))
        x2 = min(frame.shape[1], int((x + w)/scale))
        y2 = min(frame.shape[0], int((y + h)/scale))
        
        roi = frame[y1:y2, x1:x2]
        if roi.size == 0 or roi.shape[0] < 15 or roi.shape[1] < 30:
            return None
            
        return cv2.resize(roi, (400, int(roi.shape[0] * 400/roi.shape[1])))
        
    def _detectar_texto(self, roi):
        """Detecta texto en la región de interés"""
        for img in self._generar_variantes(roi):
            result = self.reader.readtext(
                img,
                allowlist=''.join(LETRAS_VALIDAS.keys()) + '0123456789',
                batch_size=1,
                detail=0,
                paragraph=False,
                height_ths=0.3,
                width_ths=0.3,
                contrast_ths=0.1,
                low_text=0.2,
                text_threshold=0.4,
                link_threshold=0.2,
                mag_ratio=1.5,
                slope_ths=0.2
            )
            
            for text in result:
                placa, confianza = self._analizar_texto(text)
                if placa and confianza > self.min_confidence:
                    return placa, confianza
        return None
        
    def _generar_variantes(self, img):
        """Genera variantes de la imagen para mejor detección"""
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        return [
            gray,
            cv2.convertScaleAbs(gray, alpha=2.0, beta=0),
            cv2.equalizeHist(gray),
            cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)[1]
        ]
        
    def _analizar_texto(self, text):
        """Analiza el texto detectado para validar si es una placa"""
        text = self._normalizar_texto(text)
        if len(text) < 6:
            return None, 0
            
        if text[0] not in LETRAS_VALIDAS:
            return None, 0
            
        numeros = ''.join(c for c in text[1:] if c.isdigit())
        if len(numeros) < 5:
            return None, 0
            
        placa = text[0] + numeros[:6]
        confianza = self._calcular_confianza(text, placa)
        return placa, confianza
        
    def _normalizar_texto(self, text):
        """Normaliza el texto detectado"""
        replacements = {
            'O': '0', 'I': '1', 'S': '5', 'B': '8',
            'o': '0', 'i': '1', 's': '5', 'b': '8',
            'D': '0', 'l': '1', 'Z': '2'
        }
        for old, new in replacements.items():
            text = text.replace(old, new)
        return ''.join(c for c in text if c.isalnum()).upper()
        
    def _calcular_confianza(self, text, placa):
        """Calcula la confianza de la detección"""
        confianza = 0.4
        if len(text) == 7:
            confianza += 0.3
        if text[0] in ['G', 'A', 'L', 'O', 'P', 'E', 'I']:
            confianza += 0.2
        if text[1:].isdigit():
            confianza += 0.2
        if all(c in '0123456789' for c in text[1:]):
            confianza += 0.1
            
        # Penalizaciones
        penalizaciones = {
            'B8': 0.05, 'O0': 0.05,
            'I1': 0.05, 'S5': 0.05
        }
        for chars, penalty in penalizaciones.items():
            if any(c in chars for c in text[1:]):
                confianza -= penalty
                
        return confianza
        
    def _dibujar_resultados(self, frame, x, y, w, h, deteccion):
        """Dibuja los resultados en el frame"""
        cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)
        cv2.putText(frame, deteccion, (x, y-10),
                   cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 0), 2)
        return frame
        
    def _procesar_deteccion(self, deteccion, confianza, timestamp):
        """Procesa una nueva detección"""
        tiempo_actual = time.time()
        ultima_deteccion = self.ultima_deteccion.get(deteccion, 0)
        
        if tiempo_actual - ultima_deteccion > self.tiempo_minimo_entre_detecciones:
            self.ultima_deteccion[deteccion] = tiempo_actual
            self.detecciones_totales += 1
            
            print(f"\n¡Nueva detección en {self.nombre}! (#{self.detecciones_totales})")
            print(f"Tipo: {LETRAS_VALIDAS[deteccion[0]]}")
            print(f"Placa: {deteccion}")
            print(f"Confianza: {confianza:.2f}\n")
            
            try:
                self.api_client.enviar_deteccion({
                    'placa': deteccion,
                    'tipo': LETRAS_VALIDAS[deteccion[0]],
                    'camara': self.nombre,
                    'confianza': confianza,
                    'timestamp': timestamp
                })
            except Exception as e:
                print(f"Error al enviar detección al API: {str(e)}")

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
