import { Card } from "antd";
import { useState, useEffect, useRef, useCallback } from "react";
import io, { Socket } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import CallControls from "../components/CallControls";
import MessageList from "../components/MessageList";
import ChatInput from "../components/ChatInput";
import IncomingCallModal from "../components/IncomingCallModal";

let socket: Socket;

interface ChatMessage {
  user: string;
  message: string;
  timestamp: Date;
}


const ChatApp = ({ roomId }: { roomId: string }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [message, setMessage] = useState("");
  const [username, setUsername] = useState("");
  const [typing, setTyping] = useState("");
  const [loading, setLoading] = useState(true);
  const [isCalling, setIsCalling] = useState(false);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const localStream = useRef<MediaStream | null>(null);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const [callerName, setCallerName] = useState("");
  const [callEnded, setCallEnded] = useState(false);
  const [isRinging, setIsRinging] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const initSocketConnection = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/check-session", { credentials: "include" });
        const data = await res.json();
        if (data.user) {
          setUsername(data.user.name);
          setupSocket();
        } else {
          navigate("/login");
        }
      } catch (error) {
        console.error("Session check error:", error);
      }
    };
    
    initSocketConnection();

    return () => {
      socket.disconnect();
      cleanupMedia();
    };
  }, [roomId, navigate]);

  const setupSocket = useCallback(() => {
    socket = io("http://localhost:5000", { withCredentials: true });
    socket.emit("joinRoom", { roomId });

    socket.on("connect", () => console.log("Socket connected"));
    socket.on("previousMessages", (msgs: ChatMessage[]) => {
      setMessages(msgs);
      setLoading(false);
    });
    socket.on("message", (data: ChatMessage) => {
      setMessages(prev => [...prev, data]);
    });
    socket.on("typing", (data: string) => {
      setTyping(data);
      setTimeout(() => setTyping(""), 2000);
    });
    socket.on("ringing", ({ caller }) => {
      setCallerName(caller);
      setIsRinging(true);
    });
    socket.on("receiveCall", handleIncomingCall);
    socket.on("callAnswered", handleAnswerReceived);
    socket.on("iceCandidate", handleIceCandidate);
    socket.on("callEnded", handleRemoteCallEnded);
  }, [roomId]);

  const handleIncomingCall = ({
    offer,
    caller,
  }: {
    offer: RTCSessionDescriptionInit;
    caller: string;
  }) => {
    setCallerName(caller);
    setIsRinging(true);
    peerConnection.current = createPeerConnection();
    peerConnection.current?.setRemoteDescription(new RTCSessionDescription(offer));
  };

  const acceptCall = async () => {
    setIsRinging(false);
    setIsCalling(true);
    
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    localStream.current = stream;

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = stream;
    }

    stream.getTracks().forEach((track) => peerConnection.current?.addTrack(track, stream));

    const answer = await peerConnection.current?.createAnswer();
    await peerConnection.current?.setLocalDescription(answer!);
    socket.emit("answerCall", { roomId, answer });
  };

  const declineCall = () => {
    setIsRinging(false);
    socket.emit("declineCall", { roomId });
    endCall();
  };

  const handleAnswerReceived = async ({
    answer,
  }: {
    answer: RTCSessionDescriptionInit;
  }) => {
    await peerConnection.current?.setRemoteDescription(new RTCSessionDescription(answer));
  };

  const handleIceCandidate = async (candidate: RTCIceCandidate) => {
    await peerConnection.current?.addIceCandidate(new RTCIceCandidate(candidate));
  };

  const startCall = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    localStream.current = stream;
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = stream;
    }
    peerConnection.current = createPeerConnection();
    stream.getTracks().forEach((track) => peerConnection.current?.addTrack(track, stream));
    const offer = await peerConnection.current.createOffer();
    await peerConnection.current.setLocalDescription(offer);
    socket.emit("callUser", { roomId, offer });
    setIsCalling(true);
  };

  const createPeerConnection = () => {
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        {
          urls: "turn:your.turn.server.com",
          username: "user",
          credential: "pass",
        },
      ],
    });

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("iceCandidate", { roomId, candidate: event.candidate });
      }
    };

    pc.ontrack = (event) => {
      if (event.streams && event.streams[0]) {
        setRemoteStream(event.streams[0]);
      }
    };

    return pc;
  };

  const endCall = () => {
    if (!isCalling || callEnded) return;

    console.log("Ending call");
    setIsCalling(false);
    setCallEnded(true);

    peerConnection.current?.close();
    cleanupMedia();

    socket.emit("endCall", { roomId });
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
    peerConnection.current = null;
    localStream.current?.getTracks().forEach((track) => track.stop());
    localStream.current = null;
    setRemoteStream(null);
  };

  const handleMessageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      socket.emit("message", { roomId, msg: message });
      setMessages((prev) => [
        ...prev,
        { user: username, message, timestamp: new Date() },
      ]);
      setMessage("");
    }
  };

  const handleTyping = () => {
    socket.emit("typing", { roomId });
  };

  const logout = async () => {
    const response = await fetch("http://localhost:5000/api/logout", {
      method: "POST",
      credentials: "include",
    });
    if (response.ok) navigate("/login");
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 py-5 pr-5 ">
      <Card className="w-full h-full shadow-lg flex flex-col space-y-4 overflow-y-auto relative">
        <div className="mb-4">
          <CallControls
            isCalling={isCalling}
            startCall={startCall}
            endCall={endCall}
            callerName={callerName}
            remoteStream={remoteStream}
            localVideoRef={localVideoRef}
            logout={logout}
          />
        </div>
        <IncomingCallModal
          visible={isRinging}
          callerName={callerName}
          onAccept={acceptCall}
          onDecline={declineCall}
        />
        <MessageList
          messages={messages}
          typing={typing}
          username={username}
          loading={loading}
        />
        <ChatInput
          message={message}
          setMessage={setMessage}
          handleMessageSubmit={handleMessageSubmit}
          handleTyping={handleTyping}
        />
      </Card>
    </div>
  );
};


export default ChatApp;
