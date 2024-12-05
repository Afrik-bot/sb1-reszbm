import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ProfileService } from '../../services/profile.service';
import type { ConsultantProfile as IConsultantProfile } from '../../types/profile';

export default function ConsultantProfile() {
  const { id } = useParams<{ id: string }>();
  const [profile, setProfile] = useState<IConsultantProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      loadProfile(id);
    }
  }, [id]);

  async function loadProfile(userId: string) {
    try {
      const profileService = ProfileService.getInstance();
      const consultantProfile = await profileService.getProfile(userId);
      if (consultantProfile && consultantProfile.userType === 'consultant') {
        setProfile(consultantProfile as IConsultantProfile);
      } else {
        setError('Consultant profile not found');
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="text-center p-8">Loading...</div>;
  }

  if (error || !profile) {
    return <div className="text-center p-8 text-red-600">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-8">
          <div className="flex items-center">
            {profile.photoURL && (
              <img
                src={profile.photoURL}
                alt={profile.displayName}
                className="h-20 w-20 rounded-full object-cover"
              />
            )}
            <div className="ml-4">
              <h1 className="text-2xl font-bold text-gray-900">{profile.displayName}</h1>
              <p className="text-gray-500">{profile.email}</p>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Expertise</h2>
              <div className="mt-2 flex flex-wrap gap-2">
                {profile.expertise.map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900">Rate</h2>
              <p className="mt-2 text-3xl font-bold text-gray-900">${profile.hourlyRate}/hr</p>
            </div>

            <div className="md:col-span-2">
              <h2 className="text-lg font-semibold text-gray-900">Experience</h2>
              <p className="mt-2 text-gray-600">{profile.experience}</p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900">Certifications</h2>
              <ul className="mt-2 space-y-1">
                {profile.certifications.map((cert, index) => (
                  <li key={index} className="text-gray-600">• {cert}</li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900">Rating</h2>
              <div className="mt-2 flex items-center">
                <span className="text-2xl font-bold text-gray-900">{profile.rating.toFixed(1)}</span>
                <span className="ml-2 text-gray-600">({profile.reviews.length} reviews)</span>
              </div>
            </div>
          </div>

          {profile.reviews.length > 0 && (
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Reviews</h2>
              <div className="space-y-4">
                {profile.reviews.map((review) => (
                  <div key={review.id} className="border-t pt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-yellow-400">★</span>
                        <span className="ml-1 font-medium">{review.rating}</span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="mt-2 text-gray-600">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}