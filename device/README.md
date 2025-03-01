# Detector de Placas Vehiculares
Created By: Ivan Garcia 
Date: 25/02/2025
Owner: CodeLab

Este proyecto permite detectar y leer placas de vehículos en videos utilizando OpenCV y EasyOCR.

## Requisitos

- Python 3.7 o superior
- Las dependencias listadas en `requirements.txt`

## Instalación

1. Crear un entorno virtual (recomendado):
```bash
python -m venv venv
venv\Scripts\activate
```

2. Instalar las dependencias:
```bash
pip install -r requirements.txt
```

## Uso

Para ejecutar el detector de placas, use el siguiente comando:

```bash
python detector_placas.py ruta_del_video.mp4
```

Durante la ejecución:
- Se mostrará una ventana con el video y las placas detectadas
- Las placas detectadas se mostrarán en la consola
- Presione 'q' para salir del programa

## Notas
- El programa funciona mejor con videos donde la placa es claramente visible
- La iluminación y el ángulo de la placa pueden afectar la precisión de la detección
