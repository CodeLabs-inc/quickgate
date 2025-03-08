import cv2

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

# Configuración del API
API_CONFIG = {
    'url': 'http://localhost:5000/registro',  # URL local para pruebas
    'headers': {
        'Content-Type': 'application/json'
    }
}
