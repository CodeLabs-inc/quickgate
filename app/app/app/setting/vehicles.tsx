import React, { useEffect } from 'react'
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
import { deleteCar, getCars } from '@/services/api'
import Trash from '@/components/icons/Trash'
import ButtonMenuFree from '@/components/buttons/ButtonMenuFree'

const Index = () => {
    const router = useRouter()

    const [loading, setLoading] = React.useState(true)
    const [vehicles, setVehicles] = React.useState([])

    
    const handleFetchUserVehicles = async () => {
        setLoading(true)
        const call = await getCars()
        if (call.success){
            setVehicles(call.data)
        }

        setLoading(false)
    }
    const handleDeleteVehicle = async (id: string) => {
        const call = await deleteCar(id)

        if (call.success){
            handleFetchUserVehicles()
        }
    }


    useEffect(() => {
        handleFetchUserVehicles()
    }, [])

    return (
        <Page>
            {
                loading &&
                <LoaderGlobal/>
            }
            <Padding>
                <Title line1={'Tus vehiculos'} style={{ zIndex: 3, flexDirection: 'row', gap: 4 }} goBack />
                <View>
                    {
                        vehicles.map((vehicle: any, index) => (
                            <ButtonMenuFree
                                key={index}
                                index={index}
                                lenthGroup={vehicles.length - 1}
                                onPress={() => {}}
                                icon={
                                    <TouchableOpacity
                                        onPress={() => {
                                            handleDeleteVehicle(vehicle._id)
                                        }}
                                    >
                                        <Trash color='tomato'/>
                                    </TouchableOpacity>
                                }
                                content={
                                    <View>
                                        <Text style={{fontSize: 14, color: '#FFFFFF'}}>{vehicle.vehicleName}</Text>
                                        <Text style={{fontSize: 12, color: '#FFFFFF80'}}>{vehicle.licensePlate}</Text>
                                    </View>
                                }
                            />
                        ))
                            
                    }

                </View>
                
            </Padding>


            <View style={{ height: 100, paddingHorizontal: 20, zIndex: 3 }}>
                <ButtonGlobal
                    text='Agregar vehiculo'
                    onPress={() => {
                       router.push('/app/setting/newvehicle')
                    }}
                    
                />
            </View>
        </Page>
    )
}

export default Index

const styles = StyleSheet.create({
   
})