import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import Page from '@/components/global/Page'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Padding from '@/components/global/Padding';
import Input from '@/components/inputs/Input';
import ButtonGlobal from '@/components/buttons/ButtonGlobal';
import { transform } from '@babel/core';
import InputHidden from '@/components/inputs/InputHidden';
import { register } from '@/services/api';
import { useRouter } from 'expo-router';
import LoaderGlobal from '@/components/animations/LoaderGlobal';

const index = () => {
    const router = useRouter();

    const [name, setName] = React.useState('');
    const [lastName, setLastName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');

    const [isLoading, setIsLoading] = React.useState(false);

    const handleRegister = async () => {
        setIsLoading(true);
        const call = await register(
            email,
            password,
            name,
            lastName
        );

        if (!call.success) {

            setIsLoading(false);
            Alert.alert('Error al creare la cuenta');

            return
        }

        alert('Cuenta creada con exito')
        setTimeout(() => {
            router.replace('/auth')
        }, 1000)
    }


    return (
        <Page>
            {
                isLoading &&
                <LoaderGlobal/>
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

                <View style={{ marginTop: 50, marginBottom: 10 }}>
                    <Text style={{ fontSize: 50, color: 'white', fontFamily: 'SemiBold', textAlign: 'center' }}>QuickGate</Text>
                    <Text style={{ fontSize: 28, color: 'white', fontFamily: 'SemiBold', textAlign: 'center', transform: [{ translateY: -10 }] }}>Crea tu Cuenta</Text>
                </View>



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
                    text='Registrarse'
                    onPress={
                        handleRegister
                    }
                    style={{ marginTop: 20 }}

                />
                <TouchableOpacity style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: 10, gap: 5 }}>
                    <Text style={{ color: 'white', textAlign: 'center' }}>Creando una cuenta usted esta acceptando los</Text>
                    <Text style={{ color: '#52889F' }}>Terminos & Condiciones</Text>
                </TouchableOpacity>

            </Padding>
        </Page>
    )
}

export default index

const styles = StyleSheet.create({})