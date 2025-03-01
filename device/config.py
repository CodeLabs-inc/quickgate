# Configuración de cámaras
CAMERA_ENTRADA = {
    'tipo': 'USB',  # Puede ser 'USB' o 'IP'
    'source': 0,    # Número de dispositivo USB o URL de la cámara IP
    'nombre': 'entrada'
}

CAMERA_SALIDA = {
    'tipo': 'USB',  # Puede ser 'USB' o 'IP'
    'source': 1,    # Número de dispositivo USB o URL de la cámara IP
    'nombre': 'salida'
}

# Configuración del API
API_CONFIG = {
    'url': 'http://tu-api-url.com/registro',  # URL del API que procesará las placas
    'headers': {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer tu-token-aqui'  # Si es necesario
    }
}
