import { useState } from 'react';
import { Card, Title, Text } from '@tremor/react';
import { DailyProvider } from '@daily-co/daily-react';
import { RecoilRoot } from 'recoil';
import VideoRoom from '../../video/VideoRoom';
import ConsultationScheduler from '../../video/ConsultationScheduler';
import ConsultationHistory from '../../video/ConsultationHistory';
import Button from '../../ui/Button';
import { Video, Calendar, Clock } from 'lucide-react';
import { useToast } from '@/hooks/useToast';

interface VideoConsultationSectionProps {
  userId: string;
  userType: 'client' | 'consultant';
}

export default function VideoConsultationSection({ userId, userType }: VideoConsultationSectionProps) {
  const [activeSession, setActiveSession] = useState<string | null>(null);
  const { addToast } = useToast();

  // Mock consultation history
  const consultations = [
    {
      id: '1',
      participantName: userType === 'client' ? 'John Doe (Consultant)' : 'Alice Smith (Client)',
      date: new Date(),
      duration: 60,
      recordingUrl: 'https://example.com/recording-1',
      status: 'completed' as const
    }
  ];

  const handleSchedule = async (date: Date, time: string) => {
    try {
      // Mock API call to schedule consultation
      await new Promise(resolve => setTimeout(resolve, 1000));
      addToast('Consultation scheduled successfully', 'success');
    } catch (error) {
      addToast('Failed to schedule consultation', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {activeSession ? (
        <RecoilRoot>
          <DailyProvider
            url={`https://lawlink.daily.co/${activeSession}`}
            dailyConfig={{
              experimentalChromeVideoMuteLightOff: true,
              useDevicePreferencesApi: true
            }}
          >
            <VideoRoom
              sessionId={activeSession}
              userName={userType === 'client' ? 'Client User' : 'Legal Consultant'}
              onLeave={() => setActiveSession(null)}
              onError={(error) => {
                addToast(error.message, 'error');
                setActiveSession(null);
              }}
            />
          </DailyProvider>
        </RecoilRoot>
      ) : (
        <>
          <Card className="bg-gradient-to-br from-primary-50 to-white shadow-lg border border-primary-100">
            <div className="flex justify-between items-center mb-6">
              <div>
                <Title className="text-primary-800">Upcoming Consultations</Title>
                <Text className="text-primary-600">Your scheduled video meetings</Text>
              </div>
              <Button
                variant="primary"
                className="flex items-center space-x-2"
                onClick={() => setActiveSession('test-session')}
              >
                <Video className="h-4 w-4" />
                <span>Join Test Call</span>
              </Button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-6 border rounded-xl bg-white shadow-sm">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-primary-100 rounded-full">
                    <Video className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <Text className="font-semibold text-gray-900">
                      Test Consultation
                    </Text>
                    <div className="flex items-center space-x-3 mt-1 text-sm text-gray-500">
                      <span className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        Today
                      </span>
                      <span className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {new Date().toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {userType === 'client' && (
            <ConsultationScheduler
              consultantId={userId}
              onSchedule={handleSchedule}
            />
          )}

          <ConsultationHistory consultations={consultations} />
        </>
      )}
    </div>
  );
}