import { createContext, useContext, ReactNode } from "react";
import { useVideoCall } from "../hooks/useVideoCall";
import IncomingCallModal from "../components/IncomingCallModal";

interface CallContextProps {
    isCalling: boolean;
    isRinging: boolean;
    isScreenSharing : boolean;
    callerName: string;
    remoteStream: MediaStream | null;
    localStream: MediaStream | null;
    isAudioMuted: boolean;
    isVideoMuted: boolean;
    userAudioStatuses: Record<string, boolean>;
    userVideoStatuses: Record<string, boolean>;
    localDisplayStream: MediaStream | null;
    startScreenShare : () => void;
    stopScreenShare : () => void;
    startCall: () => void;
    acceptCall: () => void;
    declineCall: () => void;
    endCall: () => void;
    handleMuteAudio: () => void;
    handleMuteVideo: () => void;
}

const CallContext = createContext<CallContextProps | undefined>(undefined);

export const CallProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  
  
  const {
    isCalling,
    isRinging,
    isScreenSharing,
    callerName,
    remoteStream,
    localStream,
    isAudioMuted,
    isVideoMuted,
    userAudioStatuses,
    userVideoStatuses,
    localDisplayStream,
    startScreenShare,
    stopScreenShare,
    startCall,
    acceptCall,
    declineCall,
    endCall,
    handleMuteAudio,
    handleMuteVideo,
  } = useVideoCall();


  

  return (
    <CallContext.Provider
      value={{
        isCalling,
        isRinging,
        isScreenSharing,
        callerName,
        remoteStream,
        localStream,
        isAudioMuted,
        isVideoMuted,
        userAudioStatuses,
        userVideoStatuses,
        localDisplayStream,
        startScreenShare,
        stopScreenShare,
        startCall,
        acceptCall,
        declineCall,
        endCall,
        handleMuteAudio,
        handleMuteVideo,
      }}
    >
            <IncomingCallModal
        visible={isRinging}
        callerName={callerName}
        onAccept={acceptCall}
        onDecline={declineCall}
      />
      {children}
    </CallContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useCallContext = () => {
  const context = useContext(CallContext);
  if (!context) {
    throw new Error("useCallContext must be used within a CallProvider");
  }
  return context;
};
