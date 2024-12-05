import { useState, useEffect } from 'react';
import { Card, Title, Text, Badge, BarChart } from '@tremor/react';
import { format } from 'date-fns';

interface Payment {
  id: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  date: Date;
  description: string;
  consultantName: string;
}

interface PaymentHistoryProps {
  userId: string;
}

export default function PaymentHistory({ userId }: PaymentHistoryProps) {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockPayments: Payment[] = [
      {
        id: '1',
        amount: 250,
        status: 'completed',
        date: new Date(),
        description: 'Legal consultation - 1 hour',
        consultantName: 'John Doe'
      },
      {
        id: '2',
        amount: 500,
        status: 'pending',
        date: new Date(Date.now() - 86400000),
        description: 'Document review service',
        consultantName: 'Jane Smith'
      }
    ];

    setPayments(mockPayments);
    setLoading(false);
  }, [userId]);

  const getStatusColor = (status: Payment['status']) => {
    switch (status) {
      case 'completed': return 'green';
      case 'pending': return 'yellow';
      case 'failed': return 'red';
    }
  };

  const monthlySpending = Array.from({ length: 6 }).map((_, i) => {
    const month = new Date();
    month.setMonth(month.getMonth() - i);
    const total = payments
      .filter(p => 
        p.date.getMonth() === month.getMonth() &&
        p.date.getFullYear() === month.getFullYear() &&
        p.status === 'completed'
      )
      .reduce((sum, p) => sum + p.amount, 0);

    return {
      month: format(month, 'MMM yyyy'),
      'Total Spent': total
    };
  }).reverse();

  if (loading) {
    return <div>Loading payment history...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <Title>Monthly Spending</Title>
        <BarChart
          className="mt-6"
          data={monthlySpending}
          index="month"
          categories={['Total Spent']}
          colors={['blue']}
          valueFormatter={(value) => `$${value}`}
        />
      </Card>

      <Card>
        <Title>Recent Transactions</Title>
        <div className="mt-6 space-y-4">
          {payments.map((payment) => (
            <div
              key={payment.id}
              className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div>
                <Text className="font-medium">{payment.description}</Text>
                <Text className="text-sm text-gray-500">
                  {payment.consultantName} • {format(payment.date, 'MMM d, yyyy')}
                </Text>
              </div>
              <div className="text-right">
                <Text className="font-medium">${payment.amount}</Text>
                <Badge color={getStatusColor(payment.status)} size="sm">
                  {payment.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}