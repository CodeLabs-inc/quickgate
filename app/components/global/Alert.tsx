import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import InfoIcon from '../icons/Info'

interface AlertProps {
    title: string,
    message: string,
    color?: string,
    style?: object,
}

const AlertCard = ({title, message, color, style}: AlertProps) => {
  return (
    <View style={[styles.container, style, {borderColor: color ?? '#E0E0E0'}]}>
        <InfoIcon color={color ?? '#E0E0E0'}/>

        <View style={styles.text}>
            <Text style={[styles.title]}>{title}</Text>
            <Text style={[styles.message]}>{message}</Text>
        </View>
    </View>
  )
}

export default AlertCard

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 7,
        borderWidth: 1,
    },

    text: {
        flex: 1,
        flexDirection: 'column',
        gap: 5,
    },

    title: {
        fontSize: 14,
        fontFamily: 'Bold',
        color: '#FFFFFF',
    },
    message: {
        fontSize: 12,
        color: '#E0E0E0a9',
        
    },
})