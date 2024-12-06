import { db } from '@/firebase';
import { collection, addDoc, updateDoc, doc, getDoc } from 'firebase/firestore';
import { getStorage, ref, uploadString } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

interface SignatureMetadata {
  documentId: string;
  signerId: string;
  signerName: string;
  signedAt: Date;
  ipAddress: string;
  userAgent: string;
}

export class SignatureService {
  private static instance: SignatureService;

  private constructor() {}

  static getInstance(): SignatureService {
    if (!SignatureService.instance) {
      SignatureService.instance = new SignatureService();
    }
    return SignatureService.instance;
  }

  async signDocument(
    documentId: string,
    signerId: string,
    signerName: string,
    signature: string
  ): Promise<void> {
    try {
      // Upload signature image
      const storage = getStorage();
      const signatureId = uuidv4();
      const signatureRef = ref(storage, `signatures/${documentId}/${signatureId}`);
      await uploadString(signatureRef, signature, 'data_url');

      // Store signature metadata
      const metadata: SignatureMetadata = {
        documentId,
        signerId,
        signerName,
        signedAt: new Date(),
        ipAddress: await this.getIpAddress(),
        userAgent: navigator.userAgent
      };

      await addDoc(collection(db, 'signatures'), metadata);

      // Update document status
      const docRef = doc(db, 'documents', documentId);
      await updateDoc(docRef, {
        status: 'signed',
        signedAt: new Date(),
        signatureId
      });
    } catch (error) {
      console.error('Error signing document:', error);
      throw new Error('Failed to sign document');
    }
  }

  async verifySignature(documentId: string): Promise<boolean> {
    try {
      const docRef = doc(db, 'documents', documentId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return false;
      }

      const data = docSnap.data();
      return data.status === 'signed' && data.signatureId;
    } catch (error) {
      console.error('Error verifying signature:', error);
      return false;
    }
  }

  private async getIpAddress(): Promise<string> {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch (error) {
      return 'unknown';
    }
  }
}