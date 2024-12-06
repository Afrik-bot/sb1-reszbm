import { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { Card, Title } from '@tremor/react';
import Button from '../ui/Button';
import { useToast } from '@/hooks/useToast';

interface PaymentFormProps {
  amount: number;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function PaymentForm({ amount, onSuccess, onCancel }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const { addToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      addToast('Payment system not ready', 'error');
      return;
    }

    setIsProcessing(true);

    try {
      // Pre-validate form
      const { error: submitError } = await elements.submit();
      if (submitError) {
        throw submitError;
      }

      // Process payment
      const { error: confirmError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment-success`,
          payment_method_data: {
            billing_details: {
              email: elements.getElement('email')?.value
            }
          }
        },
      });

      if (confirmError) {
        throw confirmError;
      }

      addToast('Payment processed successfully', 'success');
      onSuccess();
    } catch (error: any) {
      const errorMessage = error.message || 'Payment processing failed. Please try again.';
      addToast(errorMessage, 'error');
      console.error('Payment error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <Title>Complete Payment</Title>
      <p className="text-gray-600 mt-2">Amount: ${amount.toFixed(2)}</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        <PaymentElement />
        
        <div className="flex justify-end space-x-3">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isProcessing}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isProcessing}
          >
            {isProcessing ? 'Processing...' : 'Pay Now'}
          </Button>
        </div>
      </form>
    </Card>
  );
}