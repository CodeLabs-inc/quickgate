import { View, Text, StyleSheet } from 'react-native'
import React, { useEffect } from 'react'
import LottieView from 'lottie-react-native'
import { useRouter } from 'expo-router'

const LoaderGlobal = () => {

  return (
    <View style={styles.viewport}>
      <LottieView 
        source={require('@/assets/animations/parking.json')}
        style={{ height: 500, aspectRatio: 1, transform: [{translateY: -70}] }}
        autoPlay
        loop
        />
    </View>
  )
}

export default LoaderGlobal


const styles = StyleSheet.create({
  viewport: {

    zIndex: 100,
    backgroundColor: "#151A23",
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    },

})