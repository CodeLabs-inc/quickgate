'use client'
import React, { Suspense, useContext, useEffect, useState } from 'react'
import styles from './page.module.css'

import Header from '@/components/_globals/header'
import Page from '@/components/_globals/page'
import Title from '@/components/titles/Title'
import CardAlert from '@/components/cards/CardAlert'
import UnderConstruction from '@/components/404/UnderConstruction'
import SupportPage from '@/components/_pages/support/Support'
import InputAnimated from '@/components/inputs/inputAnimated'
import { AuthContext } from '@/components/_context/AuthContext'
import { SocketContext } from '@/components/_context/SocketContext'
import { useSearchParams } from 'next/navigation'
import LoaderWhite from '@/components/loaders/LoaderWhite'

export default function Main() {
  return (
    <Suspense fallback={<LoaderWhite />}>
      <Index />
    </Suspense>
  )
}



function Index() {
  const { sendMessageOperator, sendMessageAdmin } = useContext(SocketContext)
  const { role } = useContext(AuthContext)
  const searchParams = useSearchParams()
  const gateId = searchParams.get('gateId')

  const handleSendMessage = (message: string) => {
    if (role === 'operator') {
      sendMessageOperator(message)
    } else {
      if (!gateId) return
      sendMessageAdmin(message, gateId)
    }

  }





  return (
    <div className={styles.main}>
      <Header title={'Overview'} />
      <Page
        style={{
          height: '100%',
          position: 'relative',
          overflowY: 'hidden!',
          padding: '0'
        }}
      >

        <Title
          isLoading={false}
          title={'Soporte'}
          subtitle={'Escribe al soporte, para obtener asistencia'}
          style={{
            position: 'absolute',
            top: 30,
            left: 30,
          }}
        />

        <SupportPage />


        <InputAnimated
          style={{
            height: '200px',
            width: '100%',
            position: 'absolute',
            bottom: '-0px'
          }}
          onSend={(text) => {
            handleSendMessage(text)
          }}
        />

      </Page>
    </div>
  )
}

