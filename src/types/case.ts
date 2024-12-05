export type CaseStatus = 'New' | 'InProgress' | 'Pending' | 'Closed';

export type PracticeArea = 
  | 'Corporate'
  | 'Litigation'
  | 'Intellectual Property'
  | 'Real Estate'
  | 'Employment';

export interface Case {
  id: string;
  clientId: string;
  title: string;
  description: string;
  status: CaseStatus;
  practiceArea: PracticeArea;
  startDate: Date;
  completionDate?: Date;
  billableHours: number;
  documents: string[];
  nextHearing?: Date;
  deadlines: {
    date: Date;
    description: string;
  }[];
}