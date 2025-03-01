import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';


// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    ExtraBold: require('../../../assets/fonts/Manrope-ExtraBold.ttf'),
    Bold: require('../../../assets/fonts/Manrope-Bold.ttf'),
    SemiBold: require('../../../assets/fonts/Manrope-SemiBold.ttf'),
    Medium: require('../../../assets/fonts/Manrope-Medium.ttf'),
    Regular: require('../../../assets/fonts/Manrope-Regular.ttf'),
    Light: require('../../../assets/fonts/Manrope-Light.ttf'),
    ExtraLight: require('../../../assets/fonts/Manrope-ExtraLight.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="reload" options={{
          headerShown: false,
          gestureEnabled: true,
          animation: 'none'
          //gestureDirection: 'horizontal',
        }} />
        <Stack.Screen name="account" options={{
          headerShown: false,
          gestureEnabled: true,
          animation: 'none'
          //gestureDirection: 'horizontal',
        }} />
        <Stack.Screen name="vehicles" options={{
          headerShown: false,
          gestureEnabled: true,
          animation: 'none'
          //gestureDirection: 'horizontal',
        }} />
        <Stack.Screen name="tns" options={{
          headerShown: false,
          gestureEnabled: true,
          animation: 'none'
          //gestureDirection: 'horizontal',
        }} />
        <Stack.Screen name="notifications" options={{
          headerShown: false,
          gestureEnabled: true,
          animation: 'none'
          //gestureDirection: 'horizontal',
        }} />
        <Stack.Screen name="newvehicle" options={{
          headerShown: false,
          gestureEnabled: true,
          animation: 'slide_from_right'
          //gestureDirection: 'horizontal',
        }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}


{/* <Stack.Screen name="index" options={{ headerShown: false, animation: 'fade' }} />
        <Stack.Screen name="camera" options={{
          headerShown: false, 
          gestureEnabled: true,
          //gestureDirection: 'horizontal',
          animation:'fade'
        }}/>
        <Stack.Screen name="chat" options={{
          headerShown: false, 
          gestureEnabled: true,
          //gestureDirection: 'horizontal',
          animation: 'slide_from_bottom'
        }}/> */}