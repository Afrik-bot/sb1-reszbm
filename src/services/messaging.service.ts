import { db } from '@/firebase';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  serverTimestamp,
  updateDoc,
  doc 
} from 'firebase/firestore';

interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
  read: boolean;
  attachments?: {
    id: string;
    name: string;
    type: string;
    url: string;
  }[];
}

function generateId(): string {
  return Array.from(crypto.getRandomValues(new Uint8Array(16)))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

export class MessagingService {
  private static instance: MessagingService;
  private storage = getStorage();

  subscribeToConversations(userId: string, callback: (conversations: Conversation[]) => void) {
    const q = query(
      collection(db, 'conversations'),
      where('participants', 'array-contains', userId),
      orderBy('updatedAt', 'desc')
    );

    return onSnapshot(q, async (snapshot) => {
      const conversations = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Mark messages as read
      const batch = db.batch();
      conversations.forEach(conv => {
        if (!conv.lastMessage?.read && conv.lastMessage?.senderId !== userId) {
          const msgRef = doc(db, 'messages', conv.lastMessage.id);
          batch.update(msgRef, { read: true });
        }
      });
      await batch.commit();

      callback(conversations);
    }, (error) => {
      console.error('Error subscribing to conversations:', error);
    });
  }

  subscribeToMessages(conversationId: string, callback: (messages: Message[]) => void) {
    const q = query(
      collection(db, 'messages'),
      where('conversationId', '==', conversationId),
      orderBy('timestamp', 'asc')
    );

    return onSnapshot(q, async (snapshot) => {
      const messages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(messages);
    }, (error) => {
      console.error('Error subscribing to messages:', error);
    });
  }

  private constructor() {}

  static getInstance(): MessagingService {
    if (!MessagingService.instance) {
      MessagingService.instance = new MessagingService();
    }
    return MessagingService.instance;
  }

  async sendMessage(
    conversationId: string,
    senderId: string,
    senderName: string,
    content: string,
    attachments?: File[]
  ): Promise<void> {
    try {
      const uploadedAttachments = [];

      if (attachments?.length) {
        for (const file of attachments) {
          const fileId = generateId();
          const fileRef = ref(this.storage, `messages/${conversationId}/${fileId}-${file.name}`);
          await uploadBytes(fileRef, file);
          const url = await getDownloadURL(fileRef);
          
          uploadedAttachments.push({
            id: fileId,
            name: file.name,
            type: file.type,
            url
          });
        }
      }

      const messageData = {
        id: generateId(),
        conversationId,
        senderId,
        senderName,
        content,
        timestamp: serverTimestamp(),
        read: false,
        attachments: uploadedAttachments
      };

      await addDoc(collection(db, 'messages'), messageData);

      // Update conversation last message
      const conversationRef = doc(db, 'conversations', conversationId);
      await updateDoc(conversationRef, {
        lastMessage: messageData,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }
}