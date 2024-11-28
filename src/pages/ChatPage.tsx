import React, { useEffect, useState } from 'react';
import { UserCircle2 } from 'lucide-react';
import IncomingCallModal from '../components/IncomingCallModal';
import useAuthenticatedUser from '../hooks/useAuthenticatedUser';
import useFriendData from '../hooks/useFriendData';

import { useChatSocket } from '../hooks/useChatSocket';
import { useVideoCall } from '../hooks/useVideoCall';
import NavbarControlls from '../components/NavbarControlls';
import VideosComponent from '../components/VideosComponets';
import { MessageList } from '../components/MessageList';
import { ChatInput } from '../components/ChatInput';

const ChatApp = ({ roomId  , OnlineUsers}: { roomId: string  , OnlineUsers: string[] }) => {
  const [message, setMessage] = useState('');
  const localVideoRef = React.useRef<HTMLVideoElement>(null);
  const remoteVideoRef = React.useRef<HTMLVideoElement>(null);



  const {
    authenticatedUser,
    loading: userLoading,
    error,
  } = useAuthenticatedUser();

  const {
    messages,
    typing,
    loading: chatLoading,
    sendMessage,
    sendTyping,
  } = useChatSocket(roomId, authenticatedUser?.name || '');

  const {
    isCalling,
    isRinging,
    callerName,
    remoteStream,
    localStream,
    isAudioMuted,
    isVideoMuted,
    userAudioStatuses,
    userVideoStatuses,
    startCall,
    acceptCall,
    declineCall,
    endCall,
    handleMuteAudio,
    handleMuteVideo,
  } = useVideoCall(roomId);

  useEffect(() => {
    if (localStream && localVideoRef.current) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream,isCalling]);

  // Handle remote stream
  useEffect(() => {
    if (remoteStream && remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream,isCalling]);


  

  const {
    friend,
    loading: friendLoading,
    error: friendError,
  } = useFriendData(roomId, authenticatedUser?.id || '');


  const isOnline = friend && OnlineUsers.includes(friend._id);

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

  const handleMessageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      sendMessage(message);
      setMessage('');
    }
  };

  return (
    <div className="relative flex flex-col h-full w-full">
      <div className="absolute inset-0 flex flex-col bg-gray-50">
        <div className="flex-1 flex flex-col">
          <div className="bg-white rounded-xl shadow-lg flex flex-col h-full">
            <header className="sticky top-0 z-20 bg-white border-b border-gray-200 p-4">
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
                    <h2 className="font-semibold">{friend?.name}</h2>
                    <p className="text-sm text-gray-500">{isOnline ? 'Online' : 'Offline'}</p>
                  </div>
                </div>

                <NavbarControlls
                  isCalling={isCalling}
                  startCall={startCall}
                  endCall={endCall}
                  handleMuteAudio={() => handleMuteAudio(authenticatedUser?.id || '')}
                  handleMuteVideo={() => handleMuteVideo(authenticatedUser?.id || '')}
                  isAudioMuted={isAudioMuted}
                  isVideoMuted={isVideoMuted}
                />
              </div>
            </header>

            <div className="flex-1 flex flex-col min-h-0 relative">
              {isCalling ? (
                <VideosComponent
                  username={authenticatedUser?.name || ''}
                  userId={authenticatedUser?.id || ''}
                  localVideoRef={localVideoRef}
                  remoteVideoRef={remoteVideoRef}
                  isAudioMuted={isAudioMuted}
                  isVideoMuted={isVideoMuted}
                  userAudioStatuses={userAudioStatuses}
                  userVideoStatuses={userVideoStatuses}
                  localStream={localStream}
                  remoteStream={remoteStream}
                />
              ) : (
                <>
                  <MessageList
                    messages={messages}
                    typing={typing}
                    username={authenticatedUser?.name || ''}
                    loading={chatLoading}
                  />
                  <ChatInput
                    message={message}
                    setMessage={setMessage}
                    handleMessageSubmit={handleMessageSubmit}
                    handleTyping={sendTyping}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </div>

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