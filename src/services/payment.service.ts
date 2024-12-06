import { db } from '@/firebase';
import { collection, addDoc, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { loadStripe } from '@stripe/stripe-js';
import type { Payment, PaymentIntent } from '@/types/payment';

const STRIPE_PUBLIC_KEY = 'pk_test_51O6KhyKN6uZwR8Y0JL0c5Tz6DZJ8K9X2Q1q3Y4w5E6t7U8i9O0p1A2B3C4D5E6F7G';

export class PaymentService {
  private static instance: PaymentService;
  private stripe: any;

  private constructor() {
    this.initializeStripe();
  }

  private async initializeStripe() {
    try {
      this.stripe = await loadStripe(STRIPE_PUBLIC_KEY);
      if (!this.stripe) {
        throw new Error('Failed to initialize Stripe');
      }
    } catch (error) {
      console.error('Stripe initialization error:', error);
      throw error;
    }
  }

  static getInstance(): PaymentService {
    if (!PaymentService.instance) {
      PaymentService.instance = new PaymentService();
    }
    return PaymentService.instance;
  }

  private async initializeStripe() {
    this.stripe = await loadStripe(STRIPE_PUBLIC_KEY);
  }

  async createPaymentIntent(amount: number, currency: string = 'usd'): Promise<PaymentIntent> {
    try {
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          currency,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create payment intent');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw error;
    }
  }

  async getPaymentHistory(userId: string): Promise<Payment[]> {
    try {
      const q = query(
        collection(db, 'payments'),
        where('userId', '==', userId)
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Payment[];
    } catch (error) {
      console.error('Error fetching payment history:', error);
      throw error;
    }
  }

  async processRefund(paymentId: string, amount?: number): Promise<void> {
    try {
      const response = await fetch('/api/refund', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentId,
          amount,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to process refund');
      }

      // Update payment status in Firestore
      const paymentRef = doc(db, 'payments', paymentId);
      await updateDoc(paymentRef, {
        status: 'refunded',
        refundedAt: new Date(),
        refundedAmount: amount,
      });
    } catch (error) {
      console.error('Error processing refund:', error);
      throw error;
    }
  }
}