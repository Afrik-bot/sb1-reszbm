import { UserProfile } from '@/types/profile';
import { Card, Text } from '@tremor/react';
import { UserCircle, Settings, Shield, HelpCircle } from 'lucide-react';

interface ProfileSectionProps {
  profile: UserProfile;
}

export default function ProfileSection({ profile }: ProfileSectionProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        {profile.photoURL ? (
          <img
            src={profile.photoURL}
            alt={profile.displayName}
            className="h-16 w-16 rounded-full object-cover ring-2 ring-primary/10"
          />
        ) : (
          <div className="h-16 w-16 rounded-full bg-primary-50 ring-2 ring-primary/10 flex items-center justify-center">
            <UserCircle className="h-8 w-8 text-primary-600" />
          </div>
        )}
        <div>
          <Text className="font-semibold text-lg text-gray-900">{profile.displayName}</Text>
          <Text className="text-sm text-gray-500">{profile.email}</Text>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-6">
        <Text className="font-medium text-sm text-gray-900 mb-4">Account Settings</Text>
        <nav className="space-y-1">
          <button className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 hover:bg-primary-50 rounded-md transition-colors">
            <Settings className="h-4 w-4 text-gray-500" />
            <span>Profile Settings</span>
          </button>
          
          <button className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 hover:bg-primary-50 rounded-md transition-colors">
            <Shield className="h-4 w-4 text-gray-500" />
            <span>Security Settings</span>
          </button>
          
          <button className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 hover:bg-primary-50 rounded-md transition-colors">
            <HelpCircle className="h-4 w-4 text-gray-500" />
            <span>Support & Help</span>
          </button>
        </nav>
      </div>
    </div>
  );
}