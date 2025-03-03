import VideoCall from '@/components/calls/VIdeoCall'
import InputAnimated from '@/components/inputs/inputAnimated'
import { HandHelping } from 'lucide-react'
import React, { useState } from 'react'

export default function CallPage() {

    const [messages, setMessages] = useState<any>([])


    return (
        <div className='h-full w-full'
            style={{
                position: 'relative'
            }}
        >
           <VideoCall/>
        </div>
    )
}

