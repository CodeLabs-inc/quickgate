import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';

interface PageProps {
    children: React.ReactNode
}

const Page = ({children}: PageProps) => {
    const insets = useSafeAreaInsets();

  return (
    //<RootSiblingParent>
      <GestureHandlerRootView>
            <ScrollView style={[styles.container, {paddingTop: insets.top}]}>
                {children}
            </ScrollView>
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