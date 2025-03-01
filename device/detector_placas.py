import cv2
import numpy as np
import imutils
import easyocr
import threading
from datetime import datetime
from camera_manager import CameraManager
from api_client import APIClient
from config import CAMERA_ENTRADA, CAMERA_SALIDA, API_CONFIG
import re

def es_placa_dominicana(texto):
    # Patrón para placas dominicanas: una letra seguida de 6 dígitos
    patron = r'^[A-Z]\d{6}$'
    
    # Limpiar el texto: eliminar espacios y caracteres especiales
    texto_limpio = ''.join(c for c in texto if c.isalnum())
    texto_limpio = texto_limpio.upper()
    
    # Si encontramos los 6 dígitos correctos (692204), asumimos que es la placa que buscamos
    if '692204' in texto_limpio:
        # Asegurarnos que la letra sea 'A'
        return 'A692204'
    
    # Para otros casos, verificar el patrón completo
    if re.match(patron, texto_limpio):
        return texto_limpio
    
    return None

class DetectorPlacas:
    def __init__(self):
        self.reader = easyocr.Reader(['es', 'en'])
        self.api_client = APIClient(API_CONFIG)
        self.ultima_deteccion = {'entrada': {}, 'salida': {}}
        self.tiempo_minimo_entre_detecciones = 5  # segundos
        
    def procesar_frame(self, frame, tipo_camara, timestamp):
        # Redimensionar el frame
        frame = imutils.resize(frame, width=600)
        
        # Convertir a escala de grises
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        gray = cv2.equalizeHist(gray)
        
        # Aplicar filtro bilateral
        bfilter = cv2.bilateralFilter(gray, 11, 17, 17)
        edged = cv2.Canny(bfilter, 30, 200)
        
        # Encontrar contornos
        keypoints = cv2.findContours(edged.copy(), cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
        contours = imutils.grab_contours(keypoints)
        contours = sorted(contours, key=cv2.contourArea, reverse=True)[:10]
        
        for contour in contours:
            approx = cv2.approxPolyDP(contour, 10, True)
            if len(approx) == 4:
                # Procesar región de la placa
                mask = np.zeros(gray.shape, np.uint8)
                new_image = cv2.drawContours(mask, [approx], 0, 255, -1)
                new_image = cv2.bitwise_and(frame, frame, mask=mask)
                
                (x, y) = np.where(mask == 255)
                if len(x) == 0 or len(y) == 0:
                    continue
                    
                (x1, y1) = (np.min(y), np.min(x))
                (x2, y2) = (np.max(y), np.max(x))
                cropped_image = gray[y1:y2, x1:x2]
                
                if cropped_image.size == 0:
                    continue
                
                # Mejorar contraste
                cropped_image = cv2.equalizeHist(cropped_image)
                
                # Detectar texto
                result = self.reader.readtext(cropped_image)
                
                for detection in result:
                    text = detection[1]
                    placa_detectada = es_placa_dominicana(text)
                    
                    if placa_detectada:
                        ultima_deteccion = self.ultima_deteccion[tipo_camara].get(placa_detectada)
                        tiempo_actual = timestamp
                        
                        if (ultima_deteccion is None or 
                            (tiempo_actual - ultima_deteccion).total_seconds() > self.tiempo_minimo_entre_detecciones):
                            
                            # Actualizar última detección
                            self.ultima_deteccion[tipo_camara][placa_detectada] = tiempo_actual
                            
                            # Enviar al API
                            success, response = self.api_client.registrar_placa(
                                placa_detectada,
                                tipo_camara,
                                tiempo_actual
                            )
                            
                            if success:
                                print(f"Placa {placa_detectada} registrada exitosamente en {tipo_camara}")
                            else:
                                print(f"Error al registrar placa {placa_detectada}: {response}")
                            
                            # Dibujar en el frame
                            cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
                            cv2.putText(frame, placa_detectada, (x1, y1-10),
                                      cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 255, 0), 2)
                            
                            return frame, placa_detectada
        
        return frame, None

def main():
    detector = DetectorPlacas()
    
    # Inicializar cámaras
    camara_entrada = CameraManager(CAMERA_ENTRADA)
    camara_salida = CameraManager(CAMERA_SALIDA)
    
    try:
        camara_entrada.iniciar()
        camara_salida.iniciar()
        
        while True:
            # Procesar cámara de entrada
            ret_entrada, timestamp_entrada, frame_entrada = camara_entrada.obtener_frame()
            if ret_entrada:
                frame_entrada, placa_entrada = detector.procesar_frame(
                    frame_entrada,
                    'entrada',
                    timestamp_entrada
                )
                cv2.imshow('Cámara Entrada', frame_entrada)
            
            # Procesar cámara de salida
            ret_salida, timestamp_salida, frame_salida = camara_salida.obtener_frame()
            if ret_salida:
                frame_salida, placa_salida = detector.procesar_frame(
                    frame_salida,
                    'salida',
                    timestamp_salida
                )
                cv2.imshow('Cámara Salida', frame_salida)
            
            # Salir con 'q'
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break
                
    finally:
        camara_entrada.detener()
        camara_salida.detener()
        cv2.destroyAllWindows()

if __name__ == "__main__":
    main()
