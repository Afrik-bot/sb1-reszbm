import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ProfileService } from '../services/profile.service';
import ClientDashboard from '@/components/dashboard/ClientDashboard';
import ConsultantDashboard from '@/components/dashboard/ConsultantDashboard';
import AdminDashboard from '@/components/dashboard/AdminDashboard';
import type { UserProfile, ConsultantProfile } from '../types/profile';

export default function Dashboard() {
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState<UserProfile | ConsultantProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (currentUser) {
      loadProfile();
    }
  }, [currentUser]);

  async function loadProfile() {
    try {
      const profileService = ProfileService.getInstance();
      const userProfile = await profileService.getProfile(currentUser!.uid);
      setProfile(userProfile);
    } catch (error) {
      console.error('Error loading profile:', error);
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-red-600">{error}</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-600">Profile not found</div>
      </div>
    );
  }

  return (
    <>
      {profile.userType === 'admin' && <AdminDashboard profile={profile} />}
      {profile.userType === 'consultant' && <ConsultantDashboard profile={profile as ConsultantProfile} />}
      {profile.userType === 'client' && <ClientDashboard profile={profile} />}
    </>
  );
}