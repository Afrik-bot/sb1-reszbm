import { useState } from 'react';
import { UserProfile } from '@/types/profile';
import VideoConsultationSection from './shared/VideoConsultationSection';
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
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function ClientDashboard({ profile, activeTab, onTabChange }: ClientDashboardProps) {
  const [notifications, setNotifications] = useState([]);

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
              ['projects', 'Projects'],
              ['documents', 'Documents'],
              ['payments', 'Payments'],
              ['consultations', 'Video Consultations'],
              ['messages', 'Messages']
            ].map(([tab, label]) => (
              <button
                key={tab}
                onClick={() => onTabChange(tab)}
                className={`px-4 py-3 text-sm font-medium ${
                  activeTab === tab
                    ? 'border-b-2 border-primary-500 text-primary-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {label}
              </button>
            ))}
          </nav>

          <div className="p-6">
            {activeTab === 'overview' && <ActivityFeed userId={profile.id} />}
            {activeTab === 'projects' && <ProjectStatus userId={profile.id} />}
            {activeTab === 'documents' && <DocumentCenter userId={profile.id} />}
            {activeTab === 'payments' && <PaymentHistory userId={profile.id} />}
            {activeTab === 'consultations' && (
              <VideoConsultationSection
                userId={profile.id}
                userType="client"
              />
            )}
            {activeTab === 'messages' && <MessagingCenter userId={profile.id} />}
          </div>
        </div>
      </div>
    </div>
  );
}