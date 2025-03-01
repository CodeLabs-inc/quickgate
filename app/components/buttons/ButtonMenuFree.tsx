import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'

interface ButtonMenuProps {
    content: any;
    icon: any;
    onPress?: () => void;
    style?: any
    styleText?: any

    index?: number
    lenthGroup: number
}

const ButtonMenuFree = ({content, icon, onPress, style, styleText, index, lenthGroup}: ButtonMenuProps) => {
  return (
    <View style={[styles.container, style,
      { borderTopRightRadius: index === 0 ? 10 : 0} ,
      {  borderTopLeftRadius: index === 0 ? 10 : 0},
      {  borderBottomRightRadius: index === lenthGroup ? 10 : 0},
      {  borderBottomLeftRadius: index === lenthGroup ? 10 : 0}
      
    ]}>
      {
        content
      }

      {
        icon
      }
    </View>
  )
}

export default ButtonMenuFree

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