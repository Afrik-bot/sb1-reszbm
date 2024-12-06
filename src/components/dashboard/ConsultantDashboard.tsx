import { ConsultantProfile } from '@/types/profile';
import VideoConsultationSection from './shared/VideoConsultationSection';
import CaseOverview from './consultant/CaseOverview';
import ClientAnalytics from './consultant/ClientAnalytics';
import FinancialMetrics from './consultant/FinancialMetrics';
import CalendarView from './consultant/CalendarView';
import DocumentManagement from './consultant/DocumentManagement';
import TimeProductivity from './consultant/TimeProductivity';
import { Case } from '@/types/case';
import { Client } from '@/types/client';

interface ConsultantDashboardProps {
  profile: ConsultantProfile;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function ConsultantDashboard({ profile, activeTab, onTabChange }: ConsultantDashboardProps) {
  // Mock data for demonstration
  const mockCases: Case[] = [
    {
      id: '1',
      clientId: 'client1',
      title: 'Corporate Restructuring',
      description: 'Major restructuring project',
      status: 'InProgress',
      practiceArea: 'Corporate',
      startDate: new Date('2024-01-15'),
      billableHours: 45,
      documents: ['doc1', 'doc2'],
      deadlines: [
        { date: new Date('2024-03-01'), description: 'Filing Deadline' }
      ]
    }
  ];

  const mockClients: Client[] = [
    {
      id: 'client1',
      name: 'Acme Corp',
      email: 'contact@acme.com',
      phone: '555-0123',
      company: 'Acme Corporation',
      status: 'active',
      createdAt: '2024-01-01',
      lastInteraction: '2024-02-15',
      totalBilled: 15000,
      outstandingBalance: 2500,
      cases: ['case1']
    }
  ];

  const mockSatisfactionScores = [
    { clientId: 'client1', score: 4.5, date: new Date() }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Welcome, {profile.displayName}</h1>
        <p className="text-gray-600">Dashboard Overview</p>
      </div>

      <div className="bg-white shadow rounded-lg">
        <nav className="flex border-b border-gray-200 overflow-x-auto">
          {[
            ['cases', 'Cases'],
            ['clients', 'Clients'],
            ['financial', 'Financial'],
            ['calendar', 'Calendar'],
            ['documents', 'Documents'],
            ['time', 'Time & Productivity'],
            ['consultations', 'Video Consultations']
          ].map(([tab, label]) => (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${
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
          {activeTab === 'cases' && <CaseOverview cases={mockCases} />}
          {activeTab === 'clients' && (
            <ClientAnalytics
              clients={mockClients}
              satisfactionScores={mockSatisfactionScores}
            />
          )}
          {activeTab === 'financial' && (
            <FinancialMetrics
              cases={mockCases}
              hourlyRate={profile.hourlyRate}
            />
          )}
          {activeTab === 'calendar' && <CalendarView cases={mockCases} />}
          {activeTab === 'documents' && <DocumentManagement cases={mockCases} />}
          {activeTab === 'time' && <TimeProductivity cases={mockCases} />}
          {activeTab === 'consultations' && (
            <VideoConsultationSection
              userId={profile.id}
              userType="consultant"
            />
          )}
        </div>
      </div>
    </div>
  );
}