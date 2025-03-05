'use client'
import React, { useContext, useEffect, useState } from 'react'
import styles from './page.module.css'

import Header from '@/components/_globals/header'
import Page from '@/components/_globals/page'
import VideoChat from '@/components/calls/PeerCall'
import Peer from 'peerjs'
import { CallContext } from '@/components/_context/CallContext'
import { getCallersList } from '@/services/api'
import { PhoneIcon } from 'lucide-react'



function Main() {
  const { peerId, callPeer, myVideoRef, remoteVideoRef } = useContext(CallContext)

  const [callers, setCallers] = useState([])


  const handleFetchCallerList = async () => {
    const call = await getCallersList()
    if (call.success) {
      setCallers(call.data)
    }
  }

  useEffect(() => {
    handleFetchCallerList()
  }, [])

  return (
    <div className={styles.main}>
      <Header title={'Overview'} />
      <Page
        style={{
          height: '100%',
          padding: '20',
        }}
      >

        <div>
          {
            callers.map((caller: any) => {
              return (
                <div 
                  style={{
                    width: '100%',
                    background: '#ffffff20'
                  }}
                  className='flex flex-row justify-between items-center p-2'
                  onClick={() => {
                    callPeer(caller.peerId)
                  }}
                >
                  <div>
                    {caller.user.user.name}
                  </div>
                  <PhoneIcon width={25}/>
                </div>
              )
            })
          }
        </div>

       
      </Page>
    </div>
  )
}

export default Main