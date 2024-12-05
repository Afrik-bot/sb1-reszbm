import { useState, useEffect } from 'react';
import { Card, Title, Text } from '@tremor/react';
import { format } from 'date-fns';
import Button from '@/components/ui/Button';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  recipientId: string;
  content: string;
  timestamp: Date;
  read: boolean;
  attachments?: {
    id: string;
    name: string;
    type: string;
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
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockConversations: Conversation[] = [
      {
        id: 'conv1',
        participantId: 'consultant1',
        participantName: 'John Doe',
        lastMessage: {
          id: 'msg1',
          senderId: 'consultant1',
          senderName: 'John Doe',
          recipientId: userId,
          content: "I have reviewed the documents you sent.",
          timestamp: new Date(),
          read: false
        },
        unreadCount: 2
      },
      {
        id: 'conv2',
        participantId: 'consultant2',
        participantName: 'Jane Smith',
        lastMessage: {
          id: 'msg2',
          senderId: userId,
          senderName: 'You',
          recipientId: 'consultant2',
          content: 'Thank you for the consultation.',
          timestamp: new Date(Date.now() - 86400000),
          read: true
        },
        unreadCount: 0
      }
    ];

    setConversations(mockConversations);
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    if (selectedConversation) {
      // Mock messages - replace with actual API call
      const mockMessages: Message[] = [
        {
          id: 'msg1',
          senderId: 'consultant1',
          senderName: 'John Doe',
          recipientId: userId,
          content: "I have reviewed the documents you sent.",
          timestamp: new Date(),
          read: false
        },
        {
          id: 'msg2',
          senderId: userId,
          senderName: 'You',
          recipientId: 'consultant1',
          content: "Great, what are your thoughts?",
          timestamp: new Date(Date.now() - 3600000),
          read: true
        },
        {
          id: 'msg3',
          senderId: 'consultant1',
          senderName: 'John Doe',
          recipientId: userId,
          content: "Let me outline my key findings.",
          timestamp: new Date(Date.now() - 7200000),
          read: true
        }
      ];

      setMessages(mockMessages);
    }
  }, [selectedConversation, userId]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const newMsg: Message = {
      id: `msg${Date.now()}`,
      senderId: userId,
      senderName: 'You',
      recipientId: conversations.find(c => c.id === selectedConversation)?.participantId || '',
      content: newMessage,
      timestamp: new Date(),
      read: false
    };

    setMessages(prev => [...prev, newMsg]);
    setNewMessage('');
  };

  if (loading) {
    return <div>Loading messages...</div>;
  }

  return (
    <div className="grid grid-cols-12 gap-6 h-[calc(100vh-16rem)]">
      <div className="col-span-4 bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b">
          <Title>Conversations</Title>
        </div>
        <div className="overflow-y-auto h-full">
          {conversations.map((conversation) => (
            <button
              key={conversation.id}
              onClick={() => setSelectedConversation(conversation.id)}
              className={`w-full p-4 text-left hover:bg-gray-50 ${
                selectedConversation === conversation.id ? 'bg-blue-50' : ''
              }`}
            >
              <div className="flex justify-between">
                <Text className="font-medium">{conversation.participantName}</Text>
                {conversation.unreadCount > 0 && (
                  <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                    {conversation.unreadCount}
                  </span>
                )}
              </div>
              <Text className="text-sm text-gray-500 truncate">
                {conversation.lastMessage.content}
              </Text>
              <Text className="text-xs text-gray-400">
                {format(conversation.lastMessage.timestamp, 'MMM d, h:mm a')}
              </Text>
            </button>
          ))}
        </div>
      </div>

      <div className="col-span-8 bg-white rounded-lg shadow overflow-hidden">
        {selectedConversation ? (
          <>
            <div className="p-4 border-b">
              <Title>
                {conversations.find(c => c.id === selectedConversation)?.participantName}
              </Title>
            </div>
            <div className="flex flex-col h-full">
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.senderId === userId ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg p-3 ${
                        message.senderId === userId
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100'
                      }`}
                    >
                      <Text>{message.content}</Text>
                      <Text className={`text-xs ${
                        message.senderId === userId ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {format(message.timestamp, 'h:mm a')}
                      </Text>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleSendMessage();
                      }
                    }}
                  />
                  <Button
                    variant="primary"
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                  >
                    Send
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