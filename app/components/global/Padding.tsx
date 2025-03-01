import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

interface PaddingProps {
    children: React.ReactNode
    style?: any
}

const Padding = ({children, style}: PaddingProps) => {
  return (
    <View style={[styles.padding, style]}>
       {children}
    </View>
  )
}

export default Padding

const styles = StyleSheet.create({
    padding: {
        height: '100%',
        flex: 1,
        padding: 10,
    },
})