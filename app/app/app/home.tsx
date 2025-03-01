import { Image, RefreshControl, StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect } from 'react'
import Page from '@/components/global/Page'
import Header from '@/components/global/Header'
import Padding from '@/components/global/Padding'
import Navbar from '@/components/global/Navbar'
import { getUserActiveSubscriptions, getUserActiveTickets } from '@/services/api'
import { ScrollView } from 'react-native-gesture-handler'
import CardTicket from '@/components/card/CardTicket'
import { LinearGradient } from 'expo-linear-gradient'
import MainLoader from '@/components/animations/MainLoader'
import SmallLoader from '@/components/animations/SmallLoader'
import { useRouter } from 'expo-router'
import Title from '@/components/global/Title'
import CardSubscription from '@/components/card/CardSubscription'
import { AuthContext } from '@/context/AuthContext'

const index = () => {
  const router = useRouter()
  const { fetchUserData } = useContext(AuthContext)

  const [activeTickets, setActiveTickets] = React.useState([])
  const [activeSubscriptions, setActiveSubscriptions] = React.useState([])

  const [isLoading, setIsLoading] = React.useState(true)
  const [isSubscriptionsLoading, setIsSubscriptionsLoading] = React.useState(true)
  const [refreshing, setRefreshing] = React.useState(false);

  // Function to handle refresh
  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);

    await fetchUserData()
    await handleFetchActiveTickets()
    await handleFetchActiveSubscriptions()

    setRefreshing(false);

  }, []);


  const handleFetchActiveTickets = async () => {
    const call = await getUserActiveTickets()

    if (call.success) {
      console.log(call.data)
      setActiveTickets(call.data)
    }

    setIsLoading(false)
    return true
  }
  const handleFetchActiveSubscriptions = async () => {
    const call = await getUserActiveSubscriptions()

    console.log(call)
    if (call.success) {
      setActiveSubscriptions(call.data)
    }

    setIsSubscriptionsLoading(false)
    return true
  }
  const handleGoToPayment = async (licensePlate: string, ticketId: string) => {
    router.navigate({
      pathname: "/pago/informations",
      params: {
        licensePlate: licensePlate,
        ticketId: ticketId
      },
    });
  }


  useEffect(() => {
    handleFetchActiveTickets()
    handleFetchActiveSubscriptions()
    fetchUserData()
  }, [])



  return (
    <Page style={{ heigth: '100%' }}>
        
      <Padding style={{ height: "100%" }}>
        <Header />

        <ScrollView
          style={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#ffffff70" // Customize the spinner color
              colors={['#fffff70']} // Android-specific spinner colors
            />
          }
        >
          <Title
            line1='Tickets'
            line2='Activos'
            styleText={{ fontSize: 16 }}
            style={{ flexDirection: 'row', gap: 4, marginBottom: 10 }}
          />
          {
            !isLoading &&
              activeTickets.length > 0 ?
              activeTickets.map((ticket: any) => {
                return (
                  <CardTicket
                    key={ticket._id}
                    name={ticket.licensePlate}
                    address={`${ticket.gateData.name} -  ${ticket.gateData.address.city}`}
                    isPaid={ticket.isPaid}
                    onPress={() => {
                      handleGoToPayment(ticket.licensePlate, ticket._id)
                    }}
                  />
                )
              })
              :
              !isLoading &&
                activeTickets.length === 0 ?
                <View style={styles.noTicketContainer}>
                  <Image
                    source={require('@/assets/pictures/ticket.png')}
                    style={{ width: 200, height: 200 }}
                  />
                  <Text style={styles.titleNo1}>No tienes tickets activos</Text>
                  <Text style={styles.titleNo2}>Parqueate con tus carros, para ver uno</Text>
                </View>
                :
                isLoading &&
                <View
                  style={{
                    height: 200,
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <SmallLoader />
                </View>
          }



          <Title
            line1='Pasajes'
            line2='Activos'
            styleText={{ fontSize: 16 }}
            style={{ flexDirection: 'row', gap: 4, marginBottom: 10, marginTop: 20 }}
          />
          {
            !isSubscriptionsLoading &&
              activeSubscriptions.length > 0 ?
              activeSubscriptions.map((ticket: any) => {
                return (
                  <CardSubscription
                    key={ticket._id}

                    name={ticket.licensePlate + ` - (${ticket.gateId.name})`}
                    address={ticket.gateId.address.street + ', ' + ticket.gateId.address.city}
                    date={ticket.endDate}
                  />
                )
              })
              :
              !isSubscriptionsLoading &&
                activeSubscriptions.length === 0 ?
                <View style={[styles.noTicketContainer,]}>
                  <Image
                    source={require('@/assets/pictures/key.png')}
                    style={{ width: 200, height: 200 }}
                  />
                  <Text style={styles.titleNo1}>No tienes pasajes Activos</Text>
                  <Text style={styles.titleNo2}>Tienes que eres parte de un residencial o de un parqueo</Text>
                </View>
                :
                isSubscriptionsLoading &&
                <View
                  style={{
                    height: 100,
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <SmallLoader />
                </View>
          }
          <View style={{ width: '100%', height: 150 }} />
        </ScrollView>
      </Padding>





      <Navbar page='home' />
    </Page>
  )
}

export default index

const styles = StyleSheet.create({
  list: {
    paddingTop: 10,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  titleNo1: {
    color: '#fff',
    fontSize: 20,
    textAlign: 'center',
    marginTop: 20
  },
  titleNo2: {
    color: '#ffffff80',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 5
  },
  noTicketContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10
  }
})




const Fade = ({ style, start, end }: { style?: any, start?: number, end?: number }) => {
  return (
    <LinearGradient
      style={[stylesF.fade, style]}
      colors={["#00000000", "#151A23"]}
      start={{ x: 0, y: start ?? 0 }}
      end={{ x: 0, y: end ?? 1 }}
    />
  );
};


const stylesF = StyleSheet.create({
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