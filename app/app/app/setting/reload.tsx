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

const Index = () => {
    const [balance, setBalance] = React.useState(0)
    const [isLoading, setIsLoading] = React.useState(false)
    const [error, setError] = React.useState('')
    const router = useRouter()


    return (
        <Page>
            {
                isLoading &&
                <LoaderGlobal />
            }


            <Padding>
                <Title
                    line1='Recargar Saldo'
                    style={{ zIndex: 3, flexDirection: 'row', gap: 4 }}
                    goBack
                />

                <AlertCard
                    title='Informacion'
                    message='El saldo cargado en tu cuenta servira como balance para pagar la placas enregistradas a esta cuenta.'
                    style={{ marginTop: 0, zIndex: 3 }}
                />

                <Image
                    source={require('@/assets/pictures/map.png')}
                    style={styles.map}
                />

                <Text style={styles.plateReader}>
                    
                    {
                        balance > 0 ?
                            balance :
                            '------'
                    }
                </Text>
                <Text style={{fontSize: 12, color: '#FFFFFF90', textAlign: 'center'}}>Pesos Dominicanos (DOP)</Text>

                <View style={styles.form}>

                    <Input
                        value={balance.toString()}
                        placeholder='Ejemplo - 300'
                        onChangeText={(text: string) => {
                            setBalance(Number(text))
                        }}
                        label='Monto a recargar'
                        height={55}
                    />
                    <ButtonGlobal
                        text='Recargar'
                        onPress={
                            () => {
                                Alert.alert('Atencion', 'La funcionalidad de recargar saldo no esta disponible, habla con fede a ver klk')
                             }
                        }
                        style={{ marginTop: 20 }}

                    />
                    <TouchableOpacity style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: 10, gap: 5 }}>
                        <Text style={{ color: 'white', textAlign: 'center' }}>Creando una cuenta usted esta acceptando los</Text>
                        <Text style={{ color: '#52889F' }}>Terminos & Condiciones</Text>
                    </TouchableOpacity>
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
        marginBottom: 20,
        textAlign: 'center',
        color: '#FFF',
        fontSize: 50,
        fontWeight: 'bold',

    },
    error: {
        color: 'tomato',
        marginTop: 5,
        paddingLeft: 10,
        textTransform: 'capitalize'
    }
})