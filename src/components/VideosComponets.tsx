import React, { useEffect } from 'react';

interface VideosComponentProps {
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
  useEffect(() => {
    // Handle local stream audio and video muting
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      const videoTrack = localStream.getVideoTracks()[0];
      if (audioTrack) audioTrack.enabled = !isAudioMuted && !userAudioStatuses[userId];
      if (videoTrack) videoTrack.enabled = !isVideoMuted && !userVideoStatuses[userId];
    }
  }, [isAudioMuted, isVideoMuted, userAudioStatuses, userVideoStatuses, localStream, userId]);

  useEffect(() => {
    // Handle remote stream audio and video muting
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
  console.log('remoteVideomuted', remoteAudioMuted);
  console.log('remoteUserId', remoteUserId);
  const remoteVideoMuted = userVideoStatuses[remoteUserId || ''];

  return (
    <div className="video-panel flex space-x-4 my-4">
      <div className="video-container w-1/2 relative">
        <video
          ref={localVideoRef}
          autoPlay
          muted
          className="rounded-lg border border-gray-300 shadow-lg w-full h-full object-cover"
        />
        {localAudioMuted && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md">
            <p>Audio Muted</p>
          </div>
        )}
        {localVideoMuted && (
          <div className="absolute inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
            <p className="text-white">Video Muted</p>
          </div>
        )}
      </div>
      <div className="video-container w-1/2 relative">
        <video
          ref={remoteVideoRef}
          autoPlay
          className="rounded-lg border border-gray-300 shadow-lg w-full h-full object-cover"
        />
        {remoteAudioMuted && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md">
            <p>Audio Muted</p>
          </div>
        )}
        {remoteVideoMuted && (
          <div className="absolute inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
            <p className="text-white">Video Muted</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideosComponent;
