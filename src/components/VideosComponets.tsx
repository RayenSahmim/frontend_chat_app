import React, { useEffect, useState } from 'react';

import VideoContainer from './VideoContainer';
import LayoutControls, { LayoutType } from './LayoutControls';
import { useLayoutClasses } from '../hooks/useLayoutClasees';

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
  const classes = useLayoutClasses(layout);

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