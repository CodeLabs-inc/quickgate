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
    ExtraBold: require('../../assets/fonts/Manrope-ExtraBold.ttf'),
    Bold: require('../../assets/fonts/Manrope-Bold.ttf'),
    SemiBold: require('../../assets/fonts/Manrope-SemiBold.ttf'),
    Medium: require('../../assets/fonts/Manrope-Medium.ttf'),
    Regular: require('../../assets/fonts/Manrope-Regular.ttf'),
    Light: require('../../assets/fonts/Manrope-Light.ttf'),
    ExtraLight: require('../../assets/fonts/Manrope-ExtraLight.ttf'),
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
      <Stack screenOptions={{ headerShown: false}}>
        <Stack.Screen name="index" options={{
           headerShown: false, 
           gestureEnabled: true,
           //gestureDirection: 'horizontal',
           animation: 'slide_from_bottom'
        }} />
        <Stack.Screen name="informations" options={{
           headerShown: false, 
           gestureEnabled: true,
           //gestureDirection: 'horizontal',
           animation: 'none'
        }} />
        <Stack.Screen name="pay" options={{
           headerShown: false, 
           gestureEnabled: true,
           animation: 'fade'
        }} />
        <Stack.Screen name="pay-success" options={{
           headerShown: false, 
           gestureEnabled: true,
        }} />
        <Stack.Screen name="pay-failed" options={{
           headerShown: false, 
           gestureEnabled: true,
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