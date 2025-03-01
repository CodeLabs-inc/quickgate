'use client'
import React, { useEffect, useState } from 'react'
import styles from './page.module.css'

import Header from '@/components/_globals/header'
import Page from '@/components/_globals/page'
import Title from '@/components/titles/Title'
import SettingsSubscriptions from '@/components/_pages/gates/SettingsSubscriptions'



function Main() {



  return (
    <div className={styles.main}>
      <Header />
      <Page>
        <Title
          isLoading={false}
          title={'Información de pago'}
          subtitle={'Datos de facturación y pago servicios'}
        />
        <SettingsSubscriptions/>
      </Page>
    </div>
  )
}

export default Main