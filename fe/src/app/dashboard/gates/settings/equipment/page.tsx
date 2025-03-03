'use client'
import React, { useEffect, useState } from 'react'
import styles from './page.module.css'

import Header from '@/components/_globals/header'
import Page from '@/components/_globals/page'
import Title from '@/components/titles/Title'
import SettingsEquipmentGate from '@/components/_pages/gates/SettingsEqupimentGate'
import { getDevices } from '@/services/api'
import toast from 'react-hot-toast'



function Main() {

  return (
    <div className={styles.main}>
      <Header />
      <Page>
        <Title
          isLoading={false}
          title={'Ajustes Equipo'}
          subtitle={'Todos los equipos de tu sistema conectados a los servicios'}
        />
        <SettingsEquipmentGate/>
      </Page>
    </div>
  )
}

export default Main