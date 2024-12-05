export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  lastInteraction: string;
  totalBilled: number;
  outstandingBalance: number;
  cases: string[];
}