import { useState } from 'react';
import { Card, Title, Text, Badge, Tab, TabList } from '@tremor/react';
import { format } from 'date-fns';
import Button from '@/components/ui/Button';
import { DataGrid } from '@/components/ui/DataGrid';

interface Ticket {
  id: string;
  userId: string;
  userName: string;
  subject: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  category: 'technical' | 'billing' | 'legal' | 'general';
  assignedTo?: string;
  createdAt: Date;
  updatedAt: Date;
  responses: {
    id: string;
    userId: string;
    userName: string;
    message: string;
    createdAt: Date;
  }[];
}

export default function Support() {
  const [selectedView, setSelectedView] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');

  // Mock data - replace with actual API call
  const tickets: Ticket[] = [
    {
      id: '1',
      userId: 'user1',
      userName: 'John Doe',
      subject: 'Payment Processing Error',
      description: 'Unable to complete payment for consultation',
      status: 'open',
      priority: 'high',
      category: 'billing',
      createdAt: new Date(),
      updatedAt: new Date(),
      responses: []
    },
    {
      id: '2',
      userId: 'user2',
      userName: 'Jane Smith',
      subject: 'Account Access Issue',
      description: 'Cannot log into the platform',
      status: 'in_progress',
      priority: 'medium',
      category: 'technical',
      assignedTo: 'Support Team A',
      createdAt: new Date(Date.now() - 86400000),
      updatedAt: new Date(Date.now() - 3600000),
      responses: [
        {
          id: 'r1',
          userId: 'support1',
          userName: 'Support Agent',
          message: 'We are investigating the issue',
          createdAt: new Date(Date.now() - 3600000)
        }
      ]
    }
  ];

  const filteredTickets = tickets.filter(ticket => {
    const matchesStatus = selectedStatus === 'all' || ticket.status === selectedStatus;
    const matchesPriority = selectedPriority === 'all' || ticket.priority === selectedPriority;
    return matchesStatus && matchesPriority;
  });

  const getStatusColor = (status: Ticket['status']) => {
    switch (status) {
      case 'open': return 'yellow';
      case 'in_progress': return 'blue';
      case 'resolved': return 'green';
      case 'closed': return 'gray';
    }
  };

  const getPriorityColor = (priority: Ticket['priority']) => {
    switch (priority) {
      case 'low': return 'gray';
      case 'medium': return 'yellow';
      case 'high': return 'red';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Title>Support Dashboard</Title>
        <Button variant="primary">Create Ticket</Button>
      </div>

      <Card>
        <div className="flex justify-between items-center mb-6">
          <TabList
            defaultValue="all"
            onValueChange={value => setSelectedView(value)}
          >
            <Tab value="all" text="All Tickets" />
            <Tab value="open" text="Open" />
            <Tab value="assigned" text="Assigned to Me" />
            <Tab value="resolved" text="Resolved" />
          </TabList>

          <div className="flex space-x-2">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>

            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="all">All Priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>

        <DataGrid
          data={filteredTickets}
          columns={[
            {
              header: 'Ticket',
              cell: ({ row }) => (
                <div>
                  <Text className="font-medium">{row.original.subject}</Text>
                  <Text className="text-gray-500">{row.original.userName}</Text>
                </div>
              )
            },
            {
              header: 'Category',
              cell: ({ row }) => (
                <Badge size="sm">
                  {row.original.category}
                </Badge>
              )
            },
            {
              header: 'Status',
              cell: ({ row }) => (
                <Badge
                  size="sm"
                  color={getStatusColor(row.original.status)}
                >
                  {row.original.status.replace('_', ' ')}
                </Badge>
              )
            },
            {
              header: 'Priority',
              cell: ({ row }) => (
                <Badge
                  size="sm"
                  color={getPriorityColor(row.original.priority)}
                >
                  {row.original.priority}
                </Badge>
              )
            },
            {
              header: 'Created',
              cell: ({ row }) => format(row.original.createdAt, 'MMM d, yyyy')
            },
            {
              header: 'Assigned To',
              cell: ({ row }) => row.original.assignedTo || '-'
            },
            {
              header: 'Actions',
              cell: ({ row }) => (
                <div className="flex justify-end space-x-2">
                  <Button variant="secondary" size="sm">View</Button>
                  <Button variant="outline" size="sm">Assign</Button>
                  {row.original.status !== 'closed' && (
                    <Button variant="danger" size="sm">Close</Button>
                  )}
                </div>
              )
            }
          ]}
        />
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <Title>Response Time</Title>
          <div className="mt-4">
            <Text className="text-2xl font-bold">2.5 hours</Text>
            <Text className="text-gray-500">Average first response</Text>
          </div>
        </Card>

        <Card>
          <Title>Resolution Rate</Title>
          <div className="mt-4">
            <Text className="text-2xl font-bold">85%</Text>
            <Text className="text-gray-500">Tickets resolved within SLA</Text>
          </div>
        </Card>

        <Card>
          <Title>Customer Satisfaction</Title>
          <div className="mt-4">
            <Text className="text-2xl font-bold">4.8/5.0</Text>
            <Text className="text-gray-500">Based on ticket feedback</Text>
          </div>
        </Card>
      </div>
    </div>
  );
}