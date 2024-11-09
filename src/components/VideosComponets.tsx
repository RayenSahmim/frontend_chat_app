const Videoscomponent = ({ localVideoRef, remoteVideoRef } : { localVideoRef: React.RefObject<HTMLVideoElement>, remoteVideoRef: React.RefObject<HTMLVideoElement> }) => {
    return (
      <div className="video-panel flex space-x-4 my-4">
              <div className="local-video w-1/2">
                <video
                  ref={localVideoRef}
                  autoPlay
                  muted
                  className="rounded-lg border border-gray-300 shadow-sm w-full h-full"
                />
              </div>
              <div className="remote-video w-1/2">
                <video
                  ref={remoteVideoRef}
                  autoPlay
                  className="rounded-lg border border-gray-300 shadow-sm w-full h-full"
                />
              </div>
            </div>
    )
  };
  
  export default Videoscomponent