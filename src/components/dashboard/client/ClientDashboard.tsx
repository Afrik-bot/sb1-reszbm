import ProjectStatus from './ProjectStatus';
import DocumentCenter from './DocumentCenter';
import SupportTickets from './SupportTickets';
import VideoConsultationSection from '../shared/VideoConsultationSection';
import MessagingCenter from './MessagingCenter';
import { Card } from '@tremor/react';

interface ClientDashboardProps {
  profile: {
    id: string;
  };
  activeTab: string;
}

export default function ClientDashboard({ profile, activeTab }: ClientDashboardProps) {
  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12 lg:col-span-9">
        {activeTab === 'overview' && <ActivityFeed userId={profile.id} />}
        {activeTab === 'activity' && <ActivityFeed userId={profile.id} />}
        {activeTab === 'projects' && <ProjectStatus userId={profile.id} />}
        {activeTab === 'documents' && <DocumentCenter userId={profile.id} />}
        {activeTab === 'payments' && <PaymentHistory userId={profile.id} />}
        {activeTab === 'support' && <SupportTickets userId={profile.id} />}
        {activeTab === 'consultations' && (
          <VideoConsultationSection
            userId={profile.id}
            userType="client"
          />
        )}
        {activeTab === 'messages' && <MessagingCenter userId={profile.id} />}
      </div>
    </div>
  );
}