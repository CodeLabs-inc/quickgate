import cv2
import threading
import queue
import time
from datetime import datetime

class CameraManager:
    def __init__(self, config):
        self.tipo = config['tipo']
        self.source = config['source']
        self.nombre = config['nombre']
        self.frame_queue = queue.Queue(maxsize=10)
        self.running = False
        self.cap = None
        
    def iniciar(self):
        if self.tipo == 'USB':
            self.cap = cv2.VideoCapture(self.source)
        else:  # IP
            self.cap = cv2.VideoCapture(self.source)
            
        if not self.cap.isOpened():
            raise Exception(f"No se pudo abrir la cámara {self.nombre}")
            
        self.running = True
        self.thread = threading.Thread(target=self._capturar_frames)
        self.thread.daemon = True
        self.thread.start()
        
    def _capturar_frames(self):
        while self.running:
            ret, frame = self.cap.read()
            if ret:
                if self.frame_queue.full():
                    try:
                        self.frame_queue.get_nowait()
                    except queue.Empty:
                        pass
                self.frame_queue.put((datetime.now(), frame))
            time.sleep(0.01)  # Pequeña pausa para no saturar el CPU
            
    def obtener_frame(self):
        try:
            timestamp, frame = self.frame_queue.get_nowait()
            return True, timestamp, frame
        except queue.Empty:
            return False, None, None
            
    def detener(self):
        self.running = False
        if self.thread:
            self.thread.join()
        if self.cap:
            self.cap.release()
            
    def __del__(self):
        self.detener()
