import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'


interface TitleButtonProps {
    title?: string
    rightSide?: any
    rigthSidePress?: () => void
}

const TitleButton = ({title, rightSide, rigthSidePress}:TitleButtonProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>

      <TouchableOpacity onPress={rigthSidePress}>
        <Text style={styles.rightSide}>{rightSide}</Text>
      </TouchableOpacity>
    </View>
  )
}

export default TitleButton

const styles = StyleSheet.create({
    container:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
        zIndex: 1000
    },
    title:{
        fontSize: 18,
        fontFamily: 'SemiBold',
        color: 'white'
    },
    rightSide:{
        fontSize: 14,
        fontFamily: 'Medium',
        color: '#FFFFFFa8'
    }
})