import { useState, useEffect } from 'react';
import { UserProfile } from '@/types/profile';
import ProfileSection from './client/ProfileSection';
import ActivityFeed from './client/ActivityFeed';
import NotificationCenter from './client/NotificationCenter';
import PaymentHistory from './client/PaymentHistory';
import ProjectStatus from './client/ProjectStatus';
import DocumentCenter from './client/DocumentCenter';
import SupportTickets from './client/SupportTickets';
import MessagingCenter from './client/MessagingCenter';
import { Card } from '@tremor/react';

interface ClientDashboardProps {
  profile: UserProfile;
}

export default function ClientDashboard({ profile }: ClientDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Load notifications
    // This would be replaced with actual API calls
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Welcome, {profile.displayName}</h1>
        <p className="text-gray-600">Your Personal Dashboard</p>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Sidebar */}
        <div className="col-span-12 lg:col-span-3">
          <Card>
            <ProfileSection profile={profile} />
          </Card>
          <Card className="mt-6">
            <NotificationCenter notifications={notifications} />
          </Card>
        </div>

        {/* Main Content */}
        <div className="col-span-12 lg:col-span-9">
        <nav className="flex border-b border-gray-200">
          {[
            ['overview', 'Overview'],
            ['activity', 'Activity'],
            ['projects', 'Projects'],
            ['documents', 'Documents'],
            ['payments', 'Payments'],
            ['support', 'Support'],
            ['messages', 'Messages']
          ].map(([tab, label]) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 text-sm font-medium ${
                activeTab === tab
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {label}
            </button>
          ))}
        </nav>

        <div className="p-6">
          {activeTab === 'overview' && <ActivityFeed userId={profile.id} />}
          {activeTab === 'activity' && <ActivityFeed userId={profile.id} />}
          {activeTab === 'projects' && <ProjectStatus userId={profile.id} />}
          {activeTab === 'documents' && <DocumentCenter userId={profile.id} />}
          {activeTab === 'payments' && <PaymentHistory userId={profile.id} />}
          {activeTab === 'support' && <SupportTickets userId={profile.id} />}
          {activeTab === 'messages' && <MessagingCenter userId={profile.id} />}
        </div>
      </div>
      </div>
    </div>
  );
}