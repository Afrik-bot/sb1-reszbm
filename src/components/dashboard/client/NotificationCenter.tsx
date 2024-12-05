import { Text, Badge } from '@tremor/react';

interface Notification {
  id: string;
  type: 'info' | 'warning' | 'success' | 'error';
  message: string;
  timestamp: Date;
  read: boolean;
}

interface NotificationCenterProps {
  notifications: Notification[];
}

export default function NotificationCenter({ notifications }: NotificationCenterProps) {
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Text className="font-medium">Notifications</Text>
        {unreadCount > 0 && (
          <Badge color="red">{unreadCount} new</Badge>
        )}
      </div>

      <div className="space-y-2">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-3 rounded-lg ${
              notification.read ? 'bg-gray-50' : 'bg-blue-50'
            }`}
          >
            <div className="flex items-start justify-between">
              <Text className={notification.read ? 'text-gray-600' : 'text-gray-900'}>
                {notification.message}
              </Text>
              {!notification.read && (
                <div className="w-2 h-2 rounded-full bg-blue-500" />
              )}
            </div>
            <Text className="text-xs text-gray-500 mt-1">
              {notification.timestamp.toLocaleString()}
            </Text>
          </div>
        ))}
      </div>

      {notifications.length === 0 && (
        <Text className="text-gray-500 text-center py-4">
          No notifications
        </Text>
      )}
    </div>
  );
}