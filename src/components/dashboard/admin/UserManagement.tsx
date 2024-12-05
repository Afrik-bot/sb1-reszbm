import { useState, useEffect } from 'react';
import { Card, Title, Text, Badge, Button } from '@tremor/react';
import { format } from 'date-fns';
import { UserProfile } from '@/types/profile';
import { DataGrid } from '@/components/ui/DataGrid';
import { useQuery } from '@tanstack/react-query';
import { getUsers } from '@/services/admin.service';

export default function UserManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [userType, setUserType] = useState('all');

  const { data: users = [], isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers
  });

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = userType === 'all' || user.userType === userType;
    return matchesSearch && matchesType;
  });

  if (isLoading) {
    return <div className="text-gray-600">Loading users...</div>;
  }

  if (error) {
    return <div className="text-red-600">Failed to load users</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Title>Users ({filteredUsers.length})</Title>
        <div className="flex space-x-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search users..."
            value={userType}
            onChange={(e) => setUserType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="all">All Users</option>
            <option value="client">Clients</option>
            <option value="consultant">Consultants</option>
          </select>
          <Button variant="primary">Add User</Button>
        </div>
      </div>

      <Card>
        <DataGrid
          data={filteredUsers}
          columns={[
            {
              header: 'User',
              cell: ({ row }) => (
                <div className="flex items-center">
                  {row.photoURL ? (
                    <img
                      className="h-10 w-10 rounded-full"
                      src={row.photoURL}
                      alt=""
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500 font-medium">
                        {row.displayName.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div className="ml-4">
                    <Text className="font-medium">{row.displayName}</Text>
                    <Text className="text-gray-500">{row.email}</Text>
                  </div>
                </div>
              )
            },
            {
              header: 'Type',
              cell: ({ row }) => (
                <Badge color={row.userType === 'consultant' ? 'green' : 'blue'}>
                  {row.userType}
                </Badge>
              )
            },
            {
              header: 'Joined',
              cell: ({ row }) => format(new Date(row.createdAt), 'MMM d, yyyy')
            },
            {
              header: 'Status',
              cell: () => (
                <Badge color="green">Active</Badge>
              )
            },
            {
              header: 'Actions',
              cell: ({ row }) => (
                <div className="flex justify-end space-x-2">
                  <Button variant="secondary" size="sm">Edit</Button>
                  <Button variant="danger" size="sm">Disable</Button>
                </div>
              )
            }
          ]}
        />
      </Card>
    </div>
  );
}