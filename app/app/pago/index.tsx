import React from 'react'
import { Alert, Image, Keyboard, StyleSheet, Text, View } from 'react-native'

import Page from '@/components/global/Page'
import Title from '@/components/global/Title'
import Padding from '@/components/global/Padding'
import AlertCard from '@/components/global/Alert'
import Input from '@/components/inputs/Input'
import MagnifingGlassIcon from '@/components/icons/MagnifingGlass'
import ButtonGlobal from '@/components/buttons/ButtonGlobal'
import SupportButton from '@/components/buttons/SupportButton'
import { useRouter } from 'expo-router'
import { lookupPlate } from '@/services/api'
import MainLoader from '@/components/animations/MainLoader'
import LoaderGlobal from '@/components/animations/LoaderGlobal'

const Index = () => {
    const [isLoading, setIsLoading] = React.useState(false)
    const [error, setError] = React.useState('')

    const [licensePlate, setLicensePlate] = React.useState('');
    const router = useRouter()

    const handleGoToInformations = (ticketId: string) => {
        router.navigate({
            pathname: "/pago/informations",
            params: {
                licensePlate: licensePlate,
                ticketId
            },
        });
    }
    const handleLookupPlate = async () => {
        Keyboard.dismiss()
        if (licensePlate.length < 7) {
            setError('La placa debe tener al menos 7 caracteres')
            return
        }

        setIsLoading(true)
        const call = await lookupPlate(licensePlate)

        if (!call.success) {
            setError('No se encontro la placa')
            setTimeout(() => {
                setIsLoading(false)
            }, 2000)
            return
        }

        handleGoToInformations(call.data._id)
        setTimeout(() => {
            setIsLoading(false)
        }, 1000)
    }

    return (
        <Page>
            {
                isLoading &&
                <LoaderGlobal />
            }


            <Padding>
                <Title line1={'Informaciones'} line2='Del Vehiculo' style={{ zIndex: 3 }} />

                <AlertCard
                    title='Informacion'
                    message='Por el cobro de estacionamiento, necesitamos tu placa del vehiculo, que ha sido enregistrada en la entrada'
                    style={{ marginTop: 30, zIndex: 3 }}
                />

                <Image
                    source={require('@/assets/pictures/map.png')}
                    style={styles.map}
                />

                <Text style={styles.plateReader}>
                    {
                        licensePlate.length > 0 ?
                            licensePlate.toUpperCase() :
                            '------'
                    }
                </Text>

                <View style={styles.form}>
                    
                    <Input
                        value={licensePlate.toUpperCase()}
                        placeholder='Ejemplo - A123456'
                        onChangeText={(text: string) => {
                            if (text.length > 8) return
                            if (!/^[a-zA-Z0-9]*$/.test(text)) return
                            setLicensePlate(text.toUpperCase())
                        }}
                        label='Placa del vehiculo'
                        height={55}
                        icon={
                            <MagnifingGlassIcon color='#E0E0E0' />
                        }
                    />
                    <ButtonGlobal
                        text='Buscar'
                        onPress={handleLookupPlate}
                    />
                    {
                        error.length > 0 &&
                        <AlertCard
                            title='Error'
                            message={error}
                            style={{ marginTop: 10, zIndex: 3 }}
                            color='tomato'
                        />
                    }

                   

                </View>

            </Padding>
            <View style={{ height: 100, paddingHorizontal: 20, zIndex: 3 }}>
                <SupportButton
                    text='Ayuda'
                    onPress={() => Alert.alert('Soporte', 'Soporte')}
                />
            </View>
        </Page>
    )
}

export default Index

const styles = StyleSheet.create({
    map: {
        position: 'absolute',
        zIndex: 0,
        transform: [{ translateY: 300 }, { translateX: -60 }, { rotate: '-17deg' }],
    },
    form: {
        marginTop: 30,
        zIndex: 3,
        gap: 10,
    },
    plateReader: {
        marginTop: 30,
        textAlign: 'center',
        color: '#FFF',
        fontSize: 70,
        fontWeight: 'bold',

    },
    error: {
        color: 'tomato',
        marginTop: 5,
        paddingLeft: 10,
        textTransform: 'capitalize'
    }
})