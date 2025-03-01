import { StyleSheet, Text, View } from 'react-native'
import React, { useRef } from 'react'
import Page from '@/components/global/Page'
import Header from '@/components/global/Header'
import Padding from '@/components/global/Padding'
import Navbar from '@/components/global/Navbar'

import Map from '@/components/global/Map'
import TitleButton from '@/components/titles/TitleButton'
import CardParking from '@/components/card/CardParking'
import SmallLoader from '@/components/animations/SmallLoader'

import { LinearGradient } from 'expo-linear-gradient'
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { ScrollView } from 'react-native-gesture-handler'
import { getAllParkings } from '@/services/api'
import { Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import InputSearch from '@/components/inputs/InputSearch'




const index = () => {
  const insets = useSafeAreaInsets();
  const mapRef = useRef<any>(null); // Create a ref for the Map component
  const [parkings, setParkings] = React.useState([])

  const handleFetchParkings = async () => {
    const call = await getAllParkings()

    if (call.success) {
      setParkings(call.data)
    }

  }
  const handleZoomToMarker = (latitude: string, longitude: string) => {
    // Example: Zoom to a specific marker's coordinates
    mapRef.current?.zoomToMarker(latitude, longitude); // Replace with the desired latitude and longitude
  };

  React.useEffect(() => {
    handleFetchParkings()
  }, [])



  /* Animation Slider Props */

  const [isExtendedList, setIsExtendedList] = React.useState(false)

  const translateY = useSharedValue(0);
  const zIndex = useSharedValue(0);
  const height = useSharedValue(Dimensions.get('window').height);
  const paddingT = useSharedValue(insets.top);
  

  React.useEffect(() => {
    translateY.value = isExtendedList ? 50 : 0;
    zIndex.value = isExtendedList ? 1000 : 0;
    height.value = isExtendedList ? Dimensions.get('window').height : 400;
    paddingT.value = isExtendedList ? insets.top : 0;
  }, [isExtendedList]);

  // Animated style
  const animatedStyle = useAnimatedStyle(() => ({
    paddingTop: withTiming(paddingT.value, { duration: 300 }),
    zIndex: isExtendedList ? 1000 : 0,
    height: withTiming(height.value, { duration: 300 }),
    backgroundColor:"#151A23",
    position: isExtendedList ? 'absolute' : 'relative',
    bottom: 0,
  }));



  return (
    <Page>

      <View style={styles.padding}>
        <Header type='search' />
      </View>

      <Map
        ref={mapRef}
        markers={parkings.map((parking: any) => {
          return {
            latitude: parking.address.cords.latitude,
            longitude: parking.address.cords.longitude,
            nameGate: parking.name,
            address: `${parking.address.street}, ${parking.address.city}`
          }
        })}
      />

      <Animated.View
        style={[
          { flex: 1, height: '100%' }, animatedStyle
        ]}

      >
        
        <Padding>
          <View style={{
            width: '100%',
            transform: [{ translateY: -10 }],
            zIndex: 3000
          }}>
            <TitleButton
              title='Parqueos Cercanos'
              rightSide={`${!isExtendedList ? 'Ver más' : 'Mapa'}`}
              rigthSidePress={() => {
                setIsExtendedList(!isExtendedList)
              }}
            />
          </View>


          {
            parkings.length == 0 ?
              <View style={{ height: '100%', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ transform: [{ translateY: -40 }] }}>
                  <SmallLoader />
                </View>
              </View>
              :
              <ScrollView 
                showsVerticalScrollIndicator={false} 
                style={[
                  styles.scroll, 
                  {paddingTop: isExtendedList ? 40 : 10}
                ]}
              >
                {
                  parkings.map((parking: any, index) => {
                    return (
                      <CardParking
                        key={index}
                        name={parking.name}
                        address={`${parking.address.street}, ${parking.address.city}`}
                        availability={parking.settings.capacity}
                        price={parking.rates.hourly}
                        onPress={
                          () => handleZoomToMarker(parking.address.cords.latitude, parking.address.cords.longitude)
                        }
                      />
                    )

                  })

                }
                <View style={{ height: 90, width: '100%' }} />
              </ScrollView>
          }
        </Padding>
      </Animated.View>

      <Navbar page='map' />
    </Page>
  )
}

export default index

const Fade = ({ style, start, end }: { style?: any, start?: number, end?: number }) => {
  return (
    <LinearGradient
      style={[styles.fade, style]}
      colors={["#00000000", "#151A23"]}
      start={{ x: 0, y: start ?? 0 }}
      end={{ x: 0, y: end ?? 1 }}
    />
  );
};


const styles = StyleSheet.create({
  padding: {
    padding: 10
  },
  scroll: {
    transform: [{ translateY: 10 }],
  },
  fade: {
    height: 100,
    width: '100%',
    position: 'absolute',
    zIndex: 100,
  },
})