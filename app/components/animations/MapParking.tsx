import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import LottieView from 'lottie-react-native'


interface MapParkingProps {
  name?: string
}

const MapParking = ({name}: MapParkingProps) => {
  return (
    <View style={styles.viewport}>
      <Text style={styles.name}>{name}</Text>
      <LottieView
        source={require('@/assets/animations/map_parking.json')}
        style={{ height: 40, aspectRatio: 1, borderRadius: 15 }}
        autoPlay
        loop={true}
      />
    </View>
  )
}

export default MapParking


const styles = StyleSheet.create({
  viewport: {
    height: 50,
    width: 50,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    padding: 5,
    backgroundColor: '#0d223c',
    position: 'relative'
  },
  name:{
    width: 100,
    textAlign: 'center',
    position: 'absolute',
    bottom: -13,
    zIndex: 1,
    color: 'white',
    fontSize: 11,

  }

})