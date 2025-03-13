import os
import socket

# Parking configuration
PARKING_ID = "Agora"

# Camera configuration
CAMERA_ENTRADA = {
    "id": 0,  # Cámara principal (webcam integrada o primera USB)
    "nombre": "Cámara Entrada",
    "resolucion": {
        "width": 1280,
        "height": 720
    }
}

CAMERA_SALIDA = {
    "id": 1,  # Segunda cámara USB
    "nombre": "Cámara Salida",
    "resolucion": {
        "width": 1280,
        "height": 720
    }
}

# Configuración de detección
DETECTION_CONFIG = {
    "min_confidence": 0.45,  # Confianza mínima para considerar una detección válida
    "min_area": 1000,  # Área mínima del contorno
    "aspect_ratio": {  # Proporción de aspecto válida para placas
        "min": 2.0,
        "max": 5.0
    },
    "cooldown": 5  # Segundos entre detecciones de la misma placa
}

# Configuración del API y Base de Datos
API_CONFIG = {
    "base_url": "https://server.quickgate.xyz",
    "endpoints": {
        "login": "/device/login",
        "enter": "/ticket/enter/67980a17f8a1b530d25bd57a",  # Endpoint para entrada con gateId
        "exit": "/ticket/exit/67980a17f8a1b530d25bd57a"     # Endpoint para salida con gateId
    }
}

# Configuración del dispositivo
DEVICE_CONFIG = {
    "nombre": "QuickGate-Device-001",
    "auth": {
        "username": "agoraHQ",
        "password": "12345678"
    },
    "gate_id": "67980a17f8a1b530d25bd57a"  # ID del gate asignado
}
