import { useState } from 'react';
import { Card, Title } from '@tremor/react';
import { Calendar } from '@/components/ui/Calendar';
import Button from '../ui/Button';
import { addDays, format, parse, isSameDay } from 'date-fns';

interface TimeSlot {
  time: string;
  available: boolean;
}

interface ConsultationSchedulerProps {
  consultantId: string;
  onSchedule: (date: Date, time: string) => void;
}

export default function ConsultationScheduler({ consultantId, onSchedule }: ConsultationSchedulerProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  // Mock available time slots - replace with API call
  const timeSlots: TimeSlot[] = [
    { time: '09:00', available: true },
    { time: '10:00', available: true },
    { time: '11:00', available: false },
    { time: '14:00', available: true },
    { time: '15:00', available: true },
    { time: '16:00', available: true },
  ];

  const handleSchedule = async () => {
    if (selectedDate && selectedTime) {
      setIsLoading(true);
      const dateTime = parse(selectedTime, 'HH:mm', selectedDate);
      try {
        await onSchedule(dateTime, selectedTime);
        setSelectedDate(undefined);
        setSelectedTime(undefined);
      } catch (error) {
        console.error('Failed to schedule consultation:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Card className="bg-white shadow-lg border border-gray-200">
      <Title>Schedule Consultation</Title>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            disabled={(date) => date < new Date() || date > addDays(new Date(), 30)}
            className="rounded-lg border border-gray-200 shadow-sm p-3 bg-white"
          />
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900">Available Time Slots</h3>
          <div className="grid grid-cols-2 gap-2">
            {timeSlots.map((slot) => (
              <button
                key={slot.time}
                onClick={() => setSelectedTime(slot.time)}
                disabled={!slot.available}
                className={`
                  p-2 text-sm rounded-lg border transition-all duration-200
                  ${!slot.available && 'opacity-50 cursor-not-allowed bg-muted'}
                  ${selectedTime === slot.time
                    ? 'bg-primary-50 border-primary-500 text-primary-700 shadow-sm'
                    : 'hover:bg-gray-50 hover:border-gray-300'
                  }
                `}
              >
                {slot.time}
              </button>
            ))}
          </div>

          {selectedDate && selectedTime && (
            <div className="mt-6">
              <p className="text-sm text-gray-600">
                Selected time: {format(selectedDate, 'MMM d, yyyy')} at {selectedTime}
              </p>
              <Button variant="primary" className="mt-2 w-full" onClick={handleSchedule}>
                Schedule Consultation
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}