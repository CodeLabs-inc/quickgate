import React from 'react'
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import Page from '@/components/global/Page'
import Title from '@/components/global/Title'
import Padding from '@/components/global/Padding'
import AlertCard from '@/components/global/Alert'
import Input from '@/components/inputs/Input'
import MagnifingGlassIcon from '@/components/icons/MagnifingGlass'
import ButtonGlobal from '@/components/buttons/ButtonGlobal'
import SupportButton from '@/components/buttons/SupportButton'
import CardSide from '@/components/card/CardSide'
import { transform } from '@babel/core'
import ButtonFree from '@/components/buttons/ButtonFree'
import ApplePayIcon from '@/components/icons/ApplePay'
import { useLocalSearchParams, useRouter } from 'expo-router'
import Checkmark from '@/components/animations/Checkmark'
import LogInIcon from '@/components/icons/LogIn'

const Pay = () => {
    const router = useRouter()

    const { days, hours, entry, validated, totalAmount, licensePlate } = useLocalSearchParams()







    return (
        <Page>
            <Padding>
                <Title line1={'Pago'} line2='Confirmado' style={{ zIndex: 3 }} />


                <Checkmark />

                <View style={styles.display}>
                    <Text style={styles.licensePlate}>{licensePlate}</Text>
                </View>

                <View style={styles.panelHours}>
                    <View style={styles.containerHours}>
                        <Text style={styles.textHour}>entrada</Text>
                        <Text style={styles.textHour}>
                            {

                                new Date(entry.toString()).toLocaleDateString('es-ES', {

                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',

                                })
                            }
                        </Text>
                    </View>

                    <View style={styles.containerHours}>
                        <Text style={styles.textHour}>salida</Text>
                        <Text style={styles.textHour}>
                            {

                                new Date(validated.toString()).toLocaleDateString('es-ES', {

                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',

                                })
                            }
                        </Text>
                    </View>
                </View>


                <CardSide
                    style={{

                        marginTop: 40,
                        transform: [{ translateX: -20 }],
                        zIndex: 2,
                        width: '100%',
                        paddingHorizontal: 30,
                        paddingVertical: 20,
                        boxShadow: '0px 15px 20px rgba(0, 0, 0, 0.25)',
                    }}
                >
                    <Text style={styles.titleCard}>Mi estacionamiento</Text>


                    <View>
                        <Text style={styles.timeCounter}>
                            {
                                
                                Number(days) > 0 ? `${days} dias` : ''
                            }
                            {"  "}
                            {
                                
                                Number(hours) > 0 ? `${Number(hours).toFixed(0)} horas` : ''
                            }
                        </Text>
                        <Text style={styles.totalPrice}>
                            {
                                Number(totalAmount).toFixed(2)
                            }
                            RD$
                        </Text>
                    </View>

                </CardSide>

                <ButtonGlobal
                    onPress={() => router.push('/')}
                    style={{ marginTop: 40 }}
                    text='Volver al inicio'
                    icon={
                        <LogInIcon color='white'/>
                    }
                />


            </Padding>
        </Page>
    )
}

export default Pay

const styles = StyleSheet.create({
    car: {
        position: 'absolute',
        zIndex: 0,
        right: 0,
        top: -10,
        height: 350,
    },

    display: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
    },

    licensePlate: {
        color: '#FFF',
        fontSize: 48,
        fontFamily: 'SemiBold'
    },
    date: {
        fontSize: 16,
        color: '#FFFFFFa8',
        fontFamily: 'SemiBold',
        transform: [{ translateY: -5 }]
    },

    titleCard: {
        color: '#FFFFFF90',
        fontSize: 14,
        fontFamily: 'Medium',
        marginBottom: 15
    },
    timeCounter: {
        color: '#FFF',
        fontSize: 28,
        fontFamily: 'SemiBold',
    },
    totalPrice: {
        fontSize: 20,
        color: '#FFFFFFa8',
        fontFamily: 'SemiBold',
        transform: [{ translateY: -5 }],
    },

    panelHours: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        marginTop: 40,
    },
    containerHours: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    textHour: {
        color: '#FFFFFFa8',
        fontSize: 14,
        fontFamily: 'Medium',
    },
    containerPaymentMethods: {

        marginTop: 30
    },
    titlePaymentMethods: {
        color: '#FFFFFF90',
        fontSize: 14,
        fontFamily: 'Medium',
        marginBottom: 10
    }



})