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
import InputToggle from '@/components/inputs/InputToggle'
import { getNotificationSettings, updateNotificationSettings } from '@/services/api'

const Index = () => {
    const [isLoading, setIsLoading] = React.useState(true)
    const router = useRouter()

    
    const [balanceUseNotification, setBalanceUseNotification] = React.useState(false)
    const [parkingNotification, setParkingNotification] = React.useState(false)
    const [exitNotification, setExitNotification] = React.useState(false)
    const [lowBalanceNotification, setLowBalanceNotification] = React.useState(false)
    const [alertsNotification, setAlertsNotification] = React.useState(false)


    const handleFetchNotificationSettings = async () => {
        setIsLoading(true)
        const call = await getNotificationSettings()
        
        if (call.success){
            console.log(call.data)
            setBalanceUseNotification(call.data.balanceUse)
            setParkingNotification(call.data.parking)
            setExitNotification(call.data.exit)
            setLowBalanceNotification(call.data.lowBalance)
            setAlertsNotification(call.data.alerts)
        }
        setTimeout(() => {

            setIsLoading(false)
        }, 250)
    }


    /* Updates */
    const handleUpdateBalanceUse = async (value: boolean) => {
        const call = await updateNotificationSettings(
            value,
            parkingNotification,
            exitNotification,
            lowBalanceNotification,
            alertsNotification
        )
    }
    const handleUpdateParking = async (value: boolean) => {
        const call = await updateNotificationSettings(
            balanceUseNotification,
            value,
            exitNotification,
            lowBalanceNotification,
            alertsNotification
        )
    }
    const handleUpdateExit = async (value: boolean) => {
        const call = await updateNotificationSettings(
            balanceUseNotification,
            parkingNotification,
            value,
            lowBalanceNotification,
            alertsNotification
        )
    }
    const handleUpdateLowBalance = async (value: boolean) => {
        const call = await updateNotificationSettings(
            balanceUseNotification,
            parkingNotification,
            exitNotification,
            value,
            alertsNotification
        )
    }
    const handleUpdateAlerts = async (value: boolean) => {
        const call = await updateNotificationSettings(
            balanceUseNotification,
            parkingNotification,
            exitNotification,
            lowBalanceNotification,
            value
        )
    }






    useEffect(() => {
        handleFetchNotificationSettings()
    }, [])


    return (
        <Page>
            {
                isLoading &&
                <LoaderGlobal/>
            }
            <Padding>
                <Title
                    line1='Notificaciones'
                    style={{ zIndex: 3, flexDirection: 'row', gap: 4 }}
                    goBack
                />

                <View style={styles.form}>

                    <InputToggle
                        title='Uso'
                        desc='Avisame cuando mi saldo se use'
                        value={balanceUseNotification}
                        onClick={() => { 
                            setBalanceUseNotification(!balanceUseNotification)
                            handleUpdateBalanceUse(!balanceUseNotification)
                        }}
                    />
                    <InputToggle
                        title='Estacionamiento'
                        desc='Avisame cuando mi carro se estacione'
                        value={parkingNotification}
                        onClick={() => { 
                            setParkingNotification(!parkingNotification)
                            handleUpdateParking(!parkingNotification)
                            
                        }}
                    />
                    <InputToggle
                        title='Salida'
                        desc='Avisame cuando mi carro salga'
                        value={exitNotification}
                        onClick={() => { 
                            setExitNotification(!exitNotification)
                            handleUpdateExit(!exitNotification)
                        }}
                    />
                    <InputToggle
                        title='Saldo'
                        desc='Avisame cuando mi saldo sea bajo'
                        value={lowBalanceNotification}
                        onClick={() => { 
                            setLowBalanceNotification(!lowBalanceNotification)
                            handleUpdateLowBalance(!lowBalanceNotification)
                        }}
                    />
                    <InputToggle
                        title='Alertas'
                        desc='Avisame cuando haya alertas'
                        value={alertsNotification}
                        onClick={() => { 
                            setAlertsNotification(!alertsNotification)
                            handleUpdateAlerts(!alertsNotification)
                        }}
                    />


                </View>

            </Padding>
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
        marginTop: 10,
        zIndex: 3,
        gap: 10,
    },
})