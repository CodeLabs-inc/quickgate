import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import LottieView from 'lottie-react-native'

const Checkmark = () => {
  return (
    <View style={styles.viewport}>
      <LottieView
        source={require('@/assets/animations/checkmark.json')}
        style={{ height: 200, aspectRatio: 1 }}
        autoPlay
        loop={false}
      />
    </View>
  )
}

export default Checkmark


const styles = StyleSheet.create({
  viewport: {
    marginTop: 40,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },

})