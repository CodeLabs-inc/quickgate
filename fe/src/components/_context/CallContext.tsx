'use client'


import { createContext, useContext, useEffect, useRef, useState } from 'react';
import Peer from 'peerjs';
import { SocketContext } from './SocketContext';
import Modal from '../_globals/modal';
import Button from '../buttons/Button';
import styles from './page.module.css'
import Page from '../_globals/page';
import Header from '../_globals/header';
import { PhoneMissed } from 'lucide-react';
import Title from '../titles/Title';
import { getCallersList } from '@/services/api';
import PageSecondary from '../_globals/pageSecondary';

export const CallContext = createContext({
    peerId: '',
    remotePeerId: '',
    myVideoRef: null as React.RefObject<HTMLVideoElement> | null,
    remoteVideoRef: null as React.RefObject<HTMLVideoElement> | null,
    setRemotePeerId: (peerId: string) => { },
    callPeer: (remotePeerId: string) => { },
    isReceivingCall: false,
    setIsReceivingCall: (value: boolean) => { }
});

interface CallProviderProps {
    children: React.ReactNode;
}


export const CallProvider = ({ children }: CallProviderProps) => {
    const { socket } = useContext(SocketContext)


    const [peerId, setPeerId] = useState('');
    const [remotePeerId, setRemotePeerId] = useState('');
    const [peer, setPeer] = useState<any>(null);
    const myVideoRef = useRef<any>(null);
    const remoteVideoRef = useRef<any>(null);

    const [isReceivingCall, setIsReceivingCall] = useState(false)
    const [isOnCall, setIsOnCall] = useState(false)
    const [call, setCall] = useState<any>(null)

    useEffect(() => {
        if (!socket) return

        const newPeer = new Peer({
            host: 'turn.quickgate.xyz',
            path: '/calls',
            secure: true,
            port: 443,
            config: {
                iceServers: [
                    { urls: 'stun:turn.quickgate.xyz:3478' },
                    {
                        urls: 'turn:turn.quickgate.xyz:3478',
                        username: 'webrtcuserquickgate',
                        credential: 'Alpine',
                    },
                ],
            },
        });

        newPeer.on('open', (id) => {
            //Send currentUser peerId
            socket?.emit('call-joined', {
                peerId: id
            })

            setPeerId(id)
        });

        newPeer.on('call', (call) => {
            handleFetchAllCallerInfo(call)
            setCall(call)
        });

        newPeer.on('close', () => {
            closeCurrentCall()
        })

        setPeer(newPeer);

        return () => newPeer.destroy();
    }, [socket]);

    const callPeer = (remotePeerId: string) => {
        setIsOnCall(true)
        if (!peer || !remotePeerId) return;
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then((stream) => {
                if (myVideoRef.current) myVideoRef.current.srcObject = stream;
                const call = peer.call(remotePeerId, stream);
                call.on('stream', (remoteStream: any) => {
                    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = remoteStream;
                });
            });
    };
    const acceptIncomingCall = () => {
        setIsOnCall(true)
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then((stream) => {
                if (myVideoRef.current) myVideoRef.current.srcObject = stream;
                call.answer(stream);
                call.on('stream', (remoteStream: any) => {
                    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = remoteStream;
                });
            });
    }
    const closeCurrentCall = () => {
        // Close the PeerJS call
        if (call) {
            call.close();
        }

        // Stop all tracks on the local camera stream
        if (myVideoRef.current && myVideoRef.current.srcObject) {
            const stream = myVideoRef.current.srcObject;
            stream.getTracks().forEach((track: any) => track.stop());
            myVideoRef.current.srcObject = null;
        }

        // Optionally, stop the remote stream as well
        if (remoteVideoRef.current && remoteVideoRef.current.srcObject) {
            const stream = remoteVideoRef.current.srcObject;
            stream.getTracks().forEach((track: any) => track.stop());
            remoteVideoRef.current.srcObject = null;
        }

        setIsOnCall(false);
    };

    const [callerData, setCallerData] = useState<any>(null)
    const handleFetchAllCallerInfo = async (call: any) => {
        const fetch = await getCallersList()

        if (fetch.success) {

            const { data } = fetch;
            const callerData = data.find((caller: any) => caller.peerId === call.peer)

            setCallerData(callerData)
            setIsReceivingCall(true)
        }
    }



    return (
        <CallContext.Provider value={{ peerId, remotePeerId, setRemotePeerId, callPeer, myVideoRef, remoteVideoRef, isReceivingCall, setIsReceivingCall }}>
            {children}


            {/* Modal for receiving the call */}
            {isReceivingCall && (
                <Modal
                    isOpen={isReceivingCall}
                    onClose={() => {setIsReceivingCall(false) }}
                >
                    <audio src="/audio/ringtone.mp3" autoPlay loop />

                    <p className={styles.callTitle}>
                        {
                            callerData ?
                                callerData.user.user.name : 'noname'
                        }
                    </p>
                    <img
                        src={callerData && callerData.user.user.profile_picture !== '' ? callerData.user.user.profile_picture : '/fallbacks/profile_picture.jpg'}
                        alt=""
                        className={styles.pictureCaller}
                    />



                    <div className='w-full flex flex-row gap-2 mt-4'>

                        <Button
                            text='Acceptar'
                            color='white'
                            backgroundColor='green'
                            onClick={() => {
                                acceptIncomingCall()
                                setIsReceivingCall(false)
                            }}
                        />
                        <Button
                            text='Rechazar'
                            color='white'
                            backgroundColor='tomato'
                            onClick={() => {
                                setIsReceivingCall(false)
                            }}
                        />
                    </div>
                </Modal>
            )}


            {
                    isOnCall && (
                    <div
                        style={{
                            height: '100vh',
                            width: '100vw',
                            position: 'absolute',
                            top: '0',
                            left: '0'
                        }}
                    >
                        <div className={styles.main}>
                            <Header title={'Overview'} />
                            <PageSecondary
                                style={{
                                    height: '100%',
                                    
                                    paddingRight: '15px',
                                    background: 'none'
                                }}
                            >
                                <div className={styles.containerVideoFeed}>
                                    <video className={styles.videoFeedSmall} ref={myVideoRef} muted autoPlay playsInline />
                                    <video className={styles.videoFeedMain} ref={remoteVideoRef} autoPlay playsInline />
                                    <div className={styles.controls}>
                                        <button onClick={closeCurrentCall} className={styles.buttonControls}>
                                            <PhoneMissed width={20} style={{transform: 'translateY(1px) translateX(-1px)'}} />
                                        </button>
                                    </div>
                                </div>
                            </PageSecondary>
                        </div>
                    </div>

                )
            }
        </CallContext.Provider>
    );
};


