import { useState, useEffect } from 'react';
import { Card, Title, Text, Badge } from '@tremor/react';
import { format } from 'date-fns';
import { PaymentService } from '@/services/payment.service';
import { Payment } from '@/types/payment';

interface PaymentHistoryProps {
  userId: string;
}

export default function PaymentHistory({ userId }: PaymentHistoryProps) {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPayments();
  }, [userId]);

  const loadPayments = async () => {
    try {
      const paymentService = PaymentService.getInstance();
      const history = await paymentService.getPaymentHistory(userId);
      setPayments(history);
    } catch (error) {
      console.error('Error loading payments:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading payment history...</div>;
  }

  return (
    <Card>
      <Title>Payment History</Title>
      <div className="mt-6 space-y-4">
        {payments.map((payment) => (
          <div
            key={payment.id}
            className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <div>
              <Text className="font-medium">{payment.description}</Text>
              <Text className="text-sm text-gray-500">
                {format(payment.date, 'MMM d, yyyy h:mm a')}
              </Text>
            </div>
            <div className="text-right">
              <Text className="font-medium">${payment.amount.toFixed(2)}</Text>
              <Badge
                color={
                  payment.status === 'completed' ? 'green' :
                  payment.status === 'pending' ? 'yellow' :
                  'red'
                }
                size="sm"
              >
                {payment.status}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}