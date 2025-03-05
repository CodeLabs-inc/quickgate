import { AuthContext } from '@/components/_context/AuthContext'
import { SocketContext } from '@/components/_context/SocketContext'
import InputAnimated from '@/components/inputs/inputAnimated'
import LoaderWhite from '@/components/loaders/LoaderWhite'
import { HandHelping } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import React, { Suspense, useContext, useEffect, useRef, useState } from 'react'



export default function SupportPage() {
    const scrollableRef = useRef<any>(null)
    const { messages } = useContext(SocketContext)
    const { role } = useContext(AuthContext)
    const searchParams = useSearchParams()
    const gateId = searchParams.get('gateId')


    // Scroll to bottom with animation when messages change
    useEffect(() => {
        if (scrollableRef.current) {
            const element = scrollableRef.current;
            const targetScrollTop = element.scrollHeight;

            // Smooth scroll to the bottom
            element.scrollTo({
                top: targetScrollTop,
                behavior: 'smooth',  // Enables smooth scrolling
            });
        }
    }, [messages]);



    return (
        <>
            <section
                ref={scrollableRef}
                style={{
                    padding: '0 20px',
                    paddingTop: '91px',
                    paddingBottom: '150px',
                    overflowY: 'auto'
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
                                                padding: "10px",
                                                background: 'var(--steam-color)',
                                                borderRadius: role === message.role ? '20px 20px 0 20px' : '20px 20px 20px 0px',
                                                width: '100%',
                                                maxWidth: '300px',
                                                marginBottom: '10px',
                                                fontSize: '14px'
                                            }}
                                        >
                                            <p>
                                                {message.content}
                                            </p>
                                            <div className='w-full flex  justify-end text-[11px] text-[#ffffff80]'>
                                                <p>
                                                    {
                                                        new Date(message.date).toLocaleTimeString('en-US', {
                                                            hour: 'numeric',
                                                            minute: 'numeric',

                                                        })
                                                    }
                                                </p>
                                            </div>
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



        </>


    )
}

