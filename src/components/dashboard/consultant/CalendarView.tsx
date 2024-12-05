import { Card, Title, Text } from '@tremor/react';
import { format, isSameDay } from 'date-fns';
import { Case } from '@/types/case';

interface CalendarViewProps {
  cases: Case[];
}

interface Event {
  date: Date;
  type: 'hearing' | 'deadline' | 'meeting';
  title: string;
  caseId: string;
}

export default function CalendarView({ cases }: CalendarViewProps) {
  const events: Event[] = cases.flatMap(c => {
    const caseEvents: Event[] = [];
    
    if (c.nextHearing) {
      caseEvents.push({
        date: c.nextHearing,
        type: 'hearing',
        title: `Hearing: ${c.title}`,
        caseId: c.id
      });
    }

    c.deadlines.forEach(d => {
      caseEvents.push({
        date: d.date,
        type: 'deadline',
        title: d.description,
        caseId: c.id
      });
    });

    return caseEvents;
  }).sort((a, b) => a.date.getTime() - b.date.getTime());

  const today = new Date();
  const upcomingEvents = events.filter(e => e.date >= today);

  return (
    <div className="space-y-6">
      <Card>
        <Title>Upcoming Events</Title>
        <div className="mt-4 space-y-4">
          {upcomingEvents.slice(0, 5).map((event, index) => (
            <div
              key={`${event.caseId}-${index}`}
              className="flex items-center p-3 rounded-lg hover:bg-gray-50"
            >
              <div className={`w-2 h-2 rounded-full mr-3 ${
                event.type === 'hearing' ? 'bg-red-500' :
                event.type === 'deadline' ? 'bg-yellow-500' :
                'bg-blue-500'
              }`} />
              <div className="flex-1">
                <Text>{event.title}</Text>
                <Text className="text-gray-500">
                  {isSameDay(event.date, today)
                    ? 'Today'
                    : format(event.date, 'MMM d, yyyy')}
                  {' '}
                  {format(event.date, 'h:mm a')}
                </Text>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <Title>Upcoming Deadlines</Title>
          <div className="mt-4 space-y-2">
            {events
              .filter(e => e.type === 'deadline')
              .slice(0, 3)
              .map((event, index) => (
                <div
                  key={`deadline-${index}`}
                  className="flex items-center justify-between p-2"
                >
                  <Text>{event.title}</Text>
                  <Text className="text-gray-500">
                    {format(event.date, 'MMM d')}
                  </Text>
                </div>
              ))}
          </div>
        </Card>

        <Card>
          <Title>Court Appearances</Title>
          <div className="mt-4 space-y-2">
            {events
              .filter(e => e.type === 'hearing')
              .slice(0, 3)
              .map((event, index) => (
                <div
                  key={`hearing-${index}`}
                  className="flex items-center justify-between p-2"
                >
                  <Text>{event.title}</Text>
                  <Text className="text-gray-500">
                    {format(event.date, 'MMM d')}
                  </Text>
                </div>
              ))}
          </div>
        </Card>
      </div>
    </div>
  );
}