'use client'
import React, { useEffect, useState } from 'react'
import styles from './page.module.css'

import Header from '@/components/_globals/header'
import Page from '@/components/_globals/page'
import VideoChat from '@/components/calls/PeerCall'



interface CallsParams {
  params: {
    peerId: string
  }
}


function Main({ params }: CallsParams) {





  return (
    <div className={styles.main}>
      <Header title={'Overview'} />
      <Page
        style={{
          height: '100%',
          padding: '0',
        }}
      >

        <VideoChat peerId_sent={params.peerId} />

      </Page>
    </div>
  )
}

export default Main