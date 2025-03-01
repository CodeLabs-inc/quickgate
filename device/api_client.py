import requests
import json
from datetime import datetime

class APIClient:
    def __init__(self, config):
        self.url = config['url']
        self.headers = config['headers']
        
    def registrar_placa(self, placa, tipo_registro, timestamp):
        """
        Registra una placa en el API
        :param placa: Número de placa detectado
        :param tipo_registro: 'entrada' o 'salida'
        :param timestamp: Momento de la detección
        """
        datos = {
            'placa': placa,
            'tipo_registro': tipo_registro,
            'timestamp': timestamp.isoformat(),
        }
        
        try:
            response = requests.post(
                self.url,
                headers=self.headers,
                json=datos
            )
            response.raise_for_status()
            return True, response.json()
        except requests.exceptions.RequestException as e:
            return False, str(e)
