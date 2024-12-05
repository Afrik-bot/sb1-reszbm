import type { ConsultantProfile, UserProfile } from '../types/profile';

// Mock data for testing
const MOCK_PROFILES: Record<string, UserProfile | ConsultantProfile> = {
  'test-user-123': {
    id: 'test-user-123',
    email: 'test@example.com',
    displayName: 'Test User',
    userType: 'consultant',
    createdAt: new Date(),
    expertise: ['Corporate Law', 'Contract Law'],
    hourlyRate: 150,
    availability: {
      'Monday': ['09:00', '10:00', '11:00'],
      'Tuesday': ['14:00', '15:00', '16:00']
    },
    experience: 'Senior legal consultant with 10+ years of experience',
    certifications: ['Bar Association', 'Legal Tech Certificate'],
    rating: 4.8,
    reviews: [
      {
        id: 'review-1',
        clientId: 'client-1',
        rating: 5,
        comment: 'Excellent service and advice',
        createdAt: new Date()
      }
    ]
  }
};

export class ProfileService {
  private static instance: ProfileService;

  private constructor() {}

  static getInstance(): ProfileService {
    if (!ProfileService.instance) {
      ProfileService.instance = new ProfileService();
    }
    return ProfileService.instance;
  }

  async createProfile(userId: string, profileData: Partial<UserProfile | ConsultantProfile>): Promise<void> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    MOCK_PROFILES[userId] = {
      ...profileData,
      createdAt: new Date(),
    } as UserProfile | ConsultantProfile;
  }

  async getProfile(userId: string): Promise<UserProfile | ConsultantProfile | null> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return MOCK_PROFILES[userId] || null;
  }

  async updateProfile(userId: string, updates: Partial<UserProfile | ConsultantProfile>): Promise<void> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    MOCK_PROFILES[userId] = { ...MOCK_PROFILES[userId], ...updates };
  }
}