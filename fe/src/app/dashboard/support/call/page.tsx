'use client'
import React, { useEffect, useState } from 'react'
import styles from './page.module.css'

import Header from '@/components/_globals/header'
import Page from '@/components/_globals/page'
import Title from '@/components/titles/Title'
import CardAlert from '@/components/cards/CardAlert'
import UnderConstruction from '@/components/404/UnderConstruction'
import SupportPage from '@/components/_pages/support/Support'
import CallPage from '@/components/_pages/support/Call'



function Main() {





  return (
    <div className={styles.main}>
      <Header title={'Overview'} />
      <Page>
        
        <Title
          isLoading={false}
          title={'Contactar Soporte Videollamada'}
          subtitle={'llamada urgente al soporte'}
          
        />
        <CallPage/>
        
      </Page>
    </div>
  )
}

export default Main