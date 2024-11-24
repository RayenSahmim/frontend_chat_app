import React from 'react';

interface VideoContainerProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  isVideoMuted: boolean;
  isAudioMuted: boolean;
  username: string;
  isLocal?: boolean;
  className?: string;
}

const VideoContainer: React.FC<VideoContainerProps> = ({
  videoRef,
  isVideoMuted,
  isAudioMuted,
  username,
  isLocal = false,
  className = ''
}) => {
  return (
    <div className={`relative ${className}`}>
      <video
        ref={videoRef}
        autoPlay
        muted={isLocal}
        className={`w-full h-full object-cover   rounded-lg ${isVideoMuted ? 'hidden' : ''}`}
      />
      {isVideoMuted && (
        <div className="absolute inset-0 bg-[#2f3136] rounded-lg flex items-center justify-center">
          <div className="flex flex-col items-center space-y-2">
            <div className={`${isLocal ? 'w-12 h-12' : 'w-24 h-24'} rounded-full bg-[#4f545c] flex items-center justify-center`}>
              <span className={`${isLocal ? 'text-xl' : 'text-4xl'} text-[#dcddde]`}>
                {username.charAt(0).toUpperCase()}
              </span>
            </div>
            <span className={`text-[#dcddde] ${isLocal ? 'text-sm' : 'text-lg'} font-medium`}>
              {isLocal ? 'Camera Off' : `${username}'s camera is off`}
            </span>
          </div>
        </div>
      )}
      {isAudioMuted && (
        <div className={`absolute ${isLocal ? 'top-2 left-2' : 'top-4 left-4'} 
          bg-[#ed4245] text-white px-2 py-0.5 rounded-full 
          ${isLocal ? 'text-xs' : 'text-sm'} font-medium shadow-lg 
          flex items-center space-x-1`}
        >
          <svg className={`${isLocal ? 'w-3 h-3' : 'w-4 h-4'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
          </svg>
          <span>Muted</span>
        </div>
      )}
    </div>
  );
};

export default VideoContainer;