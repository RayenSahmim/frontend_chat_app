import React, { useEffect, useState } from 'react';
import LayoutControls, { LayoutType } from './LayoutControls';
import VideoContainer from './VideoContainer';

interface VideosComponentProps {
  username: string;
  userId: string;
  localVideoRef: React.RefObject<HTMLVideoElement>;
  remoteVideoRef: React.RefObject<HTMLVideoElement>;
  isAudioMuted: boolean;
  isVideoMuted: boolean;
  userAudioStatuses: Record<string, boolean>;
  userVideoStatuses: Record<string, boolean>;
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
}

const VideosComponent: React.FC<VideosComponentProps> = ({
  username,
  userId,
  localVideoRef,
  remoteVideoRef,
  isAudioMuted,
  isVideoMuted,
  userAudioStatuses,
  userVideoStatuses,
  localStream,
  remoteStream
}) => {
  const [layout, setLayout] = useState<LayoutType>('pip');

  useEffect(() => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      const videoTrack = localStream.getVideoTracks()[0];
      if (audioTrack) audioTrack.enabled = !isAudioMuted && !userAudioStatuses[userId];
      if (videoTrack) videoTrack.enabled = !isVideoMuted && !userVideoStatuses[userId];
    }
  }, [isAudioMuted, isVideoMuted, userAudioStatuses, userVideoStatuses, localStream, userId]);

  useEffect(() => {
    const remoteUserId = Object.keys(userAudioStatuses).find(id => id !== userId);
    if (remoteStream) {
      const audioTrack = remoteStream.getAudioTracks()[0];
      const videoTrack = remoteStream.getVideoTracks()[0];
      if (audioTrack) audioTrack.enabled = !userAudioStatuses[remoteUserId || ''];
      if (videoTrack) videoTrack.enabled = !userVideoStatuses[remoteUserId || ''];
    }
  }, [userAudioStatuses, userVideoStatuses, remoteStream, userId]);

  const localAudioMuted = isAudioMuted || userAudioStatuses[userId];
  const localVideoMuted = isVideoMuted || userVideoStatuses[userId];
  const remoteUserId = Object.keys(userAudioStatuses).find((id) => id !== userId);
  const remoteAudioMuted = userAudioStatuses[remoteUserId || ''];
  const remoteVideoMuted = userVideoStatuses[remoteUserId || ''];

  const getLayoutClasses = () => {
    switch (layout) {
      case 'grid':
        return {
          container: 'grid grid-cols-2 gap-4 p-4',
          remote: 'w-full h-full',
          local: 'w-full h-full'
        };
      case 'left':
        return {
          container: 'flex flex-row p-4 gap-4',
          remote: 'w-1/3 h-[calc(100vh-2rem)]',
          local: 'w-2/3 h-[calc(100vh-2rem)]'
        };
      case 'right':
        return {
          container: 'flex flex-row-reverse p-4 gap-4',
          remote: 'w-1/3 h-[calc(100vh-2rem)]',
          local: 'w-2/3 h-[calc(100vh-2rem)]'
        };
      default: // pip
        return {
          container: 'relative w-full h-[calc(100vh-2rem)]',
          remote: 'w-full h-full',
          local: 'absolute bottom-32 -right-2 w-64 h-36'
        };
    }
  };

  const classes = getLayoutClasses();

  return (
    <div className="relative w-full h-screen bg-[#36393f] overflow-hidden">
      <LayoutControls currentLayout={layout} onLayoutChange={setLayout} />
      
      <div className={classes.container}>
        <VideoContainer
          videoRef={remoteVideoRef}
          isVideoMuted={remoteVideoMuted}
          isAudioMuted={remoteAudioMuted}
          username={username}
          className={classes.remote}
        />
        
        <VideoContainer
          videoRef={localVideoRef}
          isVideoMuted={localVideoMuted}
          isAudioMuted={localAudioMuted}
          username={username}
          isLocal={true}
          className={classes.local}
        />
      </div>
    </div>
  );
};

export default VideosComponent;