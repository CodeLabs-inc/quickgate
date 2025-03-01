import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect } from 'react'
import Page from '@/components/global/Page'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Padding from '@/components/global/Padding';
import Input from '@/components/inputs/Input';
import ButtonGlobal from '@/components/buttons/ButtonGlobal';
import { transform } from '@babel/core';
import InputHidden from '@/components/inputs/InputHidden';
import { useRouter } from 'expo-router';
import { login } from '@/services/api';

const index = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');


  const handleLogin = async () => {
    const call = await login(email, password);

    if (call.success){

      if (call.vehicleCount === 0){
        router.replace('/app/onboarding2')
      } else {
        router.replace('/app/home')
      }

    }


  }

  useEffect(() => {
    
  }, [])


  return (
    <Page>
      <Image
        style={{ width: 400, height: 500, transform: [{ translateY: -insets.top }, {translateX: -70}], position: 'absolute', top: 0, right: 0 }}
        source={require('@/assets/pictures/suv_diagonal.png')}
      />

      <View
        style={{ transform: [{ translateY: insets.top + 100 }, {translateX: -20}], position: 'absolute', top: 0, right: 0, display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: 10 }}
      >
        <Text style={{fontSize:50, color: 'white', fontFamily: 'SemiBold'}}>QuickGate</Text>
        {/* <Text style={{fontSize:28, color: 'white', fontFamily: 'SemiBold', transform: [{translateY: -15}]}}>Log In</Text> */}
      </View>

      <Padding>
        <View style={{ marginTop: 350, display: 'flex', justifyContent: 'center', alignItems: 'flex-start', gap: 10 }}>
          <Input
            placeholder='Email'
            value={email}
            onChangeText={(text: string) => setEmail(text.toLowerCase())}
            autocomp='email'
          />
          <InputHidden
            label=''
            placeholder='Contraseña'
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity>
            <Text style={{ transform: [{translateY: -5}], color: 'white' }}>¿Olvido la contraseña?</Text>
          </TouchableOpacity>
        </View>

        <ButtonGlobal
          text='Iniciar Sesión'
          onPress={() => {
            handleLogin()
           }}
          style={{ marginTop: 30 }}
        />


        <TouchableOpacity 
          style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 10, flexDirection: 'row', gap: 5 }}
          onPress={() => {
            router.push('/auth/register')
          }}
        >
          <Text style={{ color: 'white', textAlign: 'center'}}>No tienes cuenta?</Text> 
          <Text style={{color: '#52889F'}}>Crear ahora</Text>
        </TouchableOpacity>

      </Padding>
    </Page>
  )
}

export default index

const styles = StyleSheet.create({})