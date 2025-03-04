import VideoChat from '@/components/calls/PeerCall'
import VideoCall from '@/components/calls/VIdeoCall'
import InputAnimated from '@/components/inputs/inputAnimated'
import { HandHelping } from 'lucide-react'
import React, { useState } from 'react'

interface Props {
    peerId: string
}

export default function CallPage({peerId}: Props) {

    const [messages, setMessages] = useState<any>([])


    return (
        <div className='h-full w-full'
            style={{
                position: 'relative'
            }}
        >

            <VideoChat peerId_sent={peerId}/>
           
        </div>
    )
}

