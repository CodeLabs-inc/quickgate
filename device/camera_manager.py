import cv2
import threading
import queue
import time
import numpy as np
from datetime import datetime
import os

class CameraManager:
    def __init__(self, config):
        if config is None:
            raise Exception("Configuración de cámara no válida")
            
        self.tipo = config['tipo']
        self.source = config['source']
        self.nombre = config['nombre']
        self.frame_queue = queue.Queue(maxsize=2)  # Cola más pequeña para procesar frames más recientes
        self.running = False
        self.cap = None
        self.thread = None  # Inicializar thread
        
        # Cargar configuración
        self.fps = config.get('fps', 30)
        self.resolucion = config.get('resolucion', {'width': 640, 'height': 480})
        self.backend = config.get('parametros', {}).get('backend', cv2.CAP_DSHOW)
        self.max_intentos = config.get('max_intentos', 3)
        self.tiempo_espera = config.get('tiempo_espera', 1)
        
        print(f"CameraManager inicializado para {self.nombre}")
        
    def iniciar(self):
        print(f"Iniciando {self.nombre}...")
        intentos = 0
        
        # Verificar si la cámara está deshabilitada
        if self.source is None:
            print(f"Cámara {self.nombre} deshabilitada en configuración")
            return
        
        while intentos < self.max_intentos:
            try:
                if self.tipo == 'USB':
                    # Intentar abrir la cámara con el backend configurado
                    print(f"Intentando abrir cámara USB {self.source} (intento {intentos + 1}/{self.max_intentos})...")
                    print(f"Backend: {self.backend} ({cv2.CAP_DSHOW if self.backend == cv2.CAP_DSHOW else 'otro'})")
                    
                    # Intentar primero sin backend específico si no es el primer intento
                    if intentos > 0:
                        print("Intentando sin backend específico...")
                        self.cap = cv2.VideoCapture(self.source)
                    else:
                        self.cap = cv2.VideoCapture(self.source, self.backend)
                    
                    if not self.cap.isOpened():
                        raise Exception("No se pudo abrir la cámara USB")
                    
                    # Configurar resolución y FPS
                    print("Configurando parámetros de cámara...")
                    self.cap.set(cv2.CAP_PROP_FRAME_WIDTH, self.resolucion['width'])
                    self.cap.set(cv2.CAP_PROP_FRAME_HEIGHT, self.resolucion['height'])
                    self.cap.set(cv2.CAP_PROP_FPS, self.fps)
                    
                    # Verificar configuración actual
                    actual_width = int(self.cap.get(cv2.CAP_PROP_FRAME_WIDTH))
                    actual_height = int(self.cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
                    actual_fps = int(self.cap.get(cv2.CAP_PROP_FPS))
                    
                    print("Parámetros solicitados vs actuales:")
                    print(f"  Resolución: {self.resolucion['width']}x{self.resolucion['height']} -> {actual_width}x{actual_height}")
                    print(f"  FPS: {self.fps} -> {actual_fps}")
                    
                    # Verificar que podemos leer frames
                    print("Verificando lectura de frames...")
                    ret, frame = self.cap.read()
                    if not ret:
                        raise Exception("No se pueden leer frames de la cámara")
                    
                    if frame is None:
                        raise Exception("Frame leído es None")
                    
                    print(f"Frame leído correctamente: {frame.shape}")
                    print(f"Cámara {self.nombre} iniciada exitosamente")
                    break
                    
                elif self.tipo == 'VIDEO':
                    video_path = os.path.join(os.path.dirname(__file__), self.source)
                    print(f"Abriendo video: {video_path}")
                    self.cap = cv2.VideoCapture(video_path)
                    if self.cap.isOpened():
                        print(f"Video {self.nombre} iniciado correctamente")
                        break
                    else:
                        raise Exception("No se pudo abrir el archivo de video")
                        
                else:  # IP
                    self.cap = cv2.VideoCapture(self.source)
                    if self.cap.isOpened():
                        print(f"Cámara IP {self.nombre} iniciada correctamente")
                        break
                    else:
                        raise Exception("No se pudo abrir la cámara IP")
                        
            except Exception as e:
                print(f"Error al iniciar {self.nombre}: {str(e)}")
                if self.cap is not None:
                    print("Liberando recursos de cámara...")
                    self.cap.release()
                    self.cap = None
                
                intentos += 1
                if intentos < self.max_intentos:
                    print(f"Reintentando en {self.tiempo_espera} segundos (intento {intentos + 1}/{self.max_intentos})...")
                    time.sleep(self.tiempo_espera)
                else:
                    print("Se agotaron los intentos de inicialización")
                    raise Exception(f"No se pudo iniciar {self.nombre} después de {self.max_intentos} intentos")
                
        self.running = True
        self.thread = threading.Thread(target=self._capturar_frames)
        self.thread.daemon = True
        self.thread.start()
        print(f"{self.nombre} iniciado correctamente")
        
    def _capturar_frames(self):
        print(f"Procesando video a {self.fps} FPS")
        frame_delay = 1.0 / self.fps if self.fps > 0 else 0
        frames_procesados = 0
        frames_fallidos = 0
        max_frames_fallidos = 10  # Máximo número de frames fallidos consecutivos
        tiempo_inicio = time.perf_counter()
        
        while self.running:
            # Controlar la velocidad del video
            if frame_delay > 0:
                tiempo_actual = time.perf_counter()
                siguiente_frame = tiempo_inicio + (frames_procesados + 1) * frame_delay
                tiempo_espera = siguiente_frame - tiempo_actual
                if tiempo_espera > 0:
                    time.sleep(tiempo_espera)
            
            try:
                ret, frame = self.cap.read()
                if ret:
                    frames_fallidos = 0  # Reiniciar contador de fallos
                    # Procesar el frame antes de ponerlo en la cola
                    if self.tipo == 'VIDEO':
                        # Mantener la relación de aspecto original
                        height, width = frame.shape[:2]
                        if height != self.height or width != self.width:
                            # Calcular nueva dimensión manteniendo aspecto
                            aspect = self.width / self.height
                            new_width = width
                            new_height = int(width / aspect)
                            if new_height > height:
                                new_height = height
                                new_width = int(height * aspect)
                            # Centrar la imagen
                            y = (height - new_height) // 2
                            x = (width - new_width) // 2
                            frame = cv2.resize(frame, (new_width, new_height))
                            # Crear fondo negro del tamaño original
                            temp = np.zeros((height, width, 3), dtype=np.uint8)
                            # Colocar la imagen redimensionada en el centro
                            temp[y:y+new_height, x:x+new_width] = frame
                            frame = temp
                    
                    # Siempre mantener el frame más reciente
                    while True:
                        try:
                            # Intentar poner el frame en la cola
                            self.frame_queue.put((datetime.now(), frame), block=False)
                            break
                        except queue.Full:
                            # Si la cola está llena, sacar el frame más antiguo
                            try:
                                self.frame_queue.get_nowait()
                            except queue.Empty:
                                pass
                    
                    frames_procesados += 1
                    if frames_procesados % 10 == 0:  # Mostrar FPS más frecuentemente
                        tiempo_actual = time.perf_counter()
                        tiempo_transcurrido = tiempo_actual - tiempo_inicio
                        if tiempo_transcurrido > 0:
                            fps_reales = frames_procesados / tiempo_transcurrido
                            print(f"Velocidad de procesamiento: {fps_reales:.2f} FPS")
                else:
                    frames_fallidos += 1
                    if frames_fallidos >= max_frames_fallidos:
                        if self.tipo == 'VIDEO':
                            print(f"Fin del video {self.nombre}")
                            self.running = False
                            break
                        else:
                            print(f"Demasiados frames fallidos en {self.nombre}, reintentando...")
                            # Reiniciar la cámara
                            self.cap.release()
                            time.sleep(1)  # Esperar antes de reintentar
                            self.cap = cv2.VideoCapture(self.source)
                            if not self.cap.isOpened():
                                print(f"No se pudo reiniciar {self.nombre}")
                                self.running = False
                                break
                            # Reconfigurar parámetros
                            self.cap.set(cv2.CAP_PROP_FRAME_WIDTH, self.resolucion['width'])
                            self.cap.set(cv2.CAP_PROP_FRAME_HEIGHT, self.resolucion['height'])
                            self.cap.set(cv2.CAP_PROP_FPS, self.fps)
                            frames_fallidos = 0
            except Exception as e:
                print(f"Error al capturar frame en {self.nombre}: {str(e)}")
                frames_fallidos += 1
                if frames_fallidos >= max_frames_fallidos:
                    print(f"Demasiados errores consecutivos en {self.nombre}, deteniendo...")
                    self.running = False
                    break
            
    def obtener_frame(self):
        try:
            timestamp, frame = self.frame_queue.get_nowait()
            return True, timestamp, frame
        except queue.Empty:
            return False, None, None
            
    def detener(self):
        print(f"Deteniendo {self.nombre}...")
        if self.running:
            self.running = False
            if hasattr(self, 'thread') and self.thread and self.thread.is_alive():
                try:
                    self.thread.join(timeout=2.0)  # Esperar máximo 2 segundos
                except Exception as e:
                    print(f"Error al detener thread de {self.nombre}: {str(e)}")
        
        if self.cap and self.cap.isOpened():
            try:
                self.cap.release()
                print(f"Recursos de cámara {self.nombre} liberados")
            except Exception as e:
                print(f"Error al liberar recursos de {self.nombre}: {str(e)}")
        
        print(f"{self.nombre} detenido")
            
    def __del__(self):
        self.detener()
