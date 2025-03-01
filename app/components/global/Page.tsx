import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

interface PageProps {
    children: React.ReactNode
    style?: any
}

const Page = ({children, style}: PageProps) => {
    const insets = useSafeAreaInsets();

  return (
    //<RootSiblingParent>
      <GestureHandlerRootView>
            <View style={[styles.container, style, {paddingTop: insets.top}]}>
                {children}
            </View>
      </GestureHandlerRootView>
    //</RootSiblingParent>
  )
}

export default Page

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#151A23',
    }
})