import { Spin, Card, Input, Button } from "antd";
import React, { useState, useEffect, useRef } from "react";
import io, { Socket } from "socket.io-client";
import { PhoneFilled, PhoneOutlined, SendOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import CallModal from "../components/Callmodal";

let socket: Socket;

interface ChatMessage {
  user: string;
  message: string;
  timestamp: Date;
}

const ChatApp = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [message, setMessage] = useState("");
  const [username, setUsername] = useState("");
  const [typing, setTyping] = useState("");
  const [loading, setLoading] = useState(true);
  const [isCalling, setIsCalling] = useState(false);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const localStream = useRef<MediaStream | null>(null);
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const [callerName, setCallerName] = useState("");
  const [callEnded, setCallEnded] = useState(false);
  const navigate = useNavigate();
  const { roomId } = useParams<{ roomId: string }>();

  useEffect(() => {
    const initSocketConnection = async () => {
      try {
        console.log("Checking session...");
        const res = await fetch("http://localhost:5000/api/check-session", {
          credentials: "include",
        });
        const data = await res.json();

        if (data.user) {
          console.log("User found:", data.user.name);
          setUsername(data.user.name);
          setupSocket();
        } else {
          console.log("No user session found, navigating to login");
          navigate("/login");
        }
      } catch (error) {
        console.error("Session check error:", error);
      }
    };

    const setupSocket = () => {
      console.log("Setting up socket...");
      socket = io("http://localhost:5000", { withCredentials: true });
      socket.emit("joinRoom", { roomId });

      socket.on("connect", () => console.log("Socket connected"));
      socket.on("previousMessages", (msgs: ChatMessage[]) => {
        console.log("Loading previous messages:", msgs);
        setMessages(msgs);
        setLoading(false);
      });

      socket.on("message", (data: ChatMessage) => {
        console.log("New message received:", data);
        setMessages((prev) => [...prev, data]);
      });

      socket.on("typing", (data: string) => {
        console.log("User typing:", data);
        setTyping(data);
        setTimeout(() => setTyping(""), 2000);
      });
      socket.off("receiveCall");
      socket.off("callAnswered");
      socket.off("iceCandidate");
      socket.off("callEnded");

      socket.on("receiveCall", handleIncomingCall);
      socket.on("callAnswered", handleAnswerReceived);
      socket.on("iceCandidate", handleIceCandidate);
      socket.on("callEnded", handleRemoteCallEnded);
    };

    initSocketConnection();

    return () => {
      if (socket) socket.disconnect();
      cleanupMedia();
    };
  }, [roomId, navigate]);

  const handleIncomingCall = async ({
    offer,
    caller,
  }: {
    offer: RTCSessionDescriptionInit;
    caller: string;
  }) => {
    console.log("Incoming call offer received from:", caller);
    setCallerName(caller);
    setIsCalling(true);
    setCallEnded(false);
    
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    localStream.current = stream;

    peerConnection.current = createPeerConnection();
    stream.getTracks().forEach((track) => {
      console.log("Adding local track:", track);
      peerConnection.current?.addTrack(track, stream);
    });

    await peerConnection.current?.setRemoteDescription(
      new RTCSessionDescription(offer)
    );
    const answer = await peerConnection.current?.createAnswer();
    await peerConnection.current?.setLocalDescription(answer!);

    console.log("Sending answer to caller");
    socket.emit("answerCall", { roomId, answer });
  };

  const handleAnswerReceived = async ({
    answer,
  }: {
    answer: RTCSessionDescriptionInit;
  }) => {
    console.log("Answer received from callee");
    if (peerConnection.current?.signalingState === "have-local-offer") {
      await peerConnection.current.setRemoteDescription(
        new RTCSessionDescription(answer)
      );
      console.log("Remote description set for caller");
    }
  };

  const handleIceCandidate = async (candidate: RTCIceCandidate) => {
    try {
      console.log("Adding received ICE candidate:", candidate);
      await peerConnection.current?.addIceCandidate(
        new RTCIceCandidate(candidate)
      );
    } catch (error) {
      console.error("Error adding ICE candidate:", error);
    }
  };

  const startCall = async () => {
    try {
      const permissionStatus = await navigator.permissions.query({
        name: "microphone",
      });
      if (permissionStatus.state !== "granted") {
        console.log("Microphone permissions not granted.");
        return;
      }

      console.log("Starting call...");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      localStream.current = stream;
      console.log("Local audio tracks:", stream.getAudioTracks());

      peerConnection.current = createPeerConnection();
      stream.getTracks().forEach((track) =>
        peerConnection.current?.addTrack(track, stream)
      );

      const offer = await peerConnection.current.createOffer();
      await peerConnection.current.setLocalDescription(offer);
      console.log("Sending call offer to recipient");
      socket.emit("callUser", { roomId, offer });
      setIsCalling(true);
    } catch (error) {
      console.error("Error starting call:", error);
    }
  };

  const createPeerConnection = () => {
    console.log("Creating peer connection");
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "turn:your.turn.server.com", username: "user", credential: "pass" },
      ],
    });

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        console.log("Emitting ICE candidate:", event.candidate);
        socket.emit("iceCandidate", { roomId, candidate: event.candidate });
      }
    };
    pc.ontrack = (event) => {
      console.log("Received remote stream:", event.streams[0]);
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
    console.log("Remote party ended the call");
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
    console.log("Cleaning up media streams");
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
    console.log("User typing...");
    socket.emit("typing", { roomId });
  };

  const logout = async () => {
    try {
      console.log("Logging out");
      const response = await fetch("http://localhost:5000/api/logout", {
        method: "POST",
        credentials: "include",
      });
      if (response.ok) navigate("/login");
    } catch (err) {
      console.error("Error checking session:", err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-5">
      <Card className="w-full max-w-4xl shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6">Private Chat</h1>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 mb-4 rounded"
          onClick={logout}
        >
          Logout
        </button>
        <Button
          onClick={isCalling ? endCall : startCall}
          icon={isCalling ? <PhoneFilled /> : <PhoneOutlined />}
        >
          {isCalling ? "End Call" : "Call"}
        </Button>
        <CallModal
          visible={isCalling}
          onClose={endCall}
          callerName={callerName || "Unknown"}
          remoteStream={remoteStream}
        />

        <div className="chat-window bg-white p-4 overflow-y-auto rounded-md border border-gray-200 mb-4 h-[70vh] relative">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <Spin size="large" />
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`mb-2 ${msg.user === username ? "text-right" : "text-left"}`}
                >
                  <div
                    className={`inline-block p-2 rounded-lg max-w-[70%] break-words transition-all duration-300 ease-in-out ${
                      msg.user === username ? "bg-blue-600 text-white ml-auto" : "bg-gray-200 text-black"
                    }`}
                  >
                    <span className="font-semibold">{msg.user}: </span>
                    <span>{msg.message}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
          {typing && <p className="text-gray-400 italic">{typing}</p>}
        </div>
        <form onSubmit={handleMessageSubmit} className="flex">
          <Input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message here..."
            className="mr-2"
            onKeyUp={handleTyping}
          />
          <Button htmlType="submit" icon={<SendOutlined />} />
        </form>
      </Card>
    </div>
  );
};




export default ChatApp;
