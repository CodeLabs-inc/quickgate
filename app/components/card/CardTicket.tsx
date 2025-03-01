import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import ButtonGlobal from '../buttons/ButtonGlobal'
import { opacity } from 'react-native-reanimated/lib/typescript/Colors'
import AlertCard from '../global/Alert'


interface CardParkingProps {
    name: string,
    address: string,
    isPaid: boolean,
    onPress?: () => void
}

const CardTicket = ({
    name,
    address,
    isPaid,
    onPress
}: CardParkingProps) => {



    return (
        <View style={styles.container}>


            <View style={styles.cardTop}>
                <View
                    style={styles.logoParking}
                >
                    <Image
                        source={require('@/assets/pictures/ticket.png')}
                        style={{ width: 35, height: 35 }}
                    />
                </View>

                <View style={styles.infoParking}>
                    <View style={{ display: 'flex', flexDirection: 'row', gap: 10, alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text style={styles.title}>{name}</Text>

                        <View
                            style={[
                                styles.badgeTile,
                                { backgroundColor: isPaid ? 'green' : 'tomato' },
                                {paddingHorizontal: 5}
                            ]}
                        >
                            <Text style={{ fontSize: 12, color: 'white' }}>
                                {isPaid ? 'Pagado' : 'Pendiente'}
                            </Text>
                        </View>
                    </View>
                    <Text style={styles.address}>{address} </Text>
                </View>
            </View>


            <View style={styles.cardBottom}>
                {
                    !isPaid ?
                        <ButtonGlobal
                            text="Pagar"
                            onPress={onPress}
                        />
                        :
                        <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>

                            <AlertCard
                                title="¡Estacionamiento Pagado!"
                                message='Pase por la puerta para salir, tiene 10 minutos'
                                color='green'
                            />
                            <View style={{ width: '100%', height: 200, backgroundColor: '#00ff0010', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: 20, marginTop: 10 }}>
                                <Image
                                    source={require('@/assets/pictures/gate.png')}
                                    style={{ width: 200, height: 200, marginTop: 10 }}
                                />
                            </View>
                        </View>
                }

            </View>



        </View>
    )
}

export default CardTicket

const styles = StyleSheet.create({
    container: {
        width: '100%',
        borderRadius: 40,
        backgroundColor: '#252A32',
        marginBottom: 10,
    },

    cardTop: {
        display: 'flex',
        flexDirection: 'row',
        padding: 20,
        backgroundColor: '#30353F',
        borderRadius: 40,

        alignItems: 'center',
        gap: 20,
    },

    logoParking: {
        height: 50,
        width: 50,
        borderRadius: 50,
        backgroundColor: '#fff',

        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },

    infoParking: {
        width: '80%',
        gap: 5,
    },

    title: {
        color: '#fff',
        fontSize: 20,
        fontFamily: 'SemiBold',
    },

    address: {
        color: '#ffffff70',
        fontSize: 14,
        fontFamily: 'Medium',
    },


    cardBottom: {


        padding: 20,


    },

    infoTile: {
        gap: 5,
    },

    tile: {
        color: '#ffffff90',
        fontSize: 14,
        fontFamily: 'Medium',
    },

    tileValue: {
        color: '#FFF',
        fontSize: 18,
        fontFamily: 'SemiBold',
    },

    mapsButton: {
        backgroundColor: '#52889F',
        height: 50,
        width: 90,
        color: '#fff',
        fontFamily: 'Medium',
        borderRadius: 30,

        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    textButton: {
        fontFamily: "SemiBold",
        color: '#fff',
        fontSize: 18,
    },
    badgeTile: {

        
        height: 20,
        borderRadius: 10,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
})