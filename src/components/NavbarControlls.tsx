import { Mic, MicOff, MoreVertical, Phone, PhoneOff, Video, VideoOff } from 'lucide-react'


interface Props {
    isCalling: boolean;
    startCall: () => void;
    endCall: () => void;
    handleMuteAudio: () => void;
    handleMuteVideo: () => void;
    isAudioMuted: boolean;
    isVideoMuted: boolean;
}

const NavbarControlls = ({isCalling, startCall, endCall, handleMuteAudio, handleMuteVideo, isAudioMuted, isVideoMuted} : Props) => {
  return (
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
  )
}

export default NavbarControlls
