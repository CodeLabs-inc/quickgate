'use client'
import React, { useEffect, useState } from 'react'
import styles from './page.module.css'

import Header from '@/components/_globals/header'
import Page from '@/components/_globals/page'
import Title from '@/components/titles/Title'
import ModalNewGater from '@/components/modals/ModalNewGater'
import GateList from '@/components/_pages/gates/GatesList'



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
          title={'Gates'}
          subtitle={'Listados de los Gates '}
          actionRight={
            <div
              style={{
                border: '1px solid #ffffff80',
                borderRadius: '20px',
                padding: '7px 20px',
                cursor: 'pointer',
                fontSize: 'var(--text-sm)',
              }}
              onClick={handleToggleModalCreateGater}
            >
              Crear Gater
              <ModalNewGater
                isOpen={modalCreateGater}
                onClose={handleToggleModalCreateGater}
              />
            </div>
          }
        />
        <GateList />
      </Page>
    </div>
  )
}

export default Main