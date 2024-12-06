import { db } from '@/firebase';
import { collection, addDoc, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';

export interface Appointment {
  id: string;
  consultantId: string;
  clientId: string;
  date: Date;
  duration: number;
  status: 'scheduled' | 'completed' | 'cancelled';
  type: 'consultation' | 'followup';
  notes?: string;
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

export class CalendarService {
  private static instance: CalendarService;

  private constructor() {}

  static getInstance(): CalendarService {
    if (!CalendarService.instance) {
      CalendarService.instance = new CalendarService();
    }
    return CalendarService.instance;
  }

  async scheduleAppointment(appointment: Omit<Appointment, 'id'>): Promise<string> {
    try {
      const appointmentId = uuidv4();
      await addDoc(collection(db, 'appointments'), {
        id: appointmentId,
        ...appointment,
        createdAt: new Date()
      });

      // Send notifications
      await this.sendAppointmentNotifications(appointmentId);

      return appointmentId;
    } catch (error) {
      console.error('Error scheduling appointment:', error);
      throw error;
    }
  }

  async getAvailableSlots(consultantId: string, date: Date): Promise<TimeSlot[]> {
    try {
      // In production, implement actual availability logic
      const slots: TimeSlot[] = [];
      for (let hour = 9; hour <= 17; hour++) {
        slots.push({
          time: `${hour.toString().padStart(2, '0')}:00`,
          available: Math.random() > 0.3 // Simulate some slots being unavailable
        });
      }
      return slots;
    } catch (error) {
      console.error('Error getting available slots:', error);
      throw error;
    }
  }

  async getAppointments(userId: string, role: 'client' | 'consultant'): Promise<Appointment[]> {
    try {
      const q = query(
        collection(db, 'appointments'),
        where(role === 'client' ? 'clientId' : 'consultantId', '==', userId)
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Appointment[];
    } catch (error) {
      console.error('Error getting appointments:', error);
      throw error;
    }
  }

  async cancelAppointment(appointmentId: string): Promise<void> {
    try {
      const appointmentRef = doc(db, 'appointments', appointmentId);
      await updateDoc(appointmentRef, {
        status: 'cancelled',
        cancelledAt: new Date()
      });
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      throw error;
    }
  }

  private async sendAppointmentNotifications(appointmentId: string): Promise<void> {
    // In production, implement email/push notifications
    console.log('Sending notifications for appointment:', appointmentId);
  }
}