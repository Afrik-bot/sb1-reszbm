export interface ConnectionQuality {
  quality: 'excellent' | 'good' | 'poor';
  latency: number;
}

export interface Participant {
  id: string;
  name: string;
  isLocal: boolean;
  audioEnabled: boolean;
  videoEnabled: boolean;
}

export interface VideoRoomProps {
  sessionId: string;
  userName: string;
  onLeave?: () => void;
  onError?: (error: Error) => void;
}