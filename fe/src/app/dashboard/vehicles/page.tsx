'use client'
import React, { useEffect, useState } from 'react'
import styles from './page.module.css'

import Header from '@/components/_globals/header'
import Page from '@/components/_globals/page'
import Title from '@/components/titles/Title'
import VehicleLists from '@/components/_pages/vehicles/VehicleLists'



function Main() {

  const [modalCreateGater, setModalCreateGater] = useState(false)

  const handleToggleModalCreateGater = () => {
    setModalCreateGater(!modalCreateGater)
  }



  return (
    <div className={styles.main}>
      <Header />
      <Page>
        <Title
          isLoading={false}
          title={'Vehiculos'}
          subtitle={'Registro de todos los vehiculos que han ingresado en la plataforma'}
        />

        <VehicleLists />
      </Page>
    </div>
  )
}

export default Main