'use client'
import React, { useEffect, useState } from 'react'
import styles from './page.module.css'

import Header from '@/components/_globals/header'
import Page from '@/components/_globals/page'
import Title from '@/components/titles/Title'
import SettingsAmenitiesGate from '@/components/_pages/gates/SettingsAmenitiesGate'



function Main() {



  return (
    <div className={styles.main}>
      <Header />
      <Page>
        <Title
          isLoading={false}
          title={'Ajustes Gate'}
          subtitle={'Ajustes generales del gate, vehiculos, usuarios, etc.'}
        />
        <SettingsAmenitiesGate/>
      </Page>
    </div>
  )
}

export default Main