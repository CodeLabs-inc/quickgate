import React, { useEffect } from 'react'
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
import { useLocalSearchParams, useRouter } from 'expo-router'
import { calculateTicket, confirmTicket } from '@/services/api'
import LoaderGlobal from '@/components/animations/LoaderGlobal'

const Informations = () => {
    const router = useRouter()
    const { ticketId, licensePlate } = useLocalSearchParams()

    const [isLoading, setIsLoading] = React.useState(true)
    const [dataTicket, setDataTicket] = React.useState<any>(null)




    const handleGoToPay = async () => {
        const call = await confirmTicket(ticketId.toString())

        if (call.success) {
            router.navigate({
                pathname: "/pago/pay",
                params: {
                    ticketId: ticketId,
                    licensePlate: licensePlate,
                },
            });
            return
        }
    }
    const handleFetchCalculatePrice = async () => {

        const call = await calculateTicket(ticketId.toString());

        if (call.success){
            setDataTicket(call.data)
            setIsLoading(false)
        } else {
            router.replace('/')
        }
    }


    useEffect(() => {
        handleFetchCalculatePrice()
    }, [])


    return (
        <Page>
            {
                isLoading &&
                <LoaderGlobal/>
            }
            <Padding>
                <Title line1={'Informaciones'} line2='De Pago' style={{ zIndex: 3 }} />

                <Image
                    source={require('@/assets/pictures/suv_vertical.png')}
                    style={styles.car}
                />

                <View style={styles.display}>
                    <Text style={styles.licensePlate}>{licensePlate}</Text>
                    <Text style={styles.date}>
                        {
                            dataTicket &&
                            new Date(dataTicket.dates.entry).toLocaleDateString('es-ES', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'numeric',
                                day: 'numeric',
                                hour: 'numeric',
                                minute: 'numeric',
                            })
                        }
                    </Text>
                </View>


                <CardSide
                    style={{
                        position: 'absolute',
                        bottom: 100,
                        left: 0,
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
                                dataTicket &&
                                dataTicket.days > 0 ? `${dataTicket.days} dias` : ''
                            }
                            {"  "}
                            {
                                dataTicket &&
                                dataTicket.hours > 0 ? `${dataTicket.hours.toFixed(0)} horas` : ''
                            }
                            
                        </Text>
                        <Text style={styles.totalPrice}>
                            {
                                dataTicket &&
                                dataTicket.totalAmount.toFixed(2)
                            } 
                            RD$
                        </Text>
                    </View>


                    <View style={styles.controller}>
                        <Text style={styles.rate}>
                            {
                                dataTicket &&
                                dataTicket.rates.hourly
                            } 
                            RD$/h
                        </Text>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={handleGoToPay}
                        >
                            <Text style={styles.pay}>Pagar {'>'}</Text>
                        </TouchableOpacity>
                    </View>

                </CardSide>
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

export default Informations

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
        marginTop: 70,
        paddingRight: 70
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
        marginBottom: 60
    },
    rate: {
        fontSize: 13,
        color: '#FFFFFFa8',
    },
    controller: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    button: {
        backgroundColor: '#333842',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 63,
    },
    pay: {
        color: '#FFFFFF',
        fontFamily: 'Medium',
        fontSize: 16,
    }


})