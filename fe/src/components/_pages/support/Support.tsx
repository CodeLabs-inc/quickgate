import { AuthContext } from '@/components/_context/AuthContext'
import { SocketContext } from '@/components/_context/SocketContext'
import InputAnimated from '@/components/inputs/inputAnimated'
import LoaderWhite from '@/components/loaders/LoaderWhite'
import { HandHelping } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import React, { Suspense, useContext, useEffect, useRef, useState } from 'react'


export default function Main() {
    return (
      <Suspense fallback={<LoaderWhite/>}>
        <SupportPage/>
      </Suspense>
    )
  }

function SupportPage() {
    const scrollableRef = useRef<any>(null)
    const { sendMessageOperator, sendMessageAdmin, messages } = useContext(SocketContext)
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
        <div className='w-full'
            style={{
                height: '100%',
                position: 'relative'
            }}
        >
            <section
                ref={scrollableRef}
                style={{
                }}
            >
                {
                    messages.length > 0
                        ?
                        messages
                            .filter((message: any) => {
                                if (!message.gateId) return message
                                if (!gateId) return message

                                return message.gateId == gateId

                            })
                            .map((message: any) => {
                                return (
                                    <div
                                        key={message.content}
                                        style={{
                                            width: '100%',
                                            display: 'flex',
                                            justifyContent: role === message.role ? 'flex-end' : 'flex-start',

                                        }}
                                    >
                                        {/* Row container */}
                                        {/* Message bubble */}
                                        <div
                                            style={{
                                                padding: "20px",
                                                background: 'var(--steam-color)',
                                                borderRadius: role === message.role ? '20px 20px 0 20px' : '20px 20px 20px 0px',
                                                width: '100%',
                                                maxWidth: '300px',
                                                marginBottom: '10px',

                                            }}
                                        >
                                            {message.content}
                                        </div>
                                    </div>
                                )
                            })
                        :
                        <div
                            style={{
                                height: '100%',
                                width: "100%",
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexDirection: 'column'
                            }}
                        >
                            <img
                                src="/icons/support.png"
                                style={{
                                    width: '150px',
                                    opacity: 0.5

                                }}
                            />

                            <p
                                style={{
                                    opacity: 0.5
                                }}
                            >
                                Enviar un mensaje para empezar el chat con el soporte
                            </p>
                        </div>
                }
            </section>



            <InputAnimated
                onSend={(text) => {
                    handleSendMessage(text)
                }}
            />

        </div>
    )
}

