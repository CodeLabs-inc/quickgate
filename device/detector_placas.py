import cv2
import time
from datetime import datetime
import logging
import json
import requests
import sys
import tkinter as tk
from tkinter import ttk
import hashlib
from config import CAMERA_ENTRADA, API_CONFIG, DEVICE_CONFIG

def hash_password(password):
    """Hash the password using SHA256"""
    sha256 = hashlib.sha256()
    sha256.update(password.encode())
    return sha256.hexdigest()

class DetectorGUI:
    def __init__(self, root):
        self.root = root
        self.root.title("QuickGate - Detector de Placas")
        
        # Configurar el frame principal
        self.main_frame = ttk.Frame(self.root, padding="10")
        self.main_frame.grid(row=0, column=0, sticky=(tk.W, tk.E, tk.N, tk.S))
        
        # Frame para información del equipo
        self.device_frame = ttk.LabelFrame(self.main_frame, text="Información del Equipo", padding="5")
        self.device_frame.grid(row=0, column=0, sticky=(tk.W, tk.E, tk.N, tk.S), padx=5, pady=5)
        
        # Obtener IP de Tailscale
        import socket
        hostname = socket.gethostname()
        try:
            ip_address = socket.gethostbyname(hostname)
        except:
            ip_address = "No disponible"
        
        # Información del equipo
        ttk.Label(self.device_frame, text=f"Nombre: {DEVICE_CONFIG['nombre']}").grid(row=0, column=0, sticky=tk.W, padx=5, pady=2)
        ttk.Label(self.device_frame, text=f"IP: {ip_address}").grid(row=1, column=0, sticky=tk.W, padx=5, pady=2)
        ttk.Label(self.device_frame, text=f"Cámaras activas: 2 (Entrada/Salida)").grid(row=2, column=0, sticky=tk.W, padx=5, pady=2)
        
        # Frame para estadísticas
        self.stats_frame = ttk.LabelFrame(self.main_frame, text="Estadísticas", padding="5")
        self.stats_frame.grid(row=1, column=0, sticky=(tk.W, tk.E, tk.N, tk.S), padx=5, pady=5)
        
        # Contador de detecciones
        self.detections_count = 0
        self.detections_label = ttk.Label(self.stats_frame, text="Detecciones: 0")
        self.detections_label.grid(row=0, column=0, sticky=tk.W, padx=5, pady=2)
        
        # Estado de la cámara
        self.camera_status = ttk.Label(self.stats_frame, text="Estado: Conectado", foreground="green")
        self.camera_status.grid(row=1, column=0, sticky=tk.W, padx=5, pady=2)
        
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
        self.cap_salida = cv2.VideoCapture(1)  # Asumimos que la cámara de salida es ID 1
        
        if not self.cap_entrada.isOpened():
            self.camera_status.config(text="Estado: Error en cámara de entrada", foreground="red")
        if not self.cap_salida.isOpened():
            self.camera_status.config(text="Estado: Error en cámara de salida", foreground="red")
        
        # Iniciar actualización
        self.update_cameras()
    
    def update_cameras(self):
        """Actualiza las imágenes de ambas cámaras"""
        # Actualizar cámara de entrada
        ret_entrada, frame_entrada = self.cap_entrada.read()
        if ret_entrada:
            frame_entrada = cv2.cvtColor(frame_entrada, cv2.COLOR_BGR2RGB)
            frame_entrada = cv2.resize(frame_entrada, (400, 300))
            
            # Simular detección cada 5 segundos
            current_time = time.time()
            if hasattr(self, 'last_detection_time'):
                if current_time - self.last_detection_time >= 5:
                    self.detections_count += 1
                    self.detections_label.config(text=f"Detecciones: {self.detections_count}")
                    # Dibujar rectángulo y texto en el frame
                    cv2.rectangle(frame_entrada, (50, 50), (350, 250), (0, 255, 0), 2)
                    plate_number = f"ABC{self.detections_count:03d}"
                    cv2.putText(frame_entrada, plate_number, (50, 40), 
                              cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
                    self.last_detection_time = current_time
            else:
                self.last_detection_time = current_time
            
            # Convertir frame a formato PhotoImage
            from PIL import Image, ImageTk
            image_entrada = Image.fromarray(frame_entrada)
            photo_entrada = ImageTk.PhotoImage(image=image_entrada)
            self.entrada_label.config(image=photo_entrada)
            self.entrada_label.image = photo_entrada
        
        # Actualizar cámara de salida
        ret_salida, frame_salida = self.cap_salida.read()
        if ret_salida:
            frame_salida = cv2.cvtColor(frame_salida, cv2.COLOR_BGR2RGB)
            frame_salida = cv2.resize(frame_salida, (400, 300))
            
            # Convertir frame a formato PhotoImage
            from PIL import Image, ImageTk
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

class LoginWindow:
    def __init__(self):
        self.root = tk.Tk()
        self.root.title("QuickGate - Inicio de Sesión")
        self.root.geometry("400x300")
        self.token = None
        
        # Credenciales locales
        self.local_credentials = {
            "admin": hash_password("admin")
        }
        
        self.setup_ui()
        
    def setup_ui(self):
        # Frame principal
        main_frame = ttk.Frame(self.root, padding="20")
        main_frame.grid(row=0, column=0, sticky=(tk.W, tk.E, tk.N, tk.S))
        
        # Título
        title_label = ttk.Label(main_frame, text="QuickGate", font=('Helvetica', 16, 'bold'))
        title_label.grid(row=0, column=0, columnspan=2, pady=20)
        
        # Usuario
        ttk.Label(main_frame, text="Usuario:").grid(row=1, column=0, sticky=tk.W, pady=5)
        self.username_entry = ttk.Entry(main_frame)
        self.username_entry.grid(row=1, column=1, sticky=(tk.W, tk.E), pady=5)
        
        # Contraseña
        ttk.Label(main_frame, text="Contraseña:").grid(row=2, column=0, sticky=tk.W, pady=5)
        self.password_entry = ttk.Entry(main_frame, show="*")
        self.password_entry.grid(row=2, column=1, sticky=(tk.W, tk.E), pady=5)
        
        # Estado
        self.status_label = ttk.Label(main_frame, text="")
        self.status_label.grid(row=3, column=0, columnspan=2, pady=5)
        
        # Botón de inicio de sesión
        login_button = ttk.Button(main_frame, text="Iniciar Sesión", command=self.login)
        login_button.grid(row=4, column=0, columnspan=2, pady=20)
        
        # Configurar expansión
        main_frame.columnconfigure(1, weight=1)
        
        # Centrar ventana
        self.center_window()
        
    def center_window(self):
        """Centra la ventana en la pantalla"""
        self.root.update_idletasks()
        width = self.root.winfo_width()
        height = self.root.winfo_height()
        x = (self.root.winfo_screenwidth() // 2) - (width // 2)
        y = (self.root.winfo_screenheight() // 2) - (height // 2)
        self.root.geometry(f'{width}x{height}+{x}+{y}')
        
    def login(self):
        """Verifica las credenciales localmente"""
        try:
            username = self.username_entry.get()
            password = self.password_entry.get()
            
            if username in self.local_credentials and self.local_credentials[username] == hash_password(password):
                self.status_label.config(text="Acceso concedido", foreground="green")
                self.token = "local_auth_token"
                self.root.after(1000, self.start_detector)
            else:
                self.status_label.config(text="Credenciales inválidas", foreground="red")
                
        except Exception as e:
            self.status_label.config(text="Error al iniciar sesión", foreground="red")
            print(f"Error de inicio de sesión: {str(e)}")
    
    def start_detector(self):
        """Inicia el detector después del login exitoso"""
        self.root.withdraw()  # Ocultar ventana de login
        detector_root = tk.Toplevel()
        detector_root.protocol("WM_DELETE_WINDOW", lambda: self.cleanup(detector_root))
        self.detector = DetectorGUI(detector_root)
        
    def cleanup(self, detector_root):
        """Limpia recursos y cierra la aplicación"""
        if hasattr(self, 'detector'):
            self.detector.cleanup()
        detector_root.destroy()
        self.root.destroy()
            
    def run(self):
        """Ejecuta la interfaz de login"""
        self.root.mainloop()
        return self.token

def main():
    print("Iniciando QuickGate - Sistema de Detección de Placas")
    print("Por favor, inicie sesión para continuar...")
    
    login_window = LoginWindow()
    token = login_window.run()
    
    if token:
        print("Sesión iniciada correctamente")
    else:
        print("Error al iniciar sesión")
        sys.exit(1)

if __name__ == "__main__":
    main()
