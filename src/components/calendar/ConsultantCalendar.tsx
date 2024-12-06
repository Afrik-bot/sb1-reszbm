import { useState, useEffect } from 'react';
import { Card, Title, Text } from '@tremor/react';
import { Calendar } from '@/components/ui/Calendar';
import { addDays, format, parse, isSameDay } from 'date-fns';
import { Clock, Calendar as CalendarIcon } from 'lucide-react';
import Button from '../ui/Button';
import { useToast } from '@/hooks/useToast';

interface TimeSlot {
  time: string;
  available: boolean;
}

interface ConsultantCalendarProps {
  consultantId: string;
  onSchedule?: (date: Date, time: string) => void;
}

export default function ConsultantCalendar({ consultantId, onSchedule }: ConsultantCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [selectedTime, setSelectedTime] = useState<string>();
  const { addToast } = useToast();

  useEffect(() => {
    if (selectedDate) {
      loadAvailableSlots(selectedDate);
    }
  }, [selectedDate]);

  const loadAvailableSlots = async (date: Date) => {
    // In production, fetch from API
    const slots: TimeSlot[] = [
      { time: '09:00', available: true },
      { time: '10:00', available: true },
      { time: '11:00', available: false },
      { time: '14:00', available: true },
      { time: '15:00', available: true },
      { time: '16:00', available: true },
    ];
    setAvailableSlots(slots);
  };

  const handleSchedule = async () => {
    if (!selectedDate || !selectedTime) return;

    try {
      const dateTime = parse(selectedTime, 'HH:mm', selectedDate);
      onSchedule?.(dateTime, selectedTime);
      addToast('Consultation scheduled successfully', 'success');
    } catch (error) {
      addToast('Failed to schedule consultation', 'error');
    }
  };

  return (
    <Card className="bg-white">
      <Title>Schedule Consultation</Title>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center mb-4">
            <CalendarIcon className="mr-2 h-5 w-5 text-primary" />
            <Text>Select Date</Text>
          </div>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            disabled={(date) => 
              date < new Date() || date > addDays(new Date(), 30)
            }
            className="rounded-md border"
          />
        </div>

        <div>
          <div className="flex items-center mb-4">
            <Clock className="mr-2 h-5 w-5 text-primary" />
            <Text>Available Time Slots</Text>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            {availableSlots.map((slot) => (
              <button
                key={slot.time}
                onClick={() => setSelectedTime(slot.time)}
                disabled={!slot.available}
                className={`
                  p-2 text-sm rounded-lg border transition-all duration-200
                  ${!slot.available && 'opacity-50 cursor-not-allowed bg-gray-50'}
                  ${selectedTime === slot.time
                    ? 'bg-primary-50 border-primary text-primary-700'
                    : 'hover:bg-gray-50 border-gray-200'
                  }
                `}
              >
                {slot.time}
              </button>
            ))}
          </div>

          {selectedDate && selectedTime && (
            <div className="mt-6 space-y-4">
              <div className="p-4 bg-primary-50 rounded-lg">
                <Text className="font-medium text-primary-700">
                  Selected Time:
                </Text>
                <Text className="text-primary-600">
                  {format(selectedDate, 'MMMM d, yyyy')} at {selectedTime}
                </Text>
              </div>

              <Button
                variant="primary"
                className="w-full"
                onClick={handleSchedule}
              >
                Schedule Consultation
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}