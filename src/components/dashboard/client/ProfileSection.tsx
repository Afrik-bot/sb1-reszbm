import { UserProfile } from '@/types/profile';
import { Card, Text } from '@tremor/react';

interface ProfileSectionProps {
  profile: UserProfile;
}

export default function ProfileSection({ profile }: ProfileSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        {profile.photoURL ? (
          <img
            src={profile.photoURL}
            alt={profile.displayName}
            className="h-16 w-16 rounded-full"
          />
        ) : (
          <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
            <span className="text-2xl font-medium text-blue-600">
              {profile.displayName.charAt(0)}
            </span>
          </div>
        )}
        <div>
          <Text className="font-medium text-lg">{profile.displayName}</Text>
          <Text className="text-gray-500">{profile.email}</Text>
        </div>
      </div>

      <div className="border-t pt-4">
        <Text className="font-medium mb-2">Account Settings</Text>
        <nav className="space-y-2">
          <button className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md">
            Edit Profile
          </button>
          <button className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md">
            Security Settings
          </button>
          <button className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md">
            Notification Preferences
          </button>
        </nav>
      </div>
    </div>
  );
}