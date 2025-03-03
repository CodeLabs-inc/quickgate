import { useEffect, useRef, useState } from 'react';
import Peer from 'peerjs';

const VideoChat = () => {
  const [peerId, setPeerId] = useState<string>('');
  const [remotePeerId, setRemotePeerId] = useState<string>('');
  const [peer, setPeer] = useState<Peer | null>(null);
  const myVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
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

    newPeer.on('open', (id: string) => {
      setPeerId(id);
    });

    newPeer.on('call', (call: any) => {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          if (myVideoRef.current) {
            myVideoRef.current.srcObject = stream;
          }
          call.answer(stream);
          call.on('stream', (remoteStream: MediaStream) => {
            if (remoteVideoRef.current) {
              remoteVideoRef.current.srcObject = remoteStream;
            }
          });
        });
    });

    setPeer(newPeer);

    // Cleanup on component unmount
    return () => {
      newPeer.destroy();
    };
  }, []);

  const callPeer = () => {
    if (!peer || !remotePeerId) return;

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        if (myVideoRef.current) {
          myVideoRef.current.srcObject = stream;
        }
        const call = peer.call(remotePeerId, stream);
        call.on('stream', (remoteStream: MediaStream) => {
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = remoteStream;
          }
        });
      });
  };

  return (
    <div>
      <h3>My Peer ID: {peerId}</h3>
      <input
        type="text"
        value={remotePeerId}
        onChange={(e) => setRemotePeerId(e.target.value)}
        placeholder="Enter remote peer ID"
      />
      <button onClick={callPeer}>Call</button>
      <video ref={myVideoRef} autoPlay playsInline />
      <video ref={remoteVideoRef} autoPlay playsInline />
    </div>
  );
};

export default VideoChat;
