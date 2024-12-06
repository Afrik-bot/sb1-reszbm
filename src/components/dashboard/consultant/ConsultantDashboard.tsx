import CalendarView from './CalendarView';
import DocumentManagement from './DocumentManagement';
import TimeProductivity from './TimeProductivity';
import VideoConsultationSection from '../shared/VideoConsultationSection';
import { Case } from '@/types/case';
import { Client } from '@/types/client';

{activeTab === 'calendar' && <CalendarView cases={mockCases} />}
{activeTab === 'documents' && <DocumentManagement cases={mockCases} />}
{activeTab === 'time' && <TimeProductivity cases={mockCases} />}
{activeTab === 'consultations' && (
  <VideoConsultationSection
    userId={profile.id}
    userType="consultant"
  />
)}