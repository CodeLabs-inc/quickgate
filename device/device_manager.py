import os
import json
import socket
import requests
import netifaces
import subprocess
from pathlib import Path

class DeviceManager:
    def __init__(self, config):
        self.config = config
        self.device_info = None
        self.auth_token = None
        self.credentials_file = Path("device_credentials.json")
        
    def get_tailscale_ip(self):
        """Obtiene la IP asignada por Tailscale"""
        try:
            # Buscar la interfaz de Tailscale
            for iface in netifaces.interfaces():
                if iface.startswith('tailscale'):
                    addrs = netifaces.ifaddresses(iface)
                    if netifaces.AF_INET in addrs:
                        return addrs[netifaces.AF_INET][0]['addr']
            return None
        except Exception as e:
            print(f"Error obteniendo IP de Tailscale: {e}")
            return None
            
    def get_device_info(self):
        """Recopila información del dispositivo"""
        hostname = socket.gethostname()
        tailscale_ip = self.get_tailscale_ip()
        
        return {
            "hostname": hostname,
            "tailscale_ip": tailscale_ip,
            "parking_id": self.config.get("parking_id"),
            "device_type": "camera_detector",
            "camera_position": self.config.get("camera_position", "entrada")
        }
        
    def load_credentials(self):
        """Carga credenciales guardadas"""
        if self.credentials_file.exists():
            try:
                with open(self.credentials_file, 'r') as f:
                    return json.load(f)
            except Exception as e:
                print(f"Error cargando credenciales: {e}")
        return None
        
    def save_credentials(self, credentials):
        """Guarda credenciales de forma segura"""
        try:
            with open(self.credentials_file, 'w') as f:
                json.dump(credentials, f)
        except Exception as e:
            print(f"Error guardando credenciales: {e}")
            
    async def login(self, username=None, password=None):
        """Realiza el login del dispositivo"""
        credentials = None
        
        # Si no se proporcionan credenciales, intentar cargar guardadas
        if not username or not password:
            credentials = self.load_credentials()
            if not credentials:
                raise ValueError("No hay credenciales disponibles")
            username = credentials.get("username")
            password = credentials.get("password")
            
        # Obtener información del dispositivo
        device_info = self.get_device_info()
        
        # Realizar login
        try:
            response = requests.post(
                f"{self.config['api_url']}/device/login",
                json={
                    "username": username,
                    "password": password,
                    "device_info": device_info
                }
            )
            
            if response.status_code == 200:
                data = response.json()
                self.auth_token = data["token"]
                self.device_info = device_info
                
                # Guardar credenciales si el login fue exitoso
                if not credentials:
                    self.save_credentials({
                        "username": username,
                        "password": password
                    })
                    
                return True
            else:
                print(f"Error en login: {response.text}")
                return False
                
        except Exception as e:
            print(f"Error en login: {e}")
            return False
            
    def is_authenticated(self):
        """Verifica si el dispositivo está autenticado"""
        return bool(self.auth_token and self.device_info)
        
    def get_auth_header(self):
        """Retorna el header de autenticación"""
        if not self.auth_token:
            raise ValueError("Dispositivo no autenticado")
        return {"Authorization": f"Bearer {self.auth_token}"}
