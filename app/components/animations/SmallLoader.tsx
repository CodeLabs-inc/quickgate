import { View, Text, StyleSheet } from 'react-native'
import React, { useEffect } from 'react'
import LottieView from 'lottie-react-native'

const SmallLoader = () => {

  return (
    <View style={styles.viewport}>
      <LottieView 
        source={require('@/assets/animations/parking.json')}
        style={{ height: 200, aspectRatio: 1}}
        autoPlay
        loop
        />
    </View>
  )
}

export default SmallLoader


const styles = StyleSheet.create({
  viewport: {

    zIndex: 100,
    width: 100,
    height: 200,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    },

})