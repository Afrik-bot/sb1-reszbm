import { useState } from 'react';
import { UserProfile } from '@/types/profile';
import UserManagement from './admin/UserManagement';
import Analytics from './admin/Analytics';
import Support from './admin/Support';

interface AdminDashboardProps {
  profile: UserProfile;
}

export default function AdminDashboard({ profile }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState('users');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600">System management and oversight</p>
      </div>

      <div className="bg-white shadow rounded-lg">
        <nav className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-3 text-sm font-medium ${
              activeTab === 'users'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            User Management
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-3 text-sm font-medium ${
              activeTab === 'analytics'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Analytics
          </button>
          <button
            onClick={() => setActiveTab('support')}
            className={`px-4 py-3 text-sm font-medium ${
              activeTab === 'support'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Support
          </button>
        </nav>

        <div className="p-6">
          {activeTab === 'users' && <UserManagement />}
          {activeTab === 'analytics' && <Analytics />}
          {activeTab === 'support' && <Support />}
        </div>
      </div>
    </div>
  );
}