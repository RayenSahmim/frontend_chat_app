import { useState, useEffect, useRef, useCallback } from "react";
import io, { Socket } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import IncomingCallModal from "../components/IncomingCallModal";
import useAuthenticatedUser from "../hooks/useAuthenticatedUser";
import useFriendData from "../hooks/useFriendData";
import {
  Mic,
  MicOff,
  MoreVertical,
  Phone,
  PhoneOff,
  UserCircle2,
  Video,
  VideoOff,
} from "lucide-react";
import VideosComponent from "../components/VideosComponets";
import { MessageList } from "../components/MessageList";
import { ChatInput } from "../components/ChatInput";
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
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [userAudioStatuses, setUserAudioStatuses] = useState<
    Record<string, boolean>
  >({});
  const [userVideoStatuses, setUserVideoStatuses] = useState<
    Record<string, boolean>
  >({});

  const [loading, setLoading] = useState(true);
  const [isCalling, setIsCalling] = useState(false);
  const [isRinging, setIsRinging] = useState(false);
  const [callerName, setCallerName] = useState("");
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [callEnded, setCallEnded] = useState(false);
  const localStream = useRef<MediaStream | null>(null);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const [userId, setUserId] = useState<string>("");
  const navigate = useNavigate();

  const {
    authenticatedUser,
    loading: userLoading,
    error,
  } = useAuthenticatedUser(); // Use the custom hook
  useEffect(() => {
    if (userLoading) return; // Wait until the user is loaded
    if (error) {
      console.error("Error loading authenticated user:", error);
      return;
    }
    if (!authenticatedUser) {
      navigate("/login");
      return;
    }
    const initSocketConnection = () => {
      setupSocket();
      setUsername(authenticatedUser.name);
      setUserId(authenticatedUser.id);
    };
    initSocketConnection();
    return () => {
      socket.disconnect();
      cleanupMedia();
    };
  }, [authenticatedUser, userLoading, error, roomId, navigate]);

  const setupSocket = useCallback(() => {
    socket = io("http://localhost:5000", { withCredentials: true });
    socket.emit("joinRoom", { roomId });

    socket.on("connect", () => console.log("Socket connected"));
    socket.on("previousMessages", (msgs: ChatMessage[]) => {
      setMessages(msgs);
      setLoading(false);
    });
    socket.on("message", (data: ChatMessage) =>
      setMessages((prev) => [...prev, data])
    );
    socket.on("typing", handleTypingStatus);
    socket.on("ringing", handleIncomingCallSignal);
    socket.on("receiveCall", (data) => handleIncomingCall(data));
    socket.on("callAnswered", handleAnswerReceived);
    socket.on("iceCandidate", handleIceCandidate);
    socket.on("callEnded", handleRemoteCallEnded);
    socket.on("audioMuted", ({ user, isMuted }) => {
      setUserAudioStatuses((prevStatuses) => ({
        ...prevStatuses,
        [user]: isMuted,
      }));
    });

    socket.on("videoMuted", ({ user, isMuted }) => {
      setUserVideoStatuses((prevStatuses) => ({
        ...prevStatuses,
        [user]: isMuted,
      }));
    });
    return () => {
      socket.off("audioMuted");
      socket.off("videoMuted");
    };
  }, [roomId]);

  useEffect(() => {
    if (remoteStream && remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStream;
      console.log("Remote stream set to remote video element");
    } else {
      console.error("Remote video ref is null or no stream available");
    }
  }, [remoteStream, isCalling]);

  useEffect(() => {
    if (isCalling) {
      console.log("Calling setupLocalStream");
      setupLocalStream();
    }
  }, [isCalling]);

  const handleMuteAudio = () => {
    const newAudioMutedState = !isAudioMuted;
    setIsAudioMuted(newAudioMutedState);

    localStream.current?.getAudioTracks().forEach((track) => {
      track.enabled = !newAudioMutedState;
    });

    // Emit new audio mute status
    socket.emit("muteAudio", { roomId, isMuted: newAudioMutedState });
    setUserAudioStatuses((prevStatuses) => ({
      ...prevStatuses,
      [userId]: newAudioMutedState,
    }));
  };
  const handleMuteVideo = () => {
    const newVideoMutedState = !isVideoMuted;
    setIsVideoMuted(newVideoMutedState);

    localStream.current?.getVideoTracks().forEach((track) => {
      track.enabled = !newVideoMutedState;
    });

    // Emit new video mute status
    socket.emit("muteVideo", { roomId, isMuted: newVideoMutedState });
    setUserVideoStatuses((prevStatuses) => ({
      ...prevStatuses,
      [userId]: newVideoMutedState,
    }));
  };

  const handleTypingStatus = (data: string) => {
    setTyping(data);
    setTimeout(() => setTyping(""), 2000);
  };

  const handleIncomingCallSignal = ({ caller }: { caller: string }) => {
    setCallerName(caller);
    setIsRinging(true);
  };

  const handleAnswerReceived = async ({
    answer,
  }: {
    answer: RTCSessionDescription;
  }) => {
    console.log("Received answer:", answer);
    await peerConnection.current?.setRemoteDescription(
      new RTCSessionDescription(answer)
    );
    console.log("Remote description set on answer received");
  };

  const handleIncomingCall = async ({
    offer,
    caller,
  }: {
    offer: RTCSessionDescription;
    caller: string;
  }) => {
    console.log("Received call offer from:", caller);
    setCallerName(caller);
    setIsRinging(true);
    peerConnection.current = createPeerConnection();
    await peerConnection.current?.setRemoteDescription(
      new RTCSessionDescription(offer)
    );
    console.log("Remote description set on incoming call");
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

    stream
      .getTracks()
      .forEach((track) => peerConnection.current?.addTrack(track, stream));

    const answer = await peerConnection.current?.createAnswer();
    await peerConnection.current?.setLocalDescription(answer!);
    socket.emit("answerCall", { roomId, answer });
  };

  const declineCall = () => {
    setIsRinging(false);
    socket.emit("declineCall", { roomId });
    endCall();
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

    stream
      .getTracks()
      .forEach((track) => peerConnection.current?.addTrack(track, stream));

    const offer = await peerConnection.current.createOffer();
    await peerConnection.current.setLocalDescription(offer);
    socket.emit("callUser", { roomId, offer });
    setIsCalling(true);
  };

  const setupLocalStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      localStream.current = stream;

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
        console.log("Local stream set to local video element");
      } else {
        console.error("localVideoRef.current is null");
      }

      stream
        .getTracks()
        .forEach((track) => peerConnection.current?.addTrack(track, stream));
    } catch (error) {
      console.error("Error accessing media devices:", error);
    }
  };

  const handleIceCandidate = async (candidate: RTCIceCandidate) => {
    console.log("Received ICE candidate:", candidate);
    await peerConnection.current?.addIceCandidate(
      new RTCIceCandidate(candidate)
    );
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
        console.log("ICE candidate sent:", event.candidate);
      }
    };

    pc.ontrack = (event) => {
      console.log("Received remote track:", event);
      if (event.streams && event.streams[0]) {
        const receivedStream = event.streams[0];
        setRemoteStream(receivedStream); // Setting the remote stream
      } else {
        console.error("No streams found in ontrack event");
      }
    };

    return pc;
  };

  const endCall = () => {
    if (!isCalling || callEnded) return;

    console.log("Ending call");
    setIsCalling(false);
    setCallEnded(true);

    // Close the peer connection and stop the local stream tracks
    peerConnection.current?.close();
    cleanupMedia();

    // Emit the event to notify the other peer
    socket.emit("endCall", { roomId });

    // Reset the call state after cleanup
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
    // Clean up peer connection
    if (peerConnection.current) {
      peerConnection.current.getSenders().forEach((sender) => {
        sender.track?.stop(); // Stop the track if it's active
      });
      peerConnection.current.close(); // Close the connection
    }

    // Stop local stream tracks
    localStream.current?.getTracks().forEach((track) => track.stop()); // Stop video and audio tracks

    // Reset the local stream and remote stream
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

  const {
    friend,
    loading: friendLoading,
    error: friendError,
  } = useFriendData(roomId, userId);
  if (userLoading || friendLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (error || friendError) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <p className="text-red-500">Error: {error || friendError}</p>
      </div>
    );
  }
  return (
    <div className="flex flex-col h-screen bg-gray-50 w-full">
      <div className="flex-1 flex flex-col   w-full ">
        <div className="bg-white rounded-xl shadow-lg flex flex-col h-full overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {friend?.ImageURL ? (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-lg font-semibold text-white">
                      {friend?.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <UserCircle2 className="w-7 h-7 text-gray-400" />
                  </div>
                )}
                <div className="flex flex-col">
                  <h2 className=" font-semibold ">{friend?.name}</h2>
                  <p className="text-sm text-gray-500">{"Online"}</p>
                </div>
              </div>

              {/* Call Controls */}
              <div className="flex items-center space-x-2">
                {isCalling ? (
                  <>
                    <button
                      onClick={handleMuteAudio}
                      className="p-2 text-gray-500 hover:text-gray-600 rounded-full hover:bg-gray-100"
                    >
                      {isAudioMuted ? (
                        <MicOff className="w-5 h-5" />
                      ) : (
                        <Mic className="w-5 h-5" />
                      )}
                    </button>
                    <button
                      onClick={handleMuteVideo}
                      className="p-2 text-gray-500 hover:text-gray-600 rounded-full hover:bg-gray-100"
                    >
                      {isVideoMuted ? (
                        <VideoOff className="w-5 h-5" />
                      ) : (
                        <Video className="w-5 h-5" />
                      )}
                    </button>
                    <button
                      onClick={endCall}
                      className="p-2 text-gray-500 hover:text-gray-600 rounded-full hover:bg-gray-100"
                    >
                      <PhoneOff className="w-5 h-5" />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={startCall}
                    className="p-2 text-gray-500 hover:text-gray-600 rounded-full hover:bg-gray-100"
                  >
                    <Phone className="w-5 h-5" />
                  </button>
                )}
                <button className="p-2 text-gray-500 hover:text-gray-600 rounded-full hover:bg-gray-100">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col min-h-0">
            {isCalling ? (
              <VideosComponent
              username={username}
                userId={userId}
                localVideoRef={localVideoRef}
                remoteVideoRef={remoteVideoRef}
                isAudioMuted={isAudioMuted}
                isVideoMuted={isVideoMuted}
                userAudioStatuses={userAudioStatuses}
                userVideoStatuses={userVideoStatuses}
                localStream={localStream.current}
                remoteStream={remoteStream}
              />
            ) : (
              <>
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
              </>
            )}
          </div>
        </div>
      </div>

      {/* Incoming Call Modal */}
      <IncomingCallModal
        visible={isRinging}
        callerName={callerName}
        onAccept={acceptCall}
        onDecline={declineCall}
      />
    </div>
  );
};

export default ChatApp;
