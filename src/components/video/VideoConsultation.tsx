import { useState } from 'react';
import VideoChat from './VideoChat';
import PreCallChecklist from './PreCallChecklist';
import { useAuth } from '@/contexts/AuthContext';

interface VideoConsultationProps {
  consultationId: string;
  onEnd?: () => void;
}

export default function VideoConsultation({ consultationId, onEnd }: VideoConsultationProps) {
  const [isPreCallComplete, setIsPreCallComplete] = useState(false);
  const [roomUrl, setRoomUrl] = useState('');
  const { currentUser } = useAuth();

  const handlePreCallComplete = async () => {
    try {
      // In production, this would make an API call to create a room
      const mockRoomUrl = `https://your-domain.daily.co/${consultationId}`;
      setRoomUrl(mockRoomUrl);
      setIsPreCallComplete(true);
    } catch (error) {
      console.error('Error creating video room:', error);
    }
  };

  const handleCallEnd = () => {
    onEnd?.();
  };

  if (!isPreCallComplete) {
    return <PreCallChecklist onReady={handlePreCallComplete} />;
  }

  return (
    <div className="h-full">
      <VideoChat
        roomUrl={roomUrl}
        onLeave={handleCallEnd}
      />
    </div>
  );
}