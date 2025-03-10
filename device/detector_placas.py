import cv2
import tkinter as tk
from tkinter import ttk
import time
from PIL import Image, ImageTk
import numpy as np
import easyocr
import socket
import hashlib
import requests
import json
import subprocess
from datetime import datetime
from config import CAMERA_ENTRADA, CAMERA_SALIDA, DETECTION_CONFIG, DEVICE_CONFIG, API_CONFIG

def get_tailscale_ip():
    """Obtiene la IP de la interfaz de Tailscale"""
    try:
        # Ejecutar el comando 'tailscale ip' para obtener la IP
        result = subprocess.run(['tailscale', 'ip'], capture_output=True, text=True)
        if result.returncode == 0:
            return result.stdout.strip()
        
        # Si el comando falla, intentar obtener la IP de la interfaz Tailscale
        result = subprocess.run(['ipconfig'], capture_output=True, text=True)
        if result.returncode == 0:
            lines = result.stdout.split('\n')
            tailscale_section = False
            for line in lines:
                if 'Tailscale' in line:
                    tailscale_section = True
                elif tailscale_section and 'IPv4' in line:
                    return line.split(':')[1].strip()
        
        # Si todo falla, usar la IP del hostname
        return socket.gethostbyname(socket.gethostname())
    except Exception as e:
        print(f"Error obteniendo IP de Tailscale: {str(e)}")
        return socket.gethostbyname(socket.gethostname())

class LoginWindow:
    def __init__(self):
        self.root = tk.Tk()
        self.root.title("QuickGate - Login")
        self.root.attributes('-topmost', True)  # Mantener ventana siempre encima
        self.token = None
        
        # Credenciales locales
        self.local_credentials = {
            "admin": hashlib.sha256("admin".encode()).hexdigest()
        }
        
        self.setup_ui()
    
    def setup_ui(self):
        """Configura la interfaz de usuario"""
        main_frame = ttk.Frame(self.root, padding="20")
        main_frame.grid(row=0, column=0, sticky=(tk.W, tk.E, tk.N, tk.S))
        
        # Título
        title_label = ttk.Label(main_frame, text="QuickGate - Sistema de Detección de Placas", font=('Helvetica', 12, 'bold'))
        title_label.grid(row=0, column=0, columnspan=2, pady=(0, 20))
        
        # Username
        ttk.Label(main_frame, text="Usuario:").grid(row=1, column=0, sticky=tk.W, pady=5)
        self.username_entry = ttk.Entry(main_frame)
        self.username_entry.grid(row=1, column=1, sticky=(tk.W, tk.E), pady=5)
        
        # Password
        ttk.Label(main_frame, text="Contraseña:").grid(row=2, column=0, sticky=tk.W, pady=5)
        self.password_entry = ttk.Entry(main_frame, show="*")
        self.password_entry.grid(row=2, column=1, sticky=(tk.W, tk.E), pady=5)
        
        # Login button
        login_button = ttk.Button(main_frame, text="Iniciar Sesión", command=self.login)
        login_button.grid(row=3, column=0, columnspan=2, pady=20)
        
        # Status label
        self.status_label = ttk.Label(main_frame, text="")
        self.status_label.grid(row=4, column=0, columnspan=2)
        
        # Configure grid weights
        self.root.columnconfigure(0, weight=1)
        self.root.rowconfigure(0, weight=1)
        main_frame.columnconfigure(1, weight=1)
        
        # Center window
        self.root.update_idletasks()
        width = self.root.winfo_width()
        height = self.root.winfo_height()
        x = (self.root.winfo_screenwidth() // 2) - (width // 2)
        y = (self.root.winfo_screenheight() // 2) - (height // 2)
        self.root.geometry('{}x{}+{}+{}'.format(width, height, x, y))
        
        # Bind Enter key to login
        self.root.bind('<Return>', lambda e: self.login())
    
    def login(self):
        """Maneja el proceso de login"""
        try:
            username = self.username_entry.get()
            password = self.password_entry.get()
            
            if username in self.local_credentials and self.local_credentials[username] == hashlib.sha256(password.encode()).hexdigest():
                self.status_label.config(text="Acceso concedido", foreground="green")
                self.token = "local_auth_token"
                self.root.after(1000, self.start_detector)
            else:
                self.status_label.config(text="Credenciales inválidas", foreground="red")
        except Exception as e:
            self.status_label.config(text=f"Error: {str(e)}", foreground="red")
    
    def start_detector(self):
        """Inicia el detector después del login"""
        self.root.destroy()
        root = tk.Tk()
        root.attributes('-topmost', True)  # Mantener ventana siempre encima
        app = DetectorGUI(root)
        root.protocol("WM_DELETE_WINDOW", app.cleanup)
        root.mainloop()
    
    def run(self):
        """Inicia la aplicación"""
        self.root.mainloop()

class DetectorAPI:
    def __init__(self):
        self.base_url = API_CONFIG['base_url']
        self.token = None
        self.device_ip = get_tailscale_ip()
        
    def login(self):
        """Obtiene el token de autenticación del API"""
        try:
            response = requests.post(
                f"{self.base_url}{API_CONFIG['endpoints']['login']}", 
                json={
                    "username": DEVICE_CONFIG['auth']['username'],
                    "password": DEVICE_CONFIG['auth']['password']
                },
                verify=True
            )
            
            if response.status_code == 200:
                data = response.json()
                if data.get('success') and data.get('data'):
                    self.token = data['data']
                    print("Login exitoso")
                    return True
                else:
                    print(f"Error en formato de respuesta: {data}")
            else:
                print(f"Error en login: {response.status_code} - {response.text}")
            return False
        except Exception as e:
            print(f"Error en login API: {str(e)}")
            return False
            
    def send_detection(self, plate_data, camera_type):
        """Envía una detección al API"""
        if not self.token:
            if not self.login():
                return False
                
        try:
            headers = {'Authorization': f'Bearer {self.token}'}
            data = {
                "plate": plate_data['text']
            }
            
            # Seleccionar el endpoint según el tipo de cámara
            endpoint = API_CONFIG['endpoints']['enter'] if camera_type == 'entrada' else API_CONFIG['endpoints']['exit']
            
            print(f"\n=== Enviando detección ===")
            print(f"Placa: {plate_data['text']}")
            print(f"Tipo: {camera_type}")
            print(f"Endpoint: {endpoint}")
            print(f"Confianza: {plate_data['confidence']:.2%}")
            
            response = requests.post(
                f"{self.base_url}{endpoint}", 
                json=data,
                headers=headers,
                verify=True
            )
            
            print(f"\n=== Respuesta del servidor ===")
            print(f"Status: {response.status_code}")
            print(f"Respuesta: {response.text}")
            
            if response.status_code == 200:
                data = response.json()
                if data.get('success'):
                    print(f"\n✅ Detección procesada correctamente")
                    print(f"Mensaje: {data.get('message', 'OK')}")
                    return True
            elif response.status_code == 401:
                print("\n❌ Token expirado, reintentando login...")
                self.token = None
                if self.login():
                    return self.send_detection(plate_data, camera_type)
            else:
                print(f"\n❌ Error enviando detección: {response.status_code}")
                print(f"Detalle: {response.text}")
            return False
        except Exception as e:
            print(f"\n❌ Error de conexión: {str(e)}")
            return False

class DetectorGUI:
    def __init__(self, root):
        self.root = root
        self.root.title("QuickGate - Detector de Placas")
        self.root.attributes('-topmost', True)
        
        # Inicializar API y hacer login inicial
        self.api = DetectorAPI()
        if not self.api.login():
            print("Error: No se pudo conectar con el API")
        
        # Configurar el frame principal
        self.main_frame = ttk.Frame(self.root, padding="10")
        self.main_frame.grid(row=0, column=0, sticky=(tk.W, tk.E, tk.N, tk.S))
        
        # Frame para información del equipo
        self.device_frame = ttk.LabelFrame(self.main_frame, text="Información del Equipo", padding="5")
        self.device_frame.grid(row=0, column=0, sticky=(tk.W, tk.E, tk.N, tk.S), padx=5, pady=5)
        
        # Información del equipo
        ttk.Label(self.device_frame, text=f"Nombre: {DEVICE_CONFIG['nombre']}", font=('Helvetica', 10, 'bold')).grid(row=0, column=0, sticky=tk.W, padx=5, pady=2)
        ttk.Label(self.device_frame, text=f"IP: {self.api.device_ip}").grid(row=1, column=0, sticky=tk.W, padx=5, pady=2)
        ttk.Label(self.device_frame, text=f"Gate ID: {DEVICE_CONFIG['gate_id']}").grid(row=2, column=0, sticky=tk.W, padx=5, pady=2)
        ttk.Label(self.device_frame, text=f"Cámara Entrada: {CAMERA_ENTRADA['nombre']}").grid(row=3, column=0, sticky=tk.W, padx=5, pady=2)
        ttk.Label(self.device_frame, text=f"Cámara Salida: {CAMERA_SALIDA['nombre']}").grid(row=4, column=0, sticky=tk.W, padx=5, pady=2)
        
        # Frame para estadísticas
        self.stats_frame = ttk.LabelFrame(self.main_frame, text="Estadísticas", padding="5")
        self.stats_frame.grid(row=1, column=0, sticky=(tk.W, tk.E, tk.N, tk.S), padx=5, pady=5)
        
        # Variables para estadísticas
        self.entrada_detections = 0
        self.salida_detections = 0
        self.entrada_last_plate = tk.StringVar(value="Última Placa Entrada: -")
        self.salida_last_plate = tk.StringVar(value="Última Placa Salida: -")
        self.entrada_confidence = tk.StringVar(value="Confianza Entrada: -")
        self.salida_confidence = tk.StringVar(value="Confianza Salida: -")
        self.entrada_count = tk.StringVar(value="Detecciones Entrada: 0")
        self.salida_count = tk.StringVar(value="Detecciones Salida: 0")
        self.entrada_status = tk.StringVar(value="Estado: Esperando...")
        self.salida_status = tk.StringVar(value="Estado: Esperando...")
        self.entrada_server = tk.StringVar(value="Servidor: -")
        self.salida_server = tk.StringVar(value="Servidor: -")
        
        # Estadísticas de entrada
        ttk.Label(self.stats_frame, textvariable=self.entrada_count).grid(row=0, column=0, sticky=tk.W, padx=5, pady=2)
        ttk.Label(self.stats_frame, textvariable=self.entrada_last_plate, font=('Helvetica', 10, 'bold')).grid(row=1, column=0, sticky=tk.W, padx=5, pady=2)
        ttk.Label(self.stats_frame, textvariable=self.entrada_confidence).grid(row=2, column=0, sticky=tk.W, padx=5, pady=2)
        ttk.Label(self.stats_frame, textvariable=self.entrada_status, foreground='blue').grid(row=3, column=0, sticky=tk.W, padx=5, pady=2)
        ttk.Label(self.stats_frame, textvariable=self.entrada_server, foreground='green').grid(row=4, column=0, sticky=tk.W, padx=5, pady=2)
        
        # Estadísticas de salida
        ttk.Label(self.stats_frame, textvariable=self.salida_count).grid(row=5, column=0, sticky=tk.W, padx=5, pady=(10,2))
        ttk.Label(self.stats_frame, textvariable=self.salida_last_plate, font=('Helvetica', 10, 'bold')).grid(row=6, column=0, sticky=tk.W, padx=5, pady=2)
        ttk.Label(self.stats_frame, textvariable=self.salida_confidence).grid(row=7, column=0, sticky=tk.W, padx=5, pady=2)
        ttk.Label(self.stats_frame, textvariable=self.salida_status, foreground='blue').grid(row=8, column=0, sticky=tk.W, padx=5, pady=2)
        ttk.Label(self.stats_frame, textvariable=self.salida_server, foreground='green').grid(row=9, column=0, sticky=tk.W, padx=5, pady=2)
        
        # Frame para las cámaras
        self.cameras_frame = ttk.Frame(self.main_frame)
        self.cameras_frame.grid(row=2, column=0, sticky=(tk.W, tk.E, tk.N, tk.S), padx=5, pady=5)
        
        # Label para cámara de entrada
        ttk.Label(self.cameras_frame, text="Cámara de Entrada").grid(row=0, column=0, pady=5)
        self.entrada_label = ttk.Label(self.cameras_frame)
        self.entrada_label.grid(row=1, column=0, padx=5)
        
        # Label para cámara de salida
        ttk.Label(self.cameras_frame, text="Cámara de Salida").grid(row=0, column=1, pady=5)
        self.salida_label = ttk.Label(self.cameras_frame)
        self.salida_label.grid(row=1, column=1, padx=5)
        
        # Configurar expansión
        self.root.columnconfigure(0, weight=1)
        self.root.rowconfigure(0, weight=1)
        self.main_frame.columnconfigure(0, weight=1)
        self.main_frame.rowconfigure(2, weight=1)
        self.cameras_frame.columnconfigure(0, weight=1)
        self.cameras_frame.columnconfigure(1, weight=1)
        
        # Inicializar cámaras
        self.cap_entrada = cv2.VideoCapture(CAMERA_ENTRADA["id"])
        self.cap_salida = cv2.VideoCapture(CAMERA_SALIDA["id"])
        
        # Configurar resolución
        self.cap_entrada.set(cv2.CAP_PROP_FRAME_WIDTH, CAMERA_ENTRADA["resolucion"]["width"])
        self.cap_entrada.set(cv2.CAP_PROP_FRAME_HEIGHT, CAMERA_ENTRADA["resolucion"]["height"])
        self.cap_salida.set(cv2.CAP_PROP_FRAME_WIDTH, CAMERA_SALIDA["resolucion"]["width"])
        self.cap_salida.set(cv2.CAP_PROP_FRAME_HEIGHT, CAMERA_SALIDA["resolucion"]["height"])
        
        if not self.cap_entrada.isOpened():
            self.entrada_status.set("Estado: Error en cámara de entrada")
        if not self.cap_salida.isOpened():
            self.salida_status.set("Estado: Error en cámara de salida")
        
        # Variables para control de detección
        self.last_detection_time = {'entrada': 0, 'salida': 0}
        self.last_plate = {'entrada': None, 'salida': None}
        
        # Inicializar OCR
        self.reader = easyocr.Reader(['en'])
        
        # Iniciar actualización
        self.update_cameras()
    
    def detect_license_plate(self, frame):
        """Detecta y lee la placa en el frame"""
        # Convertir a escala de grises
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        
        # Aplicar umbral adaptativo
        thresh = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY_INV, 11, 2)
        
        # Encontrar contornos
        contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        
        # Filtrar contornos por área y proporción
        possible_plates = []
        for cnt in contours:
            area = cv2.contourArea(cnt)
            if area > DETECTION_CONFIG["min_area"]:
                x, y, w, h = cv2.boundingRect(cnt)
                aspect_ratio = float(w)/h
                if DETECTION_CONFIG["aspect_ratio"]["min"] <= aspect_ratio <= DETECTION_CONFIG["aspect_ratio"]["max"]:
                    possible_plates.append((x, y, w, h))
        
        # Procesar posibles placas
        for x, y, w, h in possible_plates:
            # Extraer región de la placa
            plate_region = frame[y:y+h, x:x+w]
            
            # Usar EasyOCR para leer el texto
            results = self.reader.readtext(plate_region)
            
            for (bbox, text, prob) in results:
                # Filtrar por confianza mínima
                if prob > DETECTION_CONFIG["min_confidence"]:
                    # Limpiar y formatear el texto de la placa
                    text = text.strip().upper()  # Convertir a mayúsculas y eliminar espacios
                    
                    # Buscar el patrón: una letra seguida de números
                    import re
                    plate_match = re.search(r'[A-Z][0-9]+', text)
                    
                    if plate_match:
                        plate_text = plate_match.group(0)
                        return {
                            'text': plate_text,
                            'confidence': prob,
                            'bbox': (x, y, w, h)
                        }
        
        return None
    
    def process_frame(self, frame, camera_type):
        """Procesa un frame para detección de placas"""
        # Detectar placa
        plate_data = self.detect_license_plate(frame)
        
        # Si se detectó una placa con suficiente confianza
        if plate_data and plate_data['confidence'] >= DETECTION_CONFIG['min_confidence']:
            # Actualizar GUI con la detección
            self.update_detection_display(plate_data, camera_type)
            
            # Dibujar rectángulo y texto
            cv2.rectangle(frame, 
                        (plate_data['bbox'][0], plate_data['bbox'][1]), 
                        (plate_data['bbox'][2], plate_data['bbox'][3]), 
                        (0, 255, 0), 2)
            cv2.putText(frame, 
                       f"{plate_data['text']} ({plate_data['confidence']:.2%})", 
                       (plate_data['bbox'][0], plate_data['bbox'][1] - 10), 
                       cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)
        
        return frame
    
    def process_detection(self, plate_data, camera_type):
        """Procesa una detección y la envía al servidor"""
        # Actualizar GUI
        self.update_detection_display(plate_data, camera_type)
        
        # Enviar al API
        try:
            # Actualizar estado a "Enviando..."
            if camera_type == 'entrada':
                self.entrada_status.set("Estado: Enviando... 🔄")
                self.entrada_server.set("Servidor: Procesando...")
            else:
                self.salida_status.set("Estado: Enviando... 🔄")
                self.salida_server.set("Servidor: Procesando...")
            
            # Actualizar GUI para mostrar el estado
            self.root.update()
            
            # Enviar detección
            success = self.api.send_detection(plate_data, camera_type)
            
            # Actualizar estado según respuesta
            if camera_type == 'entrada':
                self.entrada_status.set(f"Estado: {'Enviada ✅' if success else 'Error ❌'}")
                self.entrada_server.set(f"Servidor: {'Puerta Abierta 🚪' if success else 'Error ⚠️'}")
            else:
                self.salida_status.set(f"Estado: {'Enviada ✅' if success else 'Error ❌'}")
                self.salida_server.set(f"Servidor: {'Puerta Abierta 🚪' if success else 'Error ⚠️'}")
            
        except Exception as e:
            # Actualizar estado en caso de error
            if camera_type == 'entrada':
                self.entrada_status.set("Estado: Error de conexión ❌")
                self.entrada_server.set(f"Servidor: {str(e)}")
            else:
                self.salida_status.set("Estado: Error de conexión ❌")
                self.salida_server.set(f"Servidor: {str(e)}")
                
    def update_detection_display(self, plate_info, camera_type):
        """Actualiza la información de detección en la GUI"""
        current_time = time.time()
        
        # Verificar cooldown y que no sea la misma placa
        if (current_time - self.last_detection_time[camera_type] > DETECTION_CONFIG["cooldown"] and 
            plate_info['text'] != self.last_plate[camera_type]):
            
            self.entrada_detections += 1 if camera_type == 'entrada' else 0
            self.salida_detections += 1 if camera_type == 'salida' else 0
            
            if camera_type == 'entrada':
                self.entrada_count.set(f"Detecciones Entrada: {self.entrada_detections}")
                self.entrada_last_plate.set(f"Última Placa Entrada: {plate_info['text']}")
                self.entrada_confidence.set(f"Confianza Entrada: {plate_info['confidence']:.2%}")
            else:
                self.salida_count.set(f"Detecciones Salida: {self.salida_detections}")
                self.salida_last_plate.set(f"Última Placa Salida: {plate_info['text']}")
                self.salida_confidence.set(f"Confianza Salida: {plate_info['confidence']:.2%}")
            
            self.last_detection_time[camera_type] = current_time
            self.last_plate[camera_type] = plate_info['text']
            
            # Procesar la detección y enviarla al servidor
            self.process_detection(plate_info, camera_type)
            
    def update_cameras(self):
        """Actualiza las imágenes de ambas cámaras"""
        # Actualizar cámara de entrada
        ret_entrada, frame_entrada = self.cap_entrada.read()
        if ret_entrada:
            frame_entrada = self.process_frame(frame_entrada, 'entrada')
            frame_entrada = cv2.cvtColor(frame_entrada, cv2.COLOR_BGR2RGB)
            frame_entrada = cv2.resize(frame_entrada, (400, 300))
            
            # Convertir frame a formato PhotoImage
            image_entrada = Image.fromarray(frame_entrada)
            photo_entrada = ImageTk.PhotoImage(image=image_entrada)
            self.entrada_label.config(image=photo_entrada)
            self.entrada_label.image = photo_entrada
        
        # Actualizar cámara de salida
        ret_salida, frame_salida = self.cap_salida.read()
        if ret_salida:
            frame_salida = self.process_frame(frame_salida, 'salida')
            frame_salida = cv2.cvtColor(frame_salida, cv2.COLOR_BGR2RGB)
            frame_salida = cv2.resize(frame_salida, (400, 300))
            
            # Convertir frame a formato PhotoImage
            image_salida = Image.fromarray(frame_salida)
            photo_salida = ImageTk.PhotoImage(image=image_salida)
            self.salida_label.config(image=photo_salida)
            self.salida_label.image = photo_salida
        
        # Programar próxima actualización
        self.root.after(30, self.update_cameras)
    
    def cleanup(self):
        """Limpia recursos al cerrar"""
        if self.cap_entrada.isOpened():
            self.cap_entrada.release()
        if self.cap_salida.isOpened():
            self.cap_salida.release()

if __name__ == "__main__":
    print("Iniciando QuickGate - Sistema de Detección de Placas")
    login_window = LoginWindow()
    login_window.run()
