import { AES, enc } from 'crypto-js';

const ENCRYPTION_KEY = process.env.VITE_ENCRYPTION_KEY || 'default-dev-key';

export function encryptData(data: any): string {
  return AES.encrypt(JSON.stringify(data), ENCRYPTION_KEY).toString();
}

export function decryptData(encryptedData: string): any {
  const bytes = AES.decrypt(encryptedData, ENCRYPTION_KEY);
  return JSON.parse(bytes.toString(enc.Utf8));
}

export function sanitizeInput(input: string): string {
  return input.replace(/[<>]/g, '');
}

export class RateLimiter {
  private attempts: Map<string, number[]> = new Map();
  private maxAttempts: number;
  private timeWindow: number;

  constructor(maxAttempts = 5, timeWindow = 60000) {
    this.maxAttempts = maxAttempts;
    this.timeWindow = timeWindow;
  }

  isRateLimited(key: string): boolean {
    const now = Date.now();
    const attempts = this.attempts.get(key) || [];
    
    // Remove old attempts
    const recentAttempts = attempts.filter(timestamp => now - timestamp < this.timeWindow);
    
    if (recentAttempts.length >= this.maxAttempts) {
      return true;
    }

    recentAttempts.push(now);
    this.attempts.set(key, recentAttempts);
    return false;
  }
}