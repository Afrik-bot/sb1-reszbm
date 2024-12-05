import { useState, useEffect } from 'react';
import { Card, Title, Text } from '@tremor/react';
import { format } from 'date-fns';

interface Activity {
  id: string;
  type: 'consultation' | 'document' | 'payment' | 'message';
  description: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

interface ActivityFeedProps {
  userId: string;
}

export default function ActivityFeed({ userId }: ActivityFeedProps) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockActivities: Activity[] = [
      {
        id: '1',
        type: 'consultation',
        description: 'Consultation scheduled with John Doe',
        timestamp: new Date(),
        metadata: {
          consultantName: 'John Doe',
          duration: '1 hour'
        }
      },
      {
        id: '2',
        type: 'document',
        description: 'Contract review completed',
        timestamp: new Date(Date.now() - 86400000),
        metadata: {
          documentName: 'Service Agreement.pdf'
        }
      }
    ];

    setActivities(mockActivities);
    setLoading(false);
  }, [userId]);

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'consultation':
        return (
          <div className="p-2 bg-blue-100 rounded-full">
            <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        );
      case 'document':
        return (
          <div className="p-2 bg-green-100 rounded-full">
            <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        );
      case 'payment':
        return (
          <div className="p-2 bg-purple-100 rounded-full">
            <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      case 'message':
        return (
          <div className="p-2 bg-yellow-100 rounded-full">
            <svg className="w-5 h-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
        );
    }
  };

  if (loading) {
    return <div>Loading activities...</div>;
  }

  return (
    <Card>
      <Title>Recent Activity</Title>
      <div className="mt-6 space-y-8">
        {activities.map((activity) => (
          <div key={activity.id} className="flex">
            <div className="flex-shrink-0">
              {getActivityIcon(activity.type)}
            </div>
            <div className="ml-4 flex-1">
              <Text className="font-medium">{activity.description}</Text>
              <Text className="text-gray-500 text-sm">
                {format(activity.timestamp, 'MMM d, yyyy h:mm a')}
              </Text>
              {activity.metadata && (
                <div className="mt-2 text-sm text-gray-600">
                  {Object.entries(activity.metadata).map(([key, value]) => (
                    <div key={key} className="flex items-center space-x-2">
                      <span className="font-medium">{key}:</span>
                      <span>{value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}