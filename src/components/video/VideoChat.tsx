import { useState, useEffect } from 'react';
import {
  DailyProvider,
  useDaily,
  useParticipantIds,
  useScreenShare,
  DailyVideo
} from '@daily-co/daily-react';
import Button from '../ui/Button';

interface VideoChatProps {
  roomUrl: string;
  onLeave?: () => void;
}

function VideoCall() {
  const daily = useDaily();
  const participantIds = useParticipantIds();
  const { isSharingScreen, startScreenShare, stopScreenShare } = useScreenShare();
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  const toggleAudio = () => {
    daily?.setLocalAudio(!isMuted);
    setIsMuted(!isMuted);
  };

  const toggleVideo = () => {
    daily?.setLocalVideo(!isVideoOff);
    setIsVideoOff(!isVideoOff);
  };

  const toggleScreenShare = () => {
    if (isSharingScreen) {
      stopScreenShare();
    } else {
      startScreenShare();
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
        {participantIds.map((id) => (
          <div key={id} className="relative rounded-lg overflow-hidden bg-gray-900">
            <DailyVideo
              participantId={id}
              className="w-full h-full object-cover"
            />
            {id === 'local' && (
              <div className="absolute bottom-2 left-2 text-white text-sm bg-black bg-opacity-50 px-2 py-1 rounded">
                You
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-center space-x-4 p-4 bg-gray-100">
        <Button
          onClick={toggleAudio}
          variant={isMuted ? 'danger' : 'primary'}
        >
          {isMuted ? 'Unmute' : 'Mute'}
        </Button>
        <Button
          onClick={toggleVideo}
          variant={isVideoOff ? 'danger' : 'primary'}
        >
          {isVideoOff ? 'Start Video' : 'Stop Video'}
        </Button>
        <Button
          onClick={toggleScreenShare}
          variant={isSharingScreen ? 'danger' : 'primary'}
        >
          {isSharingScreen ? 'Stop Sharing' : 'Share Screen'}
        </Button>
        <Button
          onClick={() => daily?.leave()}
          variant="danger"
        >
          Leave Call
        </Button>
      </div>
    </div>
  );
}

export default function VideoChat({ roomUrl, onLeave }: VideoChatProps) {
  return (
    <DailyProvider
      url={roomUrl}
      onLeave={onLeave}
    >
      <VideoCall />
    </DailyProvider>
  );
}