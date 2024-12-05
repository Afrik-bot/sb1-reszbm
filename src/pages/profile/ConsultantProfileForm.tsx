import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ProfileService } from '../../services/profile.service';
import { EXPERTISE_OPTIONS } from '../../types/profile';
import type { ConsultantProfile } from '../../types/profile';

export default function ConsultantProfileForm() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const profileService = ProfileService.getInstance();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [profile, setProfile] = useState<Partial<ConsultantProfile>>({
    displayName: '',
    expertise: [],
    hourlyRate: 0,
    experience: '',
    certifications: [],
    availability: {},
  });

  useEffect(() => {
    if (currentUser) {
      loadProfile();
    }
  }, [currentUser]);

  async function loadProfile() {
    if (!currentUser) return;
    
    try {
      const existingProfile = await profileService.getProfile(currentUser.uid);
      if (existingProfile) {
        setProfile(existingProfile as ConsultantProfile);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      setError('Failed to load profile');
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!currentUser) return;

    try {
      setError('');
      setLoading(true);
      
      await profileService.createProfile(currentUser.uid, {
        ...profile,
        id: currentUser.uid,
        email: currentUser.email!,
        userType: 'consultant',
        rating: 0,
        reviews: [],
      });
      
      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving profile:', error);
      setError('Failed to save profile');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Complete Your Consultant Profile</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Display Name</label>
          <input
            type="text"
            required
            value={profile.displayName}
            onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Expertise</label>
          <select
            multiple
            value={profile.expertise}
            onChange={(e) => {
              const values = Array.from(e.target.selectedOptions, option => option.value);
              setProfile({ ...profile, expertise: values });
            }}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            {EXPERTISE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Hourly Rate ($)</label>
          <input
            type="number"
            required
            min="0"
            value={profile.hourlyRate}
            onChange={(e) => setProfile({ ...profile, hourlyRate: Number(e.target.value) })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Experience</label>
          <textarea
            required
            value={profile.experience}
            onChange={(e) => setProfile({ ...profile, experience: e.target.value })}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Certifications</label>
          <input
            type="text"
            value={profile.certifications?.join(', ')}
            onChange={(e) => setProfile({ 
              ...profile, 
              certifications: e.target.value.split(',').map(cert => cert.trim()).filter(Boolean)
            })}
            placeholder="Enter certifications separated by commas"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {loading ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
    </div>
  );
}