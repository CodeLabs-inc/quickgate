'use client'
import React, { useEffect, useState } from 'react'
import styles from './page.module.css'

import Header from '@/components/_globals/header'
import Page from '@/components/_globals/page'
import Title from '@/components/titles/Title'
import ModalNewGater from '@/components/modals/ModalNewGater'
import GateList from '@/components/_pages/gates/GatesList'
import TransitLists from '@/components/_pages/transits/TransitLists'



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
          title={'Transitos'}
          subtitle={'Historial de transitos'}
        />

        <TransitLists />
      </Page>
    </div>
  )
}

export default Main