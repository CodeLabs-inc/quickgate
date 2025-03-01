import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

/**
 * CardSide component
 * @param {React.ReactNode} children - The children of the component
 * @param {boolean} left - If the card cut side is on the left
 */

interface CardSideProps {
    children: React.ReactNode   
    left?: boolean
    style?: object
}

const CardSide = ({children, left, style}:CardSideProps) => {
  return (
    <View style={[
        styles.cardSide, 
        style,

        {borderBottomRightRadius: left ? 0 : 20},
        {borderTopRightRadius: left ? 0 : 20},
        {borderBottomLeftRadius: left ? 20 : 0},
        {borderTopLeftRadius: left ? 20 : 0},
    ]}>
      {children}
    </View>
  )
}

export default CardSide

const styles = StyleSheet.create({
    cardSide:{
        backgroundColor: '#252A32',
        paddingHorizontal: 20,
        paddingVertical: 10,
    }
})