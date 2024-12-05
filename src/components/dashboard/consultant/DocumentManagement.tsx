import { Card, Title, Text, Badge } from '@tremor/react';
import { Case } from '@/types/case';

interface DocumentManagementProps {
  cases: Case[];
}

interface Document {
  id: string;
  name: string;
  caseId: string;
  type: 'contract' | 'filing' | 'evidence' | 'correspondence';
  status: 'draft' | 'pending_review' | 'final';
  lastModified: Date;
}

export default function DocumentManagement({ cases }: DocumentManagementProps) {
  // Mock documents for demonstration
  const documents: Document[] = [
    {
      id: '1',
      name: 'Contract Agreement v2.1',
      caseId: cases[0]?.id || '',
      type: 'contract',
      status: 'pending_review',
      lastModified: new Date()
    },
    {
      id: '2',
      name: 'Evidence Exhibit A',
      caseId: cases[0]?.id || '',
      type: 'evidence',
      status: 'final',
      lastModified: new Date(Date.now() - 86400000)
    }
  ];

  const getStatusColor = (status: Document['status']) => {
    switch (status) {
      case 'draft': return 'gray';
      case 'pending_review': return 'yellow';
      case 'final': return 'green';
    }
  };

  const getTypeColor = (type: Document['type']) => {
    switch (type) {
      case 'contract': return 'blue';
      case 'filing': return 'purple';
      case 'evidence': return 'red';
      case 'correspondence': return 'green';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <Title>Recent Documents</Title>
        <div className="mt-4 space-y-4">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <Text className="font-medium">{doc.name}</Text>
                  <div className="flex space-x-2 mt-1">
                    <Badge color={getTypeColor(doc.type)} size="sm">
                      {doc.type}
                    </Badge>
                    <Badge color={getStatusColor(doc.status)} size="sm">
                      {doc.status.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
              </div>
              <Text className="text-gray-500">
                {doc.lastModified.toLocaleDateString()}
              </Text>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <Title>Documents by Type</Title>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between items-center">
              <Text>Contracts</Text>
              <Badge color="blue">12</Badge>
            </div>
            <div className="flex justify-between items-center">
              <Text>Filings</Text>
              <Badge color="purple">8</Badge>
            </div>
            <div className="flex justify-between items-center">
              <Text>Evidence</Text>
              <Badge color="red">15</Badge>
            </div>
            <div className="flex justify-between items-center">
              <Text>Correspondence</Text>
              <Badge color="green">23</Badge>
            </div>
          </div>
        </Card>

        <Card>
          <Title>Document Status</Title>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between items-center">
              <Text>Draft</Text>
              <Badge color="gray">5</Badge>
            </div>
            <div className="flex justify-between items-center">
              <Text>Pending Review</Text>
              <Badge color="yellow">3</Badge>
            </div>
            <div className="flex justify-between items-center">
              <Text>Final</Text>
              <Badge color="green">50</Badge>
            </div>
          </div>
        </Card>

        <Card>
          <Title>Recent Activity</Title>
          <div className="mt-4 space-y-2">
            <Text>Last document uploaded: 2 hours ago</Text>
            <Text>Last review completed: 5 hours ago</Text>
            <Text>Documents pending review: 3</Text>
          </div>
        </Card>
      </div>
    </div>
  );
}