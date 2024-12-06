import { useEffect, useState, useCallback } from 'react';
import { useDaily, useParticipantIds, useScreenShare, useNetwork } from '@daily-co/daily-react';
import { Card, Title, Badge } from '@tremor/react';
import { Video, Mic, PhoneOff, MonitorUp, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/useToast';
import Button from '../ui/Button';
import { Text } from '@tremor/react';
import { format } from 'date-fns';

interface VideoRoomProps {
  sessionId: string;
  userName: string;
  onLeave?: () => void;
  onError?: (error: Error) => void;
}

export default function VideoRoom({ sessionId, userName, onLeave, onError }: VideoRoomProps) {
  const daily = useDaily();
  const participants = useParticipantIds();
  const { isSharingScreen, startScreenShare, stopScreenShare } = useScreenShare();
  const { addToast } = useToast();
  const network = useNetwork();
  
  const [startTime] = useState(new Date());
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecordingConsent, setHasRecordingConsent] = useState(false);
  const [networkQuality, setNetworkQuality] = useState<'excellent' | 'good' | 'poor'>('good');
  const [bandwidth, setBandwidth] = useState<number>(0);

  const getElapsedTime = useCallback(() => {
    const elapsed = new Date().getTime() - startTime.getTime();
    return format(new Date(elapsed), 'HH:mm:ss');
  }, [startTime]);

  const toggleAudio = useCallback(() => {
    if (daily) {
      daily.setLocalAudio(!isAudioMuted);
      setIsAudioMuted(!isAudioMuted);
    }
  }, [daily, isAudioMuted]);

  const toggleVideo = useCallback(() => {
    if (daily) {
      daily.setLocalVideo(!isVideoOff);
      setIsVideoOff(!isVideoOff);
    }
  }, [daily, isVideoOff]);

  const toggleRecording = useCallback(async () => {
    if (!hasRecordingConsent) {
      const consent = window.confirm(
        'Do you consent to recording this consultation? The recording will be stored securely and accessible only to participants.'
      );
      if (!consent) return;
      setHasRecordingConsent(true);
    }

    try {
      if (isRecording) {
        await daily?.stopRecording();
      } else {
        await daily?.startRecording();
      }
      setIsRecording(!isRecording);
    } catch (error) {
      onError?.(error as Error);
    }
  }, [daily, isRecording, hasRecordingConsent, onError]);

  const toggleScreenShare = useCallback(async () => {
    try {
      if (isSharingScreen) {
        await stopScreenShare();
      } else {
        await startScreenShare();
      }
    } catch (error) {
      onError?.(error as Error);
    }
  }, [isSharingScreen, startScreenShare, stopScreenShare, onError]);

  const handleLeave = useCallback(() => {
    if (daily) {
      daily.leave();
      onLeave?.();
    }
  }, [daily, onLeave]);

  useEffect(() => {
    if (!daily) return;

    const cleanup = () => {
      daily.off('participant-joined');
      daily.off('participant-left');
      daily.off('error');
      daily.off('network-quality-change');
      daily.off('network-connection');
    };

    daily.on('participant-joined', () => {});
    daily.on('participant-left', () => {});
    daily.on('network-quality-change', ({ threshold }) => {
      setNetworkQuality(threshold);
    });
    daily.on('network-connection', (event) => {
      setBandwidth(event.bandwidth);
      if (event.bandwidth < 150000) { // Less than 150 Kbps
        if (daily) {
          daily.setLocalVideo(false);
          addToast('Poor connection detected. Video disabled to preserve quality.', 'warning');
        }
        addToast('Poor connection detected. Video disabled.', 'warning');
      }
    });
    daily.on('error', (error) => {
      console.error('Daily.co error:', error);
      addToast('Video call error occurred', 'error');
      onError?.(new Error('Video call error occurred'));
    });

    return cleanup;
  }, [daily, onError]);

  return (
    <Card className="h-[600px] flex flex-col bg-gradient-to-br from-primary-50 to-white">
      <div className="p-6 border-b border-primary-100 flex justify-between items-center">
        <Title className="text-primary-800">Video Consultation</Title>
        <div className="flex items-center space-x-4">
          <Badge 
            color={network.threshold === 'good' ? 'green' : 'yellow'}
            size="sm"
          >
            Connection: {network.threshold}
          </Badge>
          <Text className="font-mono">{getElapsedTime()}</Text>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gray-50">
        {participants.map((participantId) => (
          <div
            key={participantId}
            className="relative aspect-video bg-gray-900 rounded-xl overflow-hidden shadow-lg"
          >
            <video
              autoPlay
              playsInline
              muted={participantId === 'local'}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white px-3 py-1.5 text-sm font-medium rounded-full">
              {participantId === 'local' ? userName : 'Participant'}
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-primary-100 bg-white p-6">
        <div className="flex items-center justify-center space-x-6">
          <Button
            onClick={toggleAudio}
            variant={isAudioMuted ? "destructive" : "outline"}
            className="rounded-full w-14 h-14 p-0 flex items-center justify-center"
          >
            <Mic className="h-5 w-5" />
          </Button>

          <Button
            onClick={toggleVideo}
            variant={isVideoOff ? "destructive" : "outline"}
            className="rounded-full w-14 h-14 p-0 flex items-center justify-center"
          >
            <Video className="h-5 w-5" />
          </Button>

          <Button
            onClick={toggleScreenShare}
            variant={isSharingScreen ? "destructive" : "outline"}
            className="rounded-full w-14 h-14 p-0 flex items-center justify-center"
          >
            <MonitorUp className="h-5 w-5" />
          </Button>
          
          {hasRecordingConsent && (
            <Button
              onClick={toggleRecording}
              variant={isRecording ? "destructive" : "outline"}
              className="rounded-full w-14 h-14 p-0 flex items-center justify-center"
            >
              <MessageSquare className="h-5 w-5" />
            </Button>
          )}

          <Button
            onClick={handleLeave}
            variant="destructive"
            className="rounded-full w-14 h-14 p-0 flex items-center justify-center"
          >
            <PhoneOff className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </Card>
  );
}