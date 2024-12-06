import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registrationSchema } from '@/utils/validation';
import SubscriptionPlanCard from '@/components/auth/SubscriptionPlanCard';
import AuthLayout from '@/components/auth/AuthLayout';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import PasswordInput from '@/components/ui/PasswordInput';
import Button from '@/components/ui/Button';
import { useToast } from '@/hooks/useToast';

type RegistrationForm = {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  planId: string;
};

export default function ConsultantRegistration() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { addToast } = useToast();
  
  const {
    register: registerField,
    setValue,
    watch,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<RegistrationForm>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      planId: 'basic'
    }
  });

  const onSubmit = async (data: RegistrationForm) => {
    try {
      // Skip validation and payment for testing
      await register(data.email, data.password);

      // Navigate directly to dashboard
      navigate('/');
    } catch (error) {
      console.error('Registration error:', error);
      addToast('Registration failed. Please try again.', 'error');
    }
  };

  return (
    <AuthLayout>
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-center text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-800">
            Register as a Legal Consultant
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Join our platform and start offering your legal expertise
          </p>
        </div>

        <Card>
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First Name"
                {...registerField('firstName')}
                error={errors.firstName?.message}
              />
              <Input
                label="Last Name"
                {...registerField('lastName')}
                error={errors.lastName?.message}
              />
            </div>

            <Input
              label="Email"
              type="email"
              {...registerField('email')}
              error={errors.email?.message}
            />

            <PasswordInput
              label="Password"
              {...registerField('password')}
              error={errors.password?.message}
            />

            <PasswordInput
              label="Confirm Password"
              {...registerField('confirmPassword')}
              error={errors.confirmPassword?.message}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Select Subscription Plan
              </label>
              <div className="mt-4">
                <SubscriptionPlanCard
                  selectedPlan={watch('planId')}
                  onSelectPlan={(planId) => {
                    setValue('planId', planId, {
                      shouldValidate: true
                    });
                  }}
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? 'Processing...' : 'Create Account'}
            </Button>
          </form>
        </Card>
      </div>
    </AuthLayout>
  );
}