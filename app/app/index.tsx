import { Image, StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import Page from '@/components/global/Page'
import ButtonGlobal from '@/components/buttons/ButtonGlobal'
import { useRouter } from 'expo-router'
import MainLoader from '@/components/animations/MainLoader'
import { accesAuth } from '@/services/api'

const Index = () => {
    const router = useRouter()


    const handleAuth = async () => {
      const call = await accesAuth()

      console.log(call)

      if (call){
        router.replace({
          pathname: "/app/home",
        })
      } else {
        router.replace({
          pathname: "/main",
        })
      }
    }
    
      useEffect(() => {
        /* setTimeout(() => {
          router.navigate({
            pathname: "/main",
          })
        }, 1000) */
        handleAuth()
      }, [])


  return (
    <Page>
        <MainLoader/>
    </Page>
  )
}

export default Index

const styles = StyleSheet.create({
    title: {
        fontSize: 40,
        color: '#FFFFFF',
        textAlign: 'left',
        marginTop: 20,
        fontFamily: 'SemiBold',
        paddingHorizontal: 20,
    },
    picture: {
        marginTop: 15,
        marginBottom: 15,
    },
    herotext: {
        fontSize: 28,
        color: '#FFFFFF',
        textAlign: 'center',
        fontFamily: 'SemiBold',
        paddingLeft: 60,
    },
    buttonContainer: {
        display: 'flex',
        flexDirection: 'column',
        marginTop: 40,
        gap: 8,

        paddingHorizontal: 20,
    }
})