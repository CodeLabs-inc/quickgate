import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler';

interface ButtonGlobalProps {
    children?: React.ReactNode;
    onPress?: () => void;
    style?: object;
}

const ButtonFree = ({children, onPress, style}:ButtonGlobalProps) => {
  return (
    <TouchableOpacity
        onPress={onPress && onPress}
        style={[
            styles.container,
            style
        ]}
    >  
        {children} 
    </TouchableOpacity>
    
  )
}

export default ButtonFree

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#52889F',
        width: '100%',
        height: 55,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center'
    }

    
})        