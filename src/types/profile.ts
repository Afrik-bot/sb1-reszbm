export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  userType: 'client' | 'consultant';
  createdAt: Date;
}

export interface ConsultantProfile extends UserProfile {
  expertise: string[];
  hourlyRate: number;
  availability: {
    [key: string]: string[]; // day -> available hours
  };
  experience: string;
  certifications: string[];
  rating: number;
  reviews: Review[];
}

export interface Review {
  id: string;
  clientId: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

export const EXPERTISE_OPTIONS = [
  'Corporate Law',
  'Intellectual Property',
  'Contract Law',
  'Employment Law',
  'Tax Law',
  'Real Estate Law',
  'Immigration Law',
  'Family Law',
  'Criminal Law',
  'Environmental Law',
] as const;