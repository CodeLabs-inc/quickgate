import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect } from 'react'
import Home from '../icons/Home'
import Pin from '../icons/Pin'
import Gear from '../icons/Gear'
import { useRouter } from 'expo-router'


interface NavbarProps {
    page?: "home" | "map" | "settings"
}


const Navbar = ({page}: NavbarProps) => {
    const router = useRouter()


    return (
        <View style={styles.container}>
            <TouchableOpacity 
                onPress={() => router.replace('/app/home')}
                style={[
                    styles.circle,
                    {backgroundColor: page === 'home' ? '#52889F' : ''}
                ]}
            >
                <Home
                    color='#fff'
                />
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => router.replace('/app/map')}
                style={[
                    styles.circle,
                    {backgroundColor: page === 'map' ? '#52889F' : ''}
                ]}
            >
                <Pin
                    color='#fff'
                />
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => router.replace('/app/settings')}
                style={[
                    styles.circle,
                    {backgroundColor: page === 'settings' ? '#52889F' : ''}
                ]}
            >
                <Gear
                    color='#fff'
                />
            </TouchableOpacity>
        </View>
    )
}

export default Navbar

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 30,
        left: '50%',
        transform: [{ translateX: '-50%' }],

        width: 170,
        height: 50,
        backgroundColor: '#333842',
        borderRadius: 25,

        padding: 3,

        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',

        boxShadow: '0px 0px 10 px rgba(0, 0, 0, 0.25)'

    },

    circle: {
        width: 44,
        height: 44,
        borderRadius: 50,
        

        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    }
})