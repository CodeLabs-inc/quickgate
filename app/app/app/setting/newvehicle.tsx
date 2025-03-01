import { Alert, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Page from '@/components/global/Page'
import Padding from '@/components/global/Padding'
import Input from '@/components/inputs/Input'
import AlertCard from '@/components/global/Alert'
import ButtonGlobal from '@/components/buttons/ButtonGlobal'
import { useRouter } from 'expo-router'
import { addCar } from '@/services/api'
import LoaderGlobal from '@/components/animations/LoaderGlobal'
import Title from '@/components/global/Title'

const newvehicle = () => {
  const router = useRouter()

  const [carName, setCarName] = React.useState('');
  const [licensePlate, setLicensePlate] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [isError, setIsError] = React.useState<string | null>(null);


  const handleAddCar = async () => {


    if (licensePlate.length < 7) {
      setIsError('La placa debe tener al menos 7 caracteres.')
      return
    }


    setIsLoading(true)
    const call = await addCar(licensePlate, carName)



    if (call.success) {
      Alert.alert('Carro añadido', 'El carro ha sido añadido correctamente.')
      router.dismissTo({
        pathname: '/app/settings'
      })
      
    } else {
      setIsError('Hubo un error al añadir el carro, puedes intentar en los ajustes.')
    }

    setIsLoading(false)
  }

  return (
    <Page>
      <Padding>
        <Title
          line1='Añadir Carro'
          style={{ zIndex: 3, flexDirection: 'row', gap: 4 }}
          goBack
        />

        <Text style={styles.description}>Para permitir el pago rápido, es necesario registrar la placa del vehículo. Es posible tener más de un carro bajo la misma cuenta.</Text>



        <View style={styles.form}>
          <Input
            value={carName}
            placeholder='Nombre Carro'
            onChangeText={setCarName}
          />
          <Input
            value={licensePlate}
            placeholder='Placa del Vehiculo'
            onChangeText={(text: string) => {
              if (text.length > 8) return
              if (!/^[a-zA-Z0-9]*$/.test(text)) return
              setLicensePlate(text.toUpperCase())
            }}
          />
        </View>

        <Text style={styles.licensePlate}>{licensePlate == '' ? '--------------' : licensePlate}</Text>

        {
          isError &&
          <AlertCard
            title='Error'
            message={isError}
            color='red'
            style={{ marginBottom: 20 }}
          />
        }
        <ButtonGlobal
          text='Siguiente'
          onPress={() => {
            handleAddCar()
          }}
        />

      </Padding>

      {
        isLoading &&
        <LoaderGlobal />
      }
    </Page>
  )
}

export default newvehicle
const styles = StyleSheet.create({
  titleHolder: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    gap: 0
  },
  smallTitle: {
    fontSize: 15,
    color: '#FFFFFFa9',
    fontFamily: 'SemiBold'
  },
  mainTitle: {
    fontSize: 28,
    color: 'white',
    fontFamily: 'SemiBold'
  },

  description: {
    fontSize: 16,
    fontFamily: 'Regular',
    textAlign: 'left',
    marginTop: 20,
    color: '#FFFFFFa9',
  },
  form: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
    marginTop: 30
  },
  licensePlate: {
    color: '#FFF',
    fontSize: 48,
    fontFamily: 'SemiBold',
    textAlign: 'center',
    marginTop: 30,
    marginBottom: 30
  },
})