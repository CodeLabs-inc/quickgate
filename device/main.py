import os
import sys
import asyncio
import logging
from datetime import datetime
from device_manager import DeviceManager
from detector_placas import DetectorPlacas
from config import DEVICE_CONFIG, API_CONFIG, CAMERA_ENTRADA

# Configurar logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('device.log'),
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)

class DeviceApplication:
    def __init__(self):
        self.device_manager = DeviceManager(DEVICE_CONFIG)
        self.detector = None
        self.running = False
        
    async def login(self):
        """Maneja el proceso de login del dispositivo"""
        max_attempts = 3
        attempt = 0
        
        while attempt < max_attempts:
            # Intentar login con credenciales guardadas
            try:
                if await self.device_manager.login():
                    logger.info("Login exitoso")
                    return True
            except ValueError:
                # No hay credenciales guardadas, solicitar al usuario
                username = input("Usuario del dispositivo: ")
                password = input("Contraseña: ")
                
                if await self.device_manager.login(username, password):
                    logger.info("Login exitoso")
                    return True
                    
            attempt += 1
            if attempt < max_attempts:
                logger.warning(f"Intento {attempt} fallido. Reintentando...")
                await asyncio.sleep(5)
                
        logger.error("Máximo de intentos alcanzado")
        return False
        
    async def initialize_detector(self):
        """Inicializa el detector de placas"""
        if not self.device_manager.is_authenticated():
            raise ValueError("Dispositivo no autenticado")
            
        self.detector = DetectorPlacas(
            nombre=DEVICE_CONFIG['device_name'],
            api_config={
                **API_CONFIG,
                'headers': {
                    **API_CONFIG['headers'],
                    **self.device_manager.get_auth_header()
                }
            }
        )
        
    async def send_heartbeat(self):
        """Envía señales de heartbeat al servidor"""
        while self.running:
            try:
                device_info = self.device_manager.get_device_info()
                # Agregar información adicional
                device_info.update({
                    'last_heartbeat': datetime.now().isoformat(),
                    'status': 'active',
                    'detections_count': self.detector.detecciones_totales if self.detector else 0
                })
                
                # Enviar heartbeat
                headers = {
                    **API_CONFIG['headers'],
                    **self.device_manager.get_auth_header()
                }
                
                async with aiohttp.ClientSession() as session:
                    async with session.post(
                        f"{API_CONFIG['base_url']}{API_CONFIG['status_endpoint']}",
                        json=device_info,
                        headers=headers
                    ) as response:
                        if response.status != 200:
                            logger.warning(f"Error en heartbeat: {await response.text()}")
                            
            except Exception as e:
                logger.error(f"Error enviando heartbeat: {e}")
                
            await asyncio.sleep(API_CONFIG['heartbeat_interval'])
            
    async def run(self):
        """Ejecuta la aplicación principal"""
        try:
            # Verificar Tailscale
            tailscale_ip = self.device_manager.get_tailscale_ip()
            if not tailscale_ip:
                logger.error("No se detectó conexión de Tailscale")
                return
                
            logger.info(f"IP de Tailscale detectada: {tailscale_ip}")
            
            # Realizar login
            if not await self.login():
                logger.error("No se pudo realizar el login")
                return
                
            # Inicializar detector
            await self.initialize_detector()
            
            # Iniciar heartbeat
            self.running = True
            heartbeat_task = asyncio.create_task(self.send_heartbeat())
            
            # Ejecutar detector
            try:
                await self.detector.run()
            except KeyboardInterrupt:
                logger.info("Deteniendo aplicación...")
            finally:
                self.running = False
                await heartbeat_task
                
        except Exception as e:
            logger.error(f"Error en la aplicación: {e}")
            raise
            
def main():
    app = DeviceApplication()
    try:
        asyncio.run(app.run())
    except KeyboardInterrupt:
        logger.info("Aplicación detenida por el usuario")
    except Exception as e:
        logger.error(f"Error fatal: {e}")
        sys.exit(1)
        
if __name__ == "__main__":
    main()
