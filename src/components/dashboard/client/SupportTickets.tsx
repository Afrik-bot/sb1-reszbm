import { useState, useEffect } from 'react';
import { Card, Title, Text, Badge } from '@tremor/react';
import { format } from 'date-fns';
import Button from '@/components/ui/Button';

interface Ticket {
  id: string;
  subject: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  lastUpdated: Date;
  assignedTo?: string;
  responses: {
    id: string;
    message: string;
    sender: string;
    timestamp: Date;
  }[];
}

interface SupportTicketsProps {
  userId: string;
}

export default function SupportTickets({ userId }: SupportTicketsProps) {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockTickets: Ticket[] = [
      {
        id: '1',
        subject: 'Payment Issue',
        description: 'Unable to process payment for consultation',
        status: 'open',
        priority: 'high',
        createdAt: new Date(),
        lastUpdated: new Date(),
        assignedTo: 'Support Team',
        responses: []
      },
      {
        id: '2',
        subject: 'Document Access',
        description: 'Cannot access shared documents',
        status: 'in_progress',
        priority: 'medium',
        createdAt: new Date(Date.now() - 86400000),
        lastUpdated: new Date(Date.now() - 3600000),
        assignedTo: 'Technical Support',
        responses: [
          {
            id: 'r1',
            message: 'We are investigating the issue',
            sender: 'Technical Support',
            timestamp: new Date(Date.now() - 3600000)
          }
        ]
      }
    ];

    setTickets(mockTickets);
    setLoading(false);
  }, [userId]);

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

  const filteredTickets = tickets.filter(ticket =>
    filter === 'all' || ticket.status === filter
  );

  if (loading) {
    return <div>Loading tickets...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="all">All Tickets</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
        </div>
        <Button variant="primary">New Ticket</Button>
      </div>

      <div className="space-y-4">
        {filteredTickets.map((ticket) => (
          <Card key={ticket.id}>
            <div className="flex items-center justify-between">
              <div>
                <Title>{ticket.subject}</Title>
                <Text className="text-gray-500 mt-1">
                  Created {format(ticket.createdAt, 'MMM d, yyyy')}
                </Text>
              </div>
              <div className="flex space-x-2">
                <Badge color={getPriorityColor(ticket.priority)}>
                  {ticket.priority}
                </Badge>
                <Badge color={getStatusColor(ticket.status)}>
                  {ticket.status.replace('_', ' ')}
                </Badge>
              </div>
            </div>

            <Text className="mt-4">{ticket.description}</Text>

            {ticket.responses.length > 0 && (
              <div className="mt-4 border-t pt-4">
                <Text className="font-medium">Latest Response</Text>
                <div className="mt-2 bg-gray-50 p-3 rounded-lg">
                  <div className="flex justify-between text-sm">
                    <Text className="font-medium">{ticket.responses[0].sender}</Text>
                    <Text className="text-gray-500">
                      {format(ticket.responses[0].timestamp, 'MMM d, h:mm a')}
                    </Text>
                  </div>
                  <Text className="mt-1">{ticket.responses[0].message}</Text>
                </div>
              </div>
            )}

            <div className="mt-4 flex justify-end space-x-2">
              <Button variant="outline">View Details</Button>
              {ticket.status !== 'closed' && (
                <Button variant="primary">Reply</Button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}