import { useState, useRef, useCallback, useEffect } from 'react';
import { useSocket } from '../Providers/SocketContext';
import { useRoom } from '../Providers/RoomProvider';

export const useVideoCall = () => {
  const { socket } = useSocket();
  const { roomId  } = useRoom();
  const [isCalling, setIsCalling] = useState(false);
  const [isRinging, setIsRinging] = useState(false);
  const [callerName, setCallerName] = useState('');
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [callEnded, setCallEnded] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [userAudioStatuses, setUserAudioStatuses] = useState<Record<string, boolean>>({});
  const [userVideoStatuses, setUserVideoStatuses] = useState<Record<string, boolean>>({});
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [localDisplayStream, setLocalDisplayStream] = useState<MediaStream | null>(null);

  const screenStream = useRef<MediaStream | null>(null);
  const localStream = useRef<MediaStream | null>(null);
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const handleIceCandidate = async (candidate: RTCIceCandidate) => {
    console.log("Received ICE candidate:", candidate);
    try {
      await peerConnection.current?.addIceCandidate(new RTCIceCandidate(candidate));
    } catch (error) {
      console.error("Error adding ICE candidate:", error);
    }
  };
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

    pc.onconnectionstatechange = () => {
      if (pc.connectionState === 'failed') {
        // Handle connection failure
        endCall();
      }
    };

    pc.oniceconnectionstatechange = () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const quality = pc.getStats().then(stats => {
        stats.forEach(report => {
          if (report.type === 'candidate-pair' && report.state === 'succeeded') {
            // Monitor connection quality
            console.log('Current RTT:', report.currentRoundTripTime);
            console.log('Available bandwidth:', report.availableOutgoingBitrate);
          }
        });
      });
    };

    pc.ontrack = (event) => {
      console.log('Received track event:', event);
      if (event.streams?.[0]) {
          const receivedStream = event.streams[0];
          console.log('Received stream tracks:', receivedStream.getTracks());
          
          // Ensure the stream is set asynchronously
          queueMicrotask(() => {
              setRemoteStream(receivedStream);
          });
      }
  };

    return pc;
  }, [roomId, socket]);

  useEffect(() => {
    if (!socket) return;

    socket.on('ringing', ({ caller  }: { caller: string  }) => {
      setCallerName(caller);
      setIsRinging(true);
    });


    socket.on('receiveCall', async ({ offer, caller   }) => {
      setCallerName(caller);
      setIsRinging(true);
      setTimeout(() => {
       
      }, 0);
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
    socket.on('screenShare', ({ user, isSharing }) => {
      // Handle remote user's screen sharing status
      console.log(`User ${user} ${isSharing ? 'started' : 'stopped'} screen sharing`);
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


  const startScreenShare = async () => {
    try {
      // Get screen sharing stream
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true // For system audio if supported
      });

      // Store screen stream reference
      screenStream.current = stream;
      setIsScreenSharing(true);

      setLocalDisplayStream(stream);

      // Handle stream end (user stops sharing)
      stream.getVideoTracks()[0].addEventListener('ended', () => {
        stopScreenShare();
      });

      // Remove existing video track if any
      const senders = peerConnection.current?.getSenders() || [];
      const videoSender = senders.find(sender => 
        sender.track?.kind === 'video'
      );

      if (videoSender) {
        // Replace existing video track with screen share track
        await videoSender.replaceTrack(stream.getVideoTracks()[0]);
      } else {
        // Add screen share track if no video track exists
        stream.getTracks().forEach(track => 
          peerConnection.current?.addTrack(track, stream)
        );
      }

      // Notify other participants
      socket?.emit('screenShare', { roomId, isSharing: true });

    } catch (error) {
      console.error('Error starting screen share:', error);
      setIsScreenSharing(false);
      setLocalDisplayStream(null);

    }
  };


  const stopScreenShare = async () => {
    if (!screenStream.current) return;


    // Stop all tracks in screen share stream
    screenStream.current.getTracks().forEach(track => track.stop());

    setLocalDisplayStream(null);

    
    // If we have a local video stream, restore it
    if (localStream.current) {
      const senders = peerConnection.current?.getSenders() || [];
      const videoSender = senders.find(sender => 
        sender.track?.kind === 'video'
      );

      if (videoSender && localStream.current.getVideoTracks()[0]) {
        await videoSender.replaceTrack(localStream.current.getVideoTracks()[0]);
      }
    }

    screenStream.current = null;
    setIsScreenSharing(false);

    // Notify other participants
    socket?.emit('screenShare', { roomId, isSharing: false });
  };


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
    peerConnection.current?.close();
    cleanupMedia();

    socket?.emit('endCall', { roomId });

    setTimeout(() => {
      setIsCalling(false);
      setCallEnded(false);
      setRemoteStream(null);
    }, 0);
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

    if (screenStream.current) {
      screenStream.current.getTracks().forEach(track => track.stop());
      screenStream.current = null;
    }
    setIsScreenSharing(false);
    setLocalDisplayStream(null);


  };

  const handleMuteAudio = useCallback(() => {
    const newAudioMutedState = !isAudioMuted;
    setIsAudioMuted(newAudioMutedState);

    localStream.current?.getAudioTracks().forEach(track => {
      track.enabled = !newAudioMutedState;
    });

    socket?.emit('muteAudio', { roomId, isMuted: newAudioMutedState });
  }, [isAudioMuted, roomId, socket]);

  const handleMuteVideo = useCallback(() => {
    const newVideoMutedState = !isVideoMuted;
    setIsVideoMuted(newVideoMutedState);

    localStream.current?.getVideoTracks().forEach(track => {
      track.enabled = !newVideoMutedState;
    });

    socket?.emit('muteVideo', { roomId, isMuted: newVideoMutedState });
  }, [isVideoMuted, roomId, socket]);

  return {
    isCalling,
    isScreenSharing,
    isRinging,
    callerName,
    remoteStream,
    localDisplayStream,
    localStream: localStream.current,
    isAudioMuted,
    isVideoMuted,
    userAudioStatuses,
    userVideoStatuses,
    startScreenShare,
    stopScreenShare,
    startCall,
    acceptCall,
    declineCall,
    endCall,
    handleMuteAudio,
    handleMuteVideo
  };
};