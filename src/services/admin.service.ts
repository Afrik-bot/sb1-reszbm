import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebase';
import { UserProfile } from '@/types/profile';

export async function getUsers(): Promise<UserProfile[]> {
  const querySnapshot = await getDocs(collection(db, 'profiles'));
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as UserProfile[];
}

export async function getSystemMetrics() {
  // Mock data - replace with actual API calls
  return {
    activeUsers: 156,
    newUsers: 23,
    totalRevenue: 15420,
    activeConsultations: 45
  };
}

export async function getAuditLogs() {
  // Mock data - replace with actual API calls
  return [
    {
      id: '1',
      action: 'user.login',
      userId: 'user1',
      timestamp: new Date(),
      details: 'User logged in successfully'
    },
    {
      id: '2',
      action: 'consultation.created',
      userId: 'user2',
      timestamp: new Date(Date.now() - 3600000),
      details: 'New consultation scheduled'
    }
  ];
}