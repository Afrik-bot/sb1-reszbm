import { db } from '@/firebase';
import { collection, addDoc, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

export interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  uploadedBy: string;
  createdAt: Date;
  folder?: string;
  sharedWith: string[];
}

export class DocumentService {
  private static instance: DocumentService;

  private constructor() {}

  static getInstance(): DocumentService {
    if (!DocumentService.instance) {
      DocumentService.instance = new DocumentService();
    }
    return DocumentService.instance;
  }

  async uploadDocument(file: File, userId: string, folder?: string): Promise<Document> {
    try {
      // Validate file size and type
      const maxSize = 25 * 1024 * 1024; // 25MB
      if (file.size > maxSize) {
        throw new Error('File size exceeds 25MB limit');
      }

      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error('File type not supported');
      }

      const storage = getStorage();
      const fileId = uuidv4();
      const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const fileRef = ref(storage, `documents/${userId}/${fileId}-${sanitizedFileName}`);
      
      // Upload with metadata
      await uploadBytes(fileRef, file, {
        contentType: file.type,
        customMetadata: {
          uploadedBy: userId,
          originalName: file.name
        }
      });

      const url = await getDownloadURL(fileRef);

      const document: Document = {
        id: fileId,
        name: file.name,
        type: file.type,
        size: file.size,
        url,
        uploadedBy: userId,
        createdAt: new Date(),
        lastModified: new Date(),
        folder,
        sharedWith: []
      };

      await addDoc(collection(db, 'documents'), document);
      return document;
    } catch (error) {
      console.error('Error uploading document:', error);
      throw new Error('Failed to upload document');
    }
  }

  async getDocuments(userId: string, folder?: string): Promise<Document[]> {
    try {
      let q = query(
        collection(db, 'documents'),
        where('uploadedBy', '==', userId)
      );

      if (folder) {
        q = query(q, where('folder', '==', folder));
      }

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Document[];
    } catch (error) {
      console.error('Error fetching documents:', error);
      throw error;
    }
  }

  async shareDocument(documentId: string, userIds: string[]): Promise<void> {
    try {
      const docRef = doc(db, 'documents', documentId);
      await updateDoc(docRef, {
        sharedWith: userIds
      });
    } catch (error) {
      console.error('Error sharing document:', error);
      throw error;
    }
  }

  async deleteDocument(documentId: string): Promise<void> {
    try {
      const docRef = doc(db, 'documents', documentId);
      await updateDoc(docRef, {
        deleted: true,
        deletedAt: new Date()
      });
    } catch (error) {
      console.error('Error deleting document:', error);
      throw error;
    }
  }
}