import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'

interface ButtonMenuProps {
    text: string;
    icon: any;
    onPress: () => void;
    style?: any
    styleText?: any

    index?: number
    lenthGroup: number
}

const ButtonMenu = ({text, icon, onPress, style, styleText, index, lenthGroup}: ButtonMenuProps) => {
  return (
    <TouchableOpacity style={[styles.container, style,
      { borderTopRightRadius: index === 0 ? 10 : 0} ,
      {  borderTopLeftRadius: index === 0 ? 10 : 0},
      {  borderBottomRightRadius: index === lenthGroup ? 10 : 0},
      {  borderBottomLeftRadius: index === lenthGroup ? 10 : 0}
      
    ]} onPress={onPress}>
      <Text style={[styles.text, styleText]}>{text}</Text>

      {
        icon
      }
    </TouchableOpacity>
  )
}

export default ButtonMenu

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',

        borderBottomWidth: 1,
        borderColor: '#151A23',

        paddingHorizontal: 15,
        

        backgroundColor: '#333842',
        height: 50,
        width: '100%'
    },
    text: {
        color: 'white',
        fontSize: 15,
        fontFamily: 'Medium'
    }
})