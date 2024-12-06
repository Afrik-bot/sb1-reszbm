import { useState } from 'react';
import { Card, Title, Text } from '@tremor/react';
import { Eye, Download, Share2, Trash } from 'lucide-react';
import Button from '../ui/Button';
import { Document } from '@/services/document.service';

interface DocumentViewerProps {
  document: Document;
  onShare?: (document: Document) => void;
  onDelete?: (document: Document) => void;
}

export default function DocumentViewer({ document, onShare, onDelete }: DocumentViewerProps) {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    try {
      const response = await fetch(document.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = document.name;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading document:', error);
    }
  };

  return (
    <Card>
      <div className="flex justify-between items-start">
        <div>
          <Title>{document.name}</Title>
          <Text className="text-gray-500">
            {(document.size / 1024 / 1024).toFixed(2)} MB • 
            {new Date(document.createdAt).toLocaleDateString()}
          </Text>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            className="flex items-center space-x-1"
          >
            <Download className="h-4 w-4" />
            <span>Download</span>
          </Button>
          
          {onShare && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onShare(document)}
              className="flex items-center space-x-1"
            >
              <Share2 className="h-4 w-4" />
              <span>Share</span>
            </Button>
          )}
          
          {onDelete && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onDelete(document)}
              className="flex items-center space-x-1"
            >
              <Trash className="h-4 w-4" />
              <span>Delete</span>
            </Button>
          )}
        </div>
      </div>

      <div className="mt-4 border rounded-lg overflow-hidden">
        <iframe
          src={document.url}
          className="w-full h-[600px]"
          title={document.name}
        />
      </div>
    </Card>
  );
}