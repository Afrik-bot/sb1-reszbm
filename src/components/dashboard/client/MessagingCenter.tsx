import { useState, useEffect, useCallback, useRef } from 'react';
import { Card, Title, Text } from '@tremor/react';
import { format } from 'date-fns';
import { MessagingService } from '@/services/messaging.service';
import Button from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/useToast';
import { Paperclip, X, Send } from 'lucide-react';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
  read: boolean;
  attachments?: {
    id: string;
    name: string;
    url: string;
  }[];
}

interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  lastMessage: Message;
  unreadCount: number;
}

interface MessagingCenterProps {
  userId: string;
}

export default function MessagingCenter({ userId }: MessagingCenterProps) {
  const { currentUser } = useAuth();
  const { addToast } = useToast();
  const messagingService = MessagingService.getInstance();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribe = messagingService.subscribeToConversations(userId, (updatedConversations) => {
      setConversations(updatedConversations);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  useEffect(() => {
    if (selectedConversation) {
      const unsubscribe = messagingService.subscribeToMessages(selectedConversation, setMessages);
      return () => unsubscribe();
    }
  }, [selectedConversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if ((!newMessage.trim() && selectedFiles.length === 0) || !selectedConversation) return;

    try {
      await messagingService.sendMessage(
        selectedConversation,
        userId,
        currentUser?.displayName || 'User',
        newMessage.trim(),
        selectedFiles
      );

      setNewMessage('');
      setSelectedFiles([]);
    } catch (error) {
      addToast('Failed to send message', 'error');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedFiles(prev => [...prev, ...files]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Text>Loading messages...</Text>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <Text className="text-red-600">{error}</Text>
        <Button variant="outline" onClick={() => window.location.reload()} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-12 gap-6 h-[calc(100vh-12rem)]">
      <div className="col-span-4 bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <Title>Messages</Title>
          <input
            type="text"
            placeholder="Search conversations..."
            className="mt-2 w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div className="overflow-y-auto h-full">
          {conversations.map((conversation) => (
            <button
              key={conversation.id}
              onClick={() => setSelectedConversation(conversation.id)}
              className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                selectedConversation === conversation.id ? 'bg-primary-50' : ''
              }`}
            >
              <div className="flex justify-between items-center">
                <Text className="font-medium">{conversation.participantName}</Text>
                {conversation.unreadCount > 0 && (
                  <span className="bg-primary-500 text-white text-xs px-2 py-1 rounded-full">
                    {conversation.unreadCount}
                  </span>
                )}
              </div>
              <Text className="text-sm text-gray-500 truncate mt-1">
                {conversation.lastMessage.content}
              </Text>
              <Text className="text-xs text-gray-400 mt-1">
                {format(conversation.lastMessage.timestamp, 'MMM d, h:mm a')}
              </Text>
            </button>
          ))}
        </div>
      </div>

      <div className="col-span-8 bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
        {selectedConversation ? (
          <>
            <div className="p-4 border-b border-gray-200">
              <Title>
                {conversations.find(c => c.id === selectedConversation)?.participantName}
              </Title>
            </div>
            <div className="flex flex-col h-full">
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.senderId === userId ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg p-3 ${
                        message.senderId === userId
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100'
                      }`}
                    >
                      <Text>{message.content}</Text>
                      {message.attachments?.map((attachment) => (
                        <a
                          key={attachment.id}
                          href={attachment.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex items-center space-x-2 mt-2 p-2 rounded ${
                            message.senderId === userId
                              ? 'bg-primary-700 hover:bg-primary-800'
                              : 'bg-white hover:bg-gray-50'
                          }`}
                        >
                          <Paperclip className="h-4 w-4" />
                          <span className="text-sm">{attachment.name}</span>
                        </a>
                      ))}
                      <Text className={`text-xs mt-1 ${
                        message.senderId === userId ? 'text-primary-100' : 'text-gray-500'
                      }`}>
                        {format(message.timestamp, 'h:mm a')}
                      </Text>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              <div className="p-4 border-t border-gray-200">
                {selectedFiles.length > 0 && (
                  <div className="flex flex-wrap gap-2 p-2 bg-gray-50 rounded-lg mb-2">
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="flex items-center bg-white px-2 py-1 rounded border">
                        <span className="text-sm text-gray-600">{file.name}</span>
                        <button
                          onClick={() => removeFile(index)}
                          className="ml-2 text-gray-400 hover:text-gray-600"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex space-x-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    multiple
                    className="hidden"
                  />
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 rounded-md border-gray-300 focus:border-primary-500 focus:ring-primary-500"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleSendMessage();
                      }
                    }}
                  />
                  <Button
                    variant="primary"
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim() && selectedFiles.length === 0}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select a conversation to start messaging
          </div>
        )}
      </div>
    </div>
  );
}