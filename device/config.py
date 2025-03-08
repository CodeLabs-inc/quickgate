import cv2
import os
import socket

# Configuración del dispositivo
DEVICE_CONFIG = {
    'parking_id': os.getenv('PARKING_ID', 'Agora'),  # ID del parqueo
    'camera_position': os.getenv('CAMERA_POSITION', 'entrada'),  # Posición de la cámara
    'api_url': os.getenv('API_URL', 'http://localhost:3000/api'),  # URL del dashboard
    'device_name': os.getenv('DEVICE_NAME', socket.gethostname())  # Nombre del dispositivo
}

# Configuración de cámaras
# Configuración común para ambas cámaras
CAMARA_CONFIG_BASE = {
    'tipo': 'USB',
    'fps': 30,             # FPS estándar
    'max_intentos': 3,     # Más intentos para asegurar la conexión
    'tiempo_espera': 1,    # Espera entre intentos
    'timeout': 5,          # Timeout para inicialización
    'resolucion': {
        'width': 640,      # Resolución confirmada por prueba
        'height': 480
    },
    'parametros': {
        'backend': cv2.CAP_DSHOW  # Usar DirectShow en Windows
    }
}

# Configuración específica para cámara de entrada
CAMERA_ENTRADA = CAMARA_CONFIG_BASE.copy()
CAMERA_ENTRADA.update({
    'source': 0,           # Cámara USB en índice 0
    'nombre': 'entrada',
    'resolucion': {
        'width': 640,      # Resolución confirmada
        'height': 480
    }
})

# Configuración específica para cámara de salida - DESHABILITADA
CAMERA_SALIDA = None  # Solo tenemos una cámara disponible por ahora

# Configuración del API y autenticación
API_CONFIG = {
    'base_url': os.getenv('API_URL', 'http://localhost:3000/api'),
    'auth_endpoint': '/device/auth',
    'detection_endpoint': '/detections',
    'status_endpoint': '/device/status',
    'headers': {
        'Content-Type': 'application/json'
    },
    'retry_attempts': 3,
    'retry_delay': 5,  # segundos
    'heartbeat_interval': 60  # segundos
}
