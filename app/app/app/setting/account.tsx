import React, { useEffect } from 'react'
import { Alert, Image, Keyboard, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import Page from '@/components/global/Page'
import Title from '@/components/global/Title'
import Padding from '@/components/global/Padding'
import ButtonGlobal from '@/components/buttons/ButtonGlobal'
import { useRouter } from 'expo-router'
import LoaderGlobal from '@/components/animations/LoaderGlobal'
import { deleteCar, getCars } from '@/services/api'
import Trash from '@/components/icons/Trash'
import ButtonMenuFree from '@/components/buttons/ButtonMenuFree'
import Input from '@/components/inputs/Input'
import InputHidden from '@/components/inputs/InputHidden'

const Index = () => {
    const router = useRouter()

    const [name, setName] = React.useState('')
    const [lastName, setLastName] = React.useState('')
    const [email, setEmail] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [confirmPassword, setConfirmPassword] = React.useState('')
    const [isLoading, setIsLoading] = React.useState(false)





    useEffect(() => {

    }, [])

    return (

        <Page>
            {
                isLoading &&
                <LoaderGlobal />
            }
            <Image
                style={{
                    width: 200,
                    height: 550,
                    transform: [{ translateX: 0 }],
                    position: 'absolute',
                    bottom: 0,
                    right: 0
                }}
                source={require('@/assets/pictures/suv_cut_lateral.png')}
            />


            <Padding>

                <Title
                    line1='Cuenta'
                    style={{ zIndex: 3, flexDirection: 'row', gap: 4 }}
                    goBack
                />



                <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', gap: 10 }}>
                    <Input
                        placeholder='Nombre'
                        value={name}
                        onChangeText={setName}
                    />
                    <Input
                        placeholder='Apellido'
                        value={lastName}
                        onChangeText={setLastName}
                    />
                </View>

                <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                    <View style={{ width: '50%', height: 1, backgroundColor: 'white', marginTop: 20, marginBottom: 20 }} />
                </View>

                <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', gap: 10 }}>
                    <Input
                        placeholder='Correo Electronico'
                        value={email}
                        onChangeText={setEmail}
                    />
                </View>

                <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                    <View style={{ width: '50%', height: 1, backgroundColor: 'white', marginTop: 20, marginBottom: 20 }} />
                </View>

                <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', gap: 10 }}>
                    <InputHidden
                        label=''
                        placeholder='Contraseña'
                        value={password}
                        onChangeText={setPassword}
                    />
                    <InputHidden
                        label=''
                        placeholder='Confirmar Contraseña'
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                    />
                </View>

                <ButtonGlobal
                    text='Guardar Cambios'
                    onPress={
                        () => { }
                    }
                    style={{ marginTop: 20 }}

                />

            </Padding>
        </Page>
    )
}

export default Index

const styles = StyleSheet.create({

})