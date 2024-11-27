export interface RTCIceCandidateInit {
  candidate: string;
  sdpMLineIndex: number | null;
  sdpMid: string | null;
  usernameFragment: string | null;
}

export interface CallState {
  isCalling: boolean;
  isRinging: boolean;
  callerName: string;
  callEnded: boolean;
}

export interface MediaState {
  isAudioMuted: boolean;
  isVideoMuted: boolean;
  userAudioStatuses: Record<string, boolean>;
  userVideoStatuses: Record<string, boolean>;
}

export interface StreamState {
  remoteStream: MediaStream | null;
  localStream: MediaStream | null;
}