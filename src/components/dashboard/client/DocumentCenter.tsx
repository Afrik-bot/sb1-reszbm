import { useState, useEffect } from 'react';
import { Card, Title, Text, Badge } from '@tremor/react';
import { format } from 'date-fns';
import Button from '@/components/ui/Button';

interface Document {
  id: string;
  name: string;
  type: 'contract' | 'report' | 'invoice' | 'other';
  size: number;
  uploadedAt: Date;
  status: 'draft' | 'final' | 'archived';
  sharedWith: string[];
}

interface DocumentCenterProps {
  userId: string;
}

export default function DocumentCenter({ userId }: DocumentCenterProps) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockDocuments: Document[] = [
      {
        id: '1',
        name: 'Service Agreement.pdf',
        type: 'contract',
        size: 2500000,
        uploadedAt: new Date(),
        status: 'final',
        sharedWith: ['John Doe']
      },
      {
        id: '2',
        name: 'Legal Consultation Report.docx',
        type: 'report',
        size: 1500000,
        uploadedAt: new Date(Date.now() - 86400000),
        status: 'draft',
        sharedWith: []
      }
    ];

    setDocuments(mockDocuments);
    setLoading(false);
  }, [userId]);

  const formatFileSize = (bytes: number): string => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
  };

  const getStatusColor = (status: Document['status']) => {
    switch (status) {
      case 'draft': return 'yellow';
      case 'final': return 'green';
      case 'archived': return 'gray';
    }
  };

  const filteredDocuments = documents.filter(doc => 
    filter === 'all' || doc.type === filter
  );

  if (loading) {
    return <div>Loading documents...</div>;
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
            <option value="all">All Documents</option>
            <option value="contract">Contracts</option>
            <option value="report">Reports</option>
            <option value="invoice">Invoices</option>
            <option value="other">Other</option>
          </select>
        </div>
        <Button variant="primary">Upload Document</Button>
      </div>

      <Card>
        <Title>Documents</Title>
        <div className="mt-6 space-y-4">
          {filteredDocuments.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <Text className="font-medium">{doc.name}</Text>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <span>{formatFileSize(doc.size)}</span>
                    <span>•</span>
                    <span>{format(doc.uploadedAt, 'MMM d, yyyy')}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Badge color={getStatusColor(doc.status)} size="sm">
                  {doc.status}
                </Badge>
                <button className="text-blue-600 hover:text-blue-800">
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}