import React from 'react'
import { Alert, Linking, StyleSheet, Text, View } from 'react-native'

import Page from '@/components/global/Page'
import Title from '@/components/global/Title'
import Padding from '@/components/global/Padding'
import SupportButton from '@/components/buttons/SupportButton'
import CardSide from '@/components/card/CardSide'
import ButtonFree from '@/components/buttons/ButtonFree'
import ApplePayIcon from '@/components/icons/ApplePay'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { calculateTicket, confirmPaymentIntent, createPaymentIntent } from '@/services/api'

import { initPaymentSheet, presentPaymentSheet, StripeProvider, isPlatformPaySupported, PlatformPayButton, PlatformPay, confirmPlatformPayPayment, confirmPlatformPaySetupIntent, confirmSetupIntent, createPlatformPayPaymentMethod } from '@stripe/stripe-react-native';
import CreditCard from '@/components/icons/CreditCard'
import LoaderGlobal from '@/components/animations/LoaderGlobal'




const Pay = () => {
    const router = useRouter()
    const { ticketId, licensePlate } = useLocalSearchParams()

    const [dataTicket, setDataTicket] = React.useState<any>(null)
    const [publishableKey, setPublishableKey] = React.useState('pk_test_51N1Wc4KxLwtehdLRZmdFTwzcoyvooiheFIF55nhElTkZca6wjhJQpVzPaaLf38hRrMKsK1BpljORxoJTs1Wqh6Y000VtyuUoNd');
    
    const [isLoading, setIsLoading] = React.useState(true);


    const handleFetchCalculatePrice = async () => {

        const call = await calculateTicket(ticketId.toString());

        if (call.success) {
            setIsLoading(false)
            setDataTicket(call.data)
        }
    }


    const handleGoToSuccesfulPayment = () => {
        router.navigate({
            pathname: "/pago/pay-success",
            params: {
                licensePlate: licensePlate,
                days: dataTicket.days,
                hours: dataTicket.hours,
                entry: dataTicket.dates.entry,
                validated: dataTicket.dates.validated,
                totalAmount: dataTicket.totalAmount
            },
        });
    }
    const handleGoToFailedPayment = () => {
        router.navigate({
            pathname: "/pago/pay-failed",
            params: {
                licensePlate: licensePlate,
            },
        });
    }



    //Stripe ALL CARDS
    const initializePaymentSheet = async () => {
        setIsLoading(true)
        const call = await createPaymentIntent(licensePlate.toString())

        if (!call.success) {
            setIsLoading(false)
            Alert.alert('Error', 'Problemas con la connexion al servidor de pago')
            return
        }

        const {
            amount,
            paymentIntentId,
            clientSecret,
            ephemeralKey,
            customer,
            
        } = call.data

        

        const paymentInt = await initPaymentSheet({
            merchantDisplayName: "QuickGate",

            customerId: customer,
            customerEphemeralKeySecret: ephemeralKey,
            paymentIntentClientSecret: clientSecret,
            applePay: {
                merchantCountryCode: 'US',
            },

            defaultBillingDetails: {
                name: 'Jane Doe',
            },
            returnURL: 'quickgate://payment-complete',
        });

        if (paymentInt.error) {
            setIsLoading(false)
            Alert.alert(`${paymentInt.error.code}`, paymentInt.error.message);
            return
        }

        openPaymentSheet(paymentIntentId);

    };
    const openPaymentSheet = async (paymentIntentId: string) => {
        const paymentSheet = await presentPaymentSheet();

        if (paymentSheet.error) {
            handleGoToFailedPayment()
            return
        }

        const call = await confirmPaymentIntent(paymentIntentId, licensePlate.toString())
        
        if (call.success) {
            if (call.data.paymentSucceded){
                handleGoToSuccesfulPayment()
            } else {
                handleGoToFailedPayment()
            }
        }
        
    };

    React.useEffect(() => {
        handleFetchCalculatePrice()
        
    }, [])




    return (
        <StripeProvider
            publishableKey={publishableKey}
            merchantIdentifier="merchant.xyz.quickgate.app" // required for Apple Pay
            urlScheme="quickgate" // required for 3D Secure and bank redirects
        >
            <Page>
                {
                    isLoading &&
                    <LoaderGlobal/>
                }
                <Padding>
                    <Title line1={'Finalizar'} line2='Pago' style={{ zIndex: 3 }} />



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

                    <View style={styles.panelHours}>
                        <View style={styles.containerHours}>
                            <Text style={styles.textHour}>entrada</Text>
                            <Text style={styles.textHour}>
                                {
                                    dataTicket &&
                                    new Date(dataTicket.dates.entry).toLocaleDateString('es-ES', {

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
                                    dataTicket &&
                                    new Date(dataTicket.dates.validated).toLocaleDateString('es-ES', {

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

                    </CardSide>

                    <View style={styles.containerPaymentMethods}>
                        <Text style={styles.titlePaymentMethods}>Metodos de Pago</Text>

                        <View style={{flexDirection: 'column', gap: 10}}>
                            <ButtonFree
                                onPress={() => {
                                    initializePaymentSheet()
                                }}
                            >
                                <ApplePayIcon />

                            </ButtonFree>
                            <ButtonFree
                                onPress={() => {
                                    initializePaymentSheet()
                                }}
                                style={{
                                    gap: 5,
                                    flexDirection: 'row',
                                }}
                            >
                                <CreditCard/>
                                <Text
                                    style={{
                                        color: '#FFFFFF',
                                        fontSize: 18,
                                        fontFamily: 'Bold'
                                    }}
                                >
                                    Tarjeta
                                </Text>
                            </ButtonFree>
                        </View>
                    </View>
                </Padding>


                <View style={{ height: 90, paddingHorizontal: 20, zIndex: 3 }}>
                    <SupportButton
                        text='Ayuda'
                        onPress={() => Alert.alert('Soporte', 'Soporte')}
                    />
                </View>
            </Page>
        </StripeProvider>
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
        marginTop: 70,
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