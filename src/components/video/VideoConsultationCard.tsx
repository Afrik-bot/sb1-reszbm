import { useState } from 'react';
import { Card, Title } from '@tremor/react';
import { VideoIcon, PhoneIcon } from 'lucide-react';
import Button from '../ui/Button';
import VideoChat from './VideoChat';

interface VideoConsultationCardProps {
  consultationId: string;
  participantName: string;
  scheduledTime: Date;
}

export default function VideoConsultationCard({ 
  consultationId, 
  participantName, 
  scheduledTime 
}: VideoConsultationCardProps) {
  const [isVideoActive, setIsVideoActive] = useState(false);

  const handleJoinCall = () => {
    setIsVideoActive(true);
  };

  const handleEndCall = () => {
    setIsVideoActive(false);
  };

  if (isVideoActive) {
    return (
      <Card className="h-[600px]">
        <VideoChat
          roomUrl={`https://lawlink.daily.co/${consultationId}`}
          onLeave={handleEndCall}
        />
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <div>
          <Title>Upcoming Consultation</Title>
          <p className="text-sm text-muted-foreground">with {participantName}</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center space-x-2"
          >
            <PhoneIcon className="h-4 w-4" />
            <span>Audio Only</span>
          </Button>
          <Button
            variant="primary"
            size="sm"
            className="flex items-center space-x-2"
            onClick={handleJoinCall}
          >
            <VideoIcon className="h-4 w-4" />
            <span>Join Video Call</span>
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between py-2 border-b">
          <span className="text-sm font-medium">Scheduled Time</span>
          <span className="text-sm text-muted-foreground">
            {scheduledTime.toLocaleString()}
          </span>
        </div>
        <div className="flex items-center justify-between py-2 border-b">
          <span className="text-sm font-medium">Duration</span>
          <span className="text-sm text-muted-foreground">60 minutes</span>
        </div>
        <div className="flex items-center justify-between py-2">
          <span className="text-sm font-medium">Status</span>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-800">
            Ready to Join
          </span>
        </div>
      </div>
    </Card>
  );
}