import InputAnimated from '@/components/inputs/inputAnimated'
import { HandHelping } from 'lucide-react'
import React, { useState } from 'react'

export default function SupportPage() {

    const [messages, setMessages] = useState<any>([])


    return (
        <div className='h-full w-full'
            style={{
                position: 'relative'
            }}
        >
            <section
                style={{
                    height: '100%',
                    width: '100%',

                    paddingBottom: '200px'
                }}
            >
                {
                    messages.length > 0
                        ?
                        messages.map((message: string) => {
                            return (
                                <div
                                    style={{
                                        width: '100%',
                                        display: 'flex',
                                        justifyContent: 'flex-end',

                                    }}
                                >
                                    {/* Row container */}

                                    {/* Message bubble */}
                                    <div
                                        style={{
                                            padding: "20px",
                                            background: 'var(--steam-color)',
                                            borderRadius: '20px 20px 0 20px',
                                            width: '100%',
                                            maxWidth: '300px',
                                            marginBottom: '10px',

                                        }}
                                    >
                                        {message}
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


            <div
                style={{
                    height: '200px',
                    width: '100%',
                    position: 'absolute',
                    bottom: 0,
                    left: 0
                }}
            >
                <InputAnimated
                    onSend={(text) => {
                        setMessages([...messages, text])
                    }}
                />
            </div>
        </div>
    )
}

