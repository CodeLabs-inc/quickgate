import React from 'react'
import { Alert, Image, Keyboard, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import Page from '@/components/global/Page'
import Title from '@/components/global/Title'
import Padding from '@/components/global/Padding'
import AlertCard from '@/components/global/Alert'
import Input from '@/components/inputs/Input'
import MagnifingGlassIcon from '@/components/icons/MagnifingGlass'
import ButtonGlobal from '@/components/buttons/ButtonGlobal'
import SupportButton from '@/components/buttons/SupportButton'
import { useRouter } from 'expo-router'
import LoaderGlobal from '@/components/animations/LoaderGlobal'
import { ScrollView } from 'react-native-gesture-handler'

const Index = () => {



    return (
        <Page>
            <Padding>
                <Title line1={'Términos y Condiciones'} style={{ zIndex: 3, flexDirection: 'row', gap: 4 }} goBack />

                <ScrollView style={styles.container}>
                    

                    <Text style={styles.sectionTitle}>1. Información General</Text>
                    <Text style={styles.text}>
                        Al utilizar nuestra aplicación de estacionamiento, usted acepta estos Términos y Condiciones. La aplicación le permite registrar la placa de su vehículo, rastrear los tiempos de entrada y salida, y pagar los servicios de estacionamiento utilizando un saldo recargado.
                    </Text>

                    <Text style={styles.sectionTitle}>2. Registro y Cuenta de Usuario</Text>
                    <Text style={styles.text}>
                        2.1 Para utilizar la aplicación, debe crear una cuenta proporcionando información personal precisa.
                    </Text>
                    <Text style={styles.text}>
                        2.2 Puede agregar múltiples placas de vehículos a su cuenta para gestionar diferentes vehículos.
                    </Text>
                    <Text style={styles.text}>
                        2.3 Usted es responsable de mantener la confidencialidad de sus credenciales de cuenta.
                    </Text>
                    <Text style={styles.text}>
                        2.4 Al registrar una placa, acepta que la aplicación puede realizar un seguimiento automático de sus entradas y salidas.
                    </Text>




                    <Text style={styles.sectionTitle}>3. Rastreo de Entrada y Salida</Text>
                    <Text style={styles.text}>
                        3.1 La aplicación rastreará automáticamente los tiempos de entrada y salida de los vehículos registrados en las instalaciones de estacionamiento participantes.
                    </Text>
                    <Text style={styles.text}>
                        3.2 En caso de problemas técnicos, el rastreo manual puede ser aplicado por el personal de la puerta.
                    </Text>
                    <Text style={styles.text}>
                        3.3 Es su responsabilidad verificar que la información de entrada y salida sea correcta antes de salir de la instalación.
                    </Text>

                    <Text style={styles.sectionTitle}>4. Pagos y Saldo</Text>
                    <Text style={styles.text}>
                        4.1 Puede recargar su saldo utilizando los métodos de pago disponibles en la aplicación.
                    </Text>
                    <Text style={styles.text}>
                        4.2 Las tarifas de estacionamiento se deducirán automáticamente de su saldo al salir de la instalación de estacionamiento.
                    </Text>
                    <Text style={styles.text}>
                        4.3 Es su responsabilidad mantener un saldo suficiente para cubrir las tarifas de estacionamiento.
                    </Text>
                    <Text style={styles.text}>
                        4.4 No se aceptan reembolsos una vez realizada la recarga, excepto en circunstancias específicas según lo determinen los administradores.
                    </Text>


                    <Text style={styles.sectionTitle}>5. Acceso Gratuito y Permisos de Administrador</Text>
                    <Text style={styles.text}>
                        5.1 Los administradores de la puerta tienen la autoridad para otorgar acceso gratuito a ciertos vehículos por razones privadas, como el alquiler privado de un espacio de estacionamiento o la entrada autorizada gratuita.
                    </Text>
                    <Text style={styles.text}>
                        5.2 El acceso gratuito está sujeto a la aprobación y verificación del administrador de la puerta.
                    </Text>
                    <Text style={styles.text}>
                        5.3 Las condiciones para otorgar acceso gratuito pueden cambiar sin previo aviso.
                    </Text>


                    <Text style={styles.sectionTitle}>6. Política de Privacidad</Text>
                    <Text style={styles.text}>
                        6.1 Su información personal y de vehículo se almacena de forma segura y se utiliza únicamente para la prestación de servicios de estacionamiento.
                    </Text>
                    <Text style={styles.text}>
                        6.2 No compartimos su información con terceros sin su consentimiento, excepto cuando sea requerido por la ley.
                    </Text>
                    <Text style={styles.text}>
                        6.3 Puede solicitar la eliminación de sus datos personales poniéndose en contacto con el equipo de soporte.
                    </Text>


                    <Text style={styles.sectionTitle}>7. Responsabilidad</Text>
                    <Text style={styles.text}>
                        7.1 No somos responsables de ningún daño o pérdida de propiedad que ocurra en la instalación de estacionamiento.
                    </Text>
                    <Text style={styles.text}>
                        7.2 Los usuarios son responsables de cualquier mal uso de la aplicación o acceso no autorizado a sus cuentas.
                    </Text>
                    <Text style={styles.text}>
                        7.3 No garantizamos la disponibilidad continua del servicio debido a posibles problemas técnicos o de mantenimiento.
                    </Text>


                    <Text style={styles.sectionTitle}>8. Modificaciones</Text>
                    <Text style={styles.text}>
                        8.1 Nos reservamos el derecho de modificar estos Términos y Condiciones en cualquier momento.
                    </Text>
                    <Text style={styles.text}>
                        8.2 Los cambios se comunicarán a través de la aplicación, y el uso continuo de la misma constituirá la aceptación de los términos actualizados.
                    </Text>
                    <Text style={styles.text}>
                        8.3 Es su responsabilidad revisar periódicamente los términos para mantenerse informado sobre posibles cambios.
                    </Text>


                    <Text style={styles.sectionTitle}>9. Soporte y Contacto</Text>
                    <Text style={styles.text}>
                        Si tiene alguna pregunta o inquietud sobre estos Términos y Condiciones, comuníquese con nuestro equipo de soporte a través de la sección de ayuda en la aplicación.
                    </Text>

                    <Text style={styles.sectionTitle}>10. Uso Prohibido</Text>
                    <Text style={styles.text}>
                        10.1 Está prohibido utilizar la aplicación para cualquier actividad ilegal o fraudulenta.
                    </Text>
                    <Text style={styles.text}>
                        10.2 El uso indebido de la aplicación puede resultar en la suspensión o terminación de su cuenta sin previo aviso.
                    </Text>


                    
                </ScrollView>

            </Padding>
        </Page>
    )
}

export default Index

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
    },
    sectionTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 16,
        marginBottom: 8,
    },
    text: {
        fontSize: 14,
        lineHeight: 20,
        color: '#ffffff50',
        marginBottom: 8,
    },
    buttonContainer: {
        marginTop: 24,
        alignItems: 'center',
    },
})