import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import Page from '@/components/global/Page'
import Header from '@/components/global/Header'
import Padding from '@/components/global/Padding'
import Navbar from '@/components/global/Navbar'
import ButtonMenu from '@/components/buttons/ButtonMenu'
import ChevronRight from '@/components/icons/ChevronRight'
import LogInIcon from '@/components/icons/LogIn'
import Trash from '@/components/icons/Trash'
import QuestionMark from '@/components/icons/QuestionMark'
import Facebook from '@/components/icons/Facebook'
import Twitter from '@/components/icons/Twitter'
import Instagram from '@/components/icons/Instagram'
import Constants from 'expo-constants';
import { removeToken } from '@/services/api'
import { useRouter } from 'expo-router'

const index = () => {
  const version = Constants
  const router = useRouter()

  const handleLogout = () => {
    const call = removeToken()
  }

  return (
    <Page>
      <Padding style={{ padding: 20 }}>

        {/* Title */}
        <Text style={styles.title}>Ajustes</Text>

        {/* Form */}
        <View>
          <ButtonMenu
            index={0}
            lenthGroup={2}
            text='Cuenta'
            icon={<ChevronRight />}
            onPress={() => {
              router.push({
                pathname: '/app/setting/account'
              })
            }}

          />
          <ButtonMenu
            index={1}
            lenthGroup={2}
            text='Vehiculos'
            icon={<ChevronRight />}
            onPress={() => {
              router.push({
                pathname: '/app/setting/vehicles'
              })
            }}
          />
          <ButtonMenu
            index={2}
            lenthGroup={2}
            text='Recargar saldo'
            icon={<ChevronRight />}
            onPress={() => {
              router.push({
                pathname: '/app/setting/reload'
              })
            }}
            style={{ marginBottom: 40 }}
          />

          <ButtonMenu
            index={0}
            lenthGroup={1}
            text='Notificaciones'
            icon={<ChevronRight />}
            onPress={() => {
              router.push({
                pathname: '/app/setting/notifications'
              })
            }}
          />
          <ButtonMenu
            index={1}
            lenthGroup={1}
            text='Terminos y condiciones'
            icon={<ChevronRight />}
            onPress={() => {
              router.push({
                pathname: '/app/setting/tns'
              })
            }}
            style={{ marginBottom: 40 }}
          />

          <ButtonMenu
            index={0}
            lenthGroup={1}
            text='Logout'
            icon={<LogInIcon color='white' />}
            onPress={handleLogout}
          />
          <ButtonMenu
            index={1}
            lenthGroup={1}
            text='Borrar cuenta'
            icon={<Trash color='tomato' />}
            onPress={() => { }}

            styleText={{ color: 'tomato' }}
          />
        </View>


        <View style={styles.floatBottom}>
          {/* Support Button  */}
          <TouchableOpacity style={styles.supportContainer}>
            <Text style={styles.supportText}>Soporte</Text>
            <QuestionMark color='white' size={22} />
          </TouchableOpacity>

          {/* Socials  */}
          <View style={styles.socialsContainer}>
            <TouchableOpacity>
              <Facebook />
            </TouchableOpacity>

            <TouchableOpacity>
              <Twitter />
            </TouchableOpacity>

            <TouchableOpacity>
              <Instagram />
            </TouchableOpacity>
          </View>

          <Text style={{ color: 'white', fontSize: 12, textAlign: 'center', marginTop: 10 }}> v{version.expoConfig?.version} ({version.expoConfig?.ios?.buildNumber})</Text>
        </View>


      </Padding>
      <Navbar page='settings' />
    </Page>
  )
}

export default index

const styles = StyleSheet.create({
  title: {
    fontSize: 40,
    fontFamily: 'SemiBold',
    color: 'white',
    marginBottom: 40
  },
  supportContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
    gap: 10
  },
  supportText: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'Bold'
  },
  socialsContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    gap: 20
  },
  floatBottom: {
    position: 'absolute',
    bottom: 120,
    left: 0,
    right: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10
  },
})