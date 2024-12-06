import { Card, Title, Text } from '@tremor/react';
import { format } from 'date-fns';
import { VideoIcon, DownloadIcon } from 'lucide-react';
import Button from '../ui/Button';

interface Consultation {
  id: string;
  participantName: string;
  date: Date;
  duration: number;
  recordingUrl?: string;
  status: 'completed' | 'cancelled' | 'no-show';
}

interface ConsultationHistoryProps {
  consultations: Consultation[];
}

export default function ConsultationHistory({ consultations }: ConsultationHistoryProps) {
  return (
    <Card>
      <Title>Consultation History</Title>
      <div className="mt-4 space-y-4">
        {consultations.map((consultation) => (
          <div
            key={consultation.id}
            className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
          >
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-accent rounded-full">
                <VideoIcon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <Text className="font-medium">{consultation.participantName}</Text>
                <Text className="text-sm text-gray-500">
                  {format(consultation.date, 'MMM d, yyyy h:mm a')}
                  {' • '}
                  {consultation.duration} minutes
                </Text>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span className={`
                px-2 py-1 text-xs rounded-full
                ${consultation.status === 'completed' && 'bg-green-100 text-green-800'}
                ${consultation.status === 'cancelled' && 'bg-red-100 text-red-800'}
                ${consultation.status === 'no-show' && 'bg-yellow-100 text-yellow-800'}
              `}>
                {consultation.status}
              </span>

              {consultation.recordingUrl && (
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-1 hover:bg-accent"
                >
                  <DownloadIcon className="h-4 w-4" />
                  <span>Recording</span>
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}