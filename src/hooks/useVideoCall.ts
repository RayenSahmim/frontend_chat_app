import { useState, useRef, useCallback, useEffect } from 'react';
import { useSocket } from '../Providers/SocketContext';

export const useVideoCall = (roomId: string) => {
  const { socket } = useSocket();
  const [isCalling, setIsCalling] = useState(false);
  const [isRinging, setIsRinging] = useState(false);
  const [callerName, setCallerName] = useState('');
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [callEnded, setCallEnded] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [userAudioStatuses, setUserAudioStatuses] = useState<Record<string, boolean>>({});
  const [userVideoStatuses, setUserVideoStatuses] = useState<Record<string, boolean>>({});
  const handleIceCandidate = async (candidate: RTCIceCandidate) => {
    console.log("Received ICE candidate:", candidate);
    await peerConnection.current?.addIceCandidate(
      new RTCIceCandidate(candidate)
    );
  };
  const localStream = useRef<MediaStream | null>(null);
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  
  const createPeerConnection = useCallback(() => {
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'turn:your.turn.server.com', username: 'user', credential: 'pass' }
      ]
    });

    pc.onicecandidate = (event) => {
      if (event.candidate && socket) {
        socket.emit('iceCandidate', { roomId, candidate: event.candidate });
      }
    };

    pc.ontrack = (event) => {
      console.log('Received track event:', event);
      if (event.streams?.[0]) {
          const receivedStream = event.streams[0];
          console.log('Received stream tracks:', receivedStream.getTracks());
          
          // Ensure the stream is set asynchronously
          setTimeout(() => {
              setRemoteStream(receivedStream);
          }, 0);
      }
  };

    return pc;
  }, [roomId, socket]);

  useEffect(() => {
    if (!socket) return;

    socket.on('ringing', ({ caller }: { caller: string }) => {
      setCallerName(caller);
      setIsRinging(true);
    });

    socket.on('receiveCall', async ({ offer, caller }) => {
      setCallerName(caller);
      setIsRinging(true);
      peerConnection.current = createPeerConnection();
      await peerConnection.current?.setRemoteDescription(new RTCSessionDescription(offer));
    });

    socket.on('callAnswered', async ({ answer }) => {
      await peerConnection.current?.setRemoteDescription(new RTCSessionDescription(answer));
    });

    socket.on('iceCandidate', handleIceCandidate);
    

    socket.on('callEnded', handleRemoteCallEnded);

    socket.on('audioMuted', ({ user, isMuted }) => {
      setUserAudioStatuses(prev => ({ ...prev, [user]: isMuted }));
    });

    socket.on('videoMuted', ({ user, isMuted }) => {
      setUserVideoStatuses(prev => ({ ...prev, [user]: isMuted }));
    });

    return () => {
      socket.off('ringing');
      socket.off('receiveCall');
      socket.off('callAnswered');
      socket.off('iceCandidate');
      socket.off('callEnded');
      socket.off('audioMuted');
      socket.off('videoMuted');
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, createPeerConnection, isCalling, isRinging]);


  const setupLocalStream = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      localStream.current = stream;
      
      // Modify existing peer connection or create if not exists
      if (!peerConnection.current || peerConnection.current.signalingState === 'closed') {
        peerConnection.current = createPeerConnection();
      }
  

      // Add tracks to peer connection
      stream.getTracks().forEach((track) => 
        peerConnection.current?.addTrack(track, stream)
      );

      return stream;
    } catch (error) {
      console.error("Error accessing media devices:", error);
      return null;
    }
  }, [createPeerConnection]);

  

  const startCall = async () => {
    try {
      // Setup local stream first
      const stream = await setupLocalStream();
      if (!stream) {
        console.error("Failed to get local stream");
        return;
      }

      // Create offer
      const offer = await peerConnection.current?.createOffer();
      await peerConnection.current?.setLocalDescription(offer);
      
      // Emit call to other user
      socket?.emit('callUser', { roomId, offer });
      setIsCalling(true);
    } catch (error) {
      console.error("Error starting call:", error);
    }
  };


  const acceptCall = async () => {
    try {
      // Setup local stream first
      const stream = await setupLocalStream();
      if (!stream) {
        console.error("Failed to get local stream");
        return;
      }

      setIsRinging(false);
      setIsCalling(true);

      // Create answer
      const answer = await peerConnection.current?.createAnswer();
      await peerConnection.current?.setLocalDescription(answer!);
      
      // Emit answer to other user
      socket?.emit('answerCall', { roomId, answer });
    } catch (error) {
      console.error("Error accepting call:", error);
    }
  };

  const declineCall = () => {
    setIsRinging(false);
    socket?.emit('declineCall', { roomId });
    endCall();
  };

  const endCall = () => {
    if (!isCalling || callEnded) return;

    setIsCalling(false);
    setCallEnded(true);

    peerConnection.current?.close();
    cleanupMedia();

    socket?.emit('endCall', { roomId });

    setTimeout(() => {
      setIsCalling(false);
      setCallEnded(false);
      setRemoteStream(null);
    }, 0);
  };

  const handleRemoteCallEnded = () => {
    setIsCalling(false);
    setCallEnded(true);
    cleanupMedia();
    setTimeout(() => {
      setIsCalling(false);
      setCallEnded(false);
      setRemoteStream(null);
    }, 0);
  };

  const cleanupMedia = () => {
    if (peerConnection.current) {
      peerConnection.current.getSenders().forEach(sender => {
        sender.track?.stop();
      });
      peerConnection.current.close();
    }

    localStream.current?.getTracks().forEach(track => track.stop());
    localStream.current = null;
    setRemoteStream(null);
  };

  const handleMuteAudio = useCallback((userId: string) => {
    const newAudioMutedState = !isAudioMuted;
    setIsAudioMuted(newAudioMutedState);

    localStream.current?.getAudioTracks().forEach(track => {
      track.enabled = !newAudioMutedState;
    });

    socket?.emit('muteAudio', { roomId, isMuted: newAudioMutedState });
    setUserAudioStatuses(prev => ({ ...prev, [userId]: newAudioMutedState }));
  }, [isAudioMuted, roomId, socket]);

  const handleMuteVideo = useCallback((userId: string) => {
    const newVideoMutedState = !isVideoMuted;
    setIsVideoMuted(newVideoMutedState);

    localStream.current?.getVideoTracks().forEach(track => {
      track.enabled = !newVideoMutedState;
    });

    socket?.emit('muteVideo', { roomId, isMuted: newVideoMutedState });
    setUserVideoStatuses(prev => ({ ...prev, [userId]: newVideoMutedState }));
  }, [isVideoMuted, roomId, socket]);

  return {
    isCalling,
    isRinging,
    callerName,
    remoteStream,
    localStream: localStream.current,
    isAudioMuted,
    isVideoMuted,
    userAudioStatuses,
    userVideoStatuses,
    startCall,
    acceptCall,
    declineCall,
    endCall,
    handleMuteAudio,
    handleMuteVideo
  };
};