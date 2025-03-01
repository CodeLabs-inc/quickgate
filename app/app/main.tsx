import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Page from '@/components/global/Page'
import ButtonGlobal from '@/components/buttons/ButtonGlobal'
import { useRouter } from 'expo-router'
import LogInIcon from '@/components/icons/LogIn'
import GalleryHorizontalIcon from '@/components/icons/GalleryHorizontal'

const Index = () => {
    const router = useRouter()



    const handleGoToLogin = () => {
        router.replace({
            pathname: "/auth",
            /* params: {
                'food': 'pizza'
            }, */
        });
    }
    const handleGoToPay = () => {
        router.replace({
            pathname: "/pago",
            /* params: {
                'food': 'pizza'
            }, */
        });
    }



  return (
    <Page>
        <Text style={styles.title}>QuickGate</Text>
        <Image 
            style={styles.picture}
            source={require('@/assets/pictures/suv.png')}
        />

        <View style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginTop: 40}}>
            <Text style={styles.herotext}>Parqueate</Text>
            <Text style={styles.herotext}>Sencillo</Text>
        </View>


        <View style={styles.buttonContainer}>
            <ButtonGlobal
                text="Acceder"
                onPress={handleGoToLogin}
                icon={
                    <LogInIcon color='white'/>
                }
            />
            <ButtonGlobal
                text="Pago rapido"
                onPress={handleGoToPay}
                style={{backgroundColor: '#000', height: 100}}
                icon={
                    <GalleryHorizontalIcon/>
                }
            />
        </View>

        <Text style={styles.tns}>Utilisando la aplicacion esta acceptando los</Text>
        <Text style={styles.tnsa}>Terminos y condiciones</Text>
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
    },
    tns: {
        color: '#FFFFFF',
        fontSize: 13,
        textAlign: 'center',
        marginTop: 10,
        paddingHorizontal: 20,
    },
    tnsa: {
        color: '#52889F',
        fontSize: 13,
        textAlign: 'center',
        paddingHorizontal: 20,
    }
})