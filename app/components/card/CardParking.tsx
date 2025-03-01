import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import MapParking from '../animations/MapParking'


interface CardParkingProps {
    name: string,
    address: string,
    availability: number,
    price: number,
    onPress?: () => void
}

const CardParking = ({
    name,
    address,
    availability,
    price,
    onPress
}: CardParkingProps) => {



    return (
        <View style={styles.container}>


            <View style={styles.cardTop}>
                <View style={styles.logoParking}>
                    <MapParking/>
                </View>

                <View style={styles.infoParking}>
                    <Text style={styles.title}>{name}</Text>
                    <Text style={styles.address}>{address} </Text>
                </View>
            </View>


            <View style={styles.cardBottom}>

                <View style={styles.infoTile}>
                    <Text style={styles.tile}>Capacidad</Text>
                    <Text style={styles.tileValue}>{availability}</Text>
                </View>

                <View style={styles.infoTile}>
                    <Text style={styles.tile}>Precio</Text>
                    <Text style={styles.tileValue}>{price} RD$/h</Text>
                </View>

                <TouchableOpacity onPress={onPress} style={styles.mapsButton}>
                    <Text style={styles.textButton}>Maps</Text>
                </TouchableOpacity>

            </View>



        </View>
    )
}

export default CardParking

const styles = StyleSheet.create({
    container: {
        height: 190,
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
    },

    infoParking: {
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

        display: 'flex',
        flexDirection: 'row',
        padding: 20,

        alignItems: 'center',
        justifyContent: 'space-between',
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
    }
})