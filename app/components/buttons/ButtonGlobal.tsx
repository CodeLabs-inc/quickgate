import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler';

interface ButtonGlobalProps {
    text: string;
    onPress?: () => void;
    style?: object;
    icon?: any;
}

const ButtonGlobal = ({text, onPress, style, icon}:ButtonGlobalProps) => {
  return (
    <TouchableOpacity
        onPress={onPress && onPress}
        style={[
            styles.container,
            style
        ]}
    >
        <Text style={{fontSize: 16, color: 'white'}}>{text}</Text>
        {
            icon && 
            icon
        }
    </TouchableOpacity>
    
  )
}

export default ButtonGlobal

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#52889F',
        width: '100%',
        height: 55,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        display: 'flex',
        flexDirection: 'row',
        gap: 5,
    }

    
})        