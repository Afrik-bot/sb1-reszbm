import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { SUBSCRIPTION_PLANS } from '../../types/subscription';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registrationSchema, type RegistrationForm } from '@/utils/validation';
import AuthLayout from '@/components/auth/AuthLayout';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import PasswordInput from '@/components/ui/PasswordInput';
import Button from '@/components/ui/Button';
import { useToast } from '@/hooks/useToast';

export default function ConsultantRegistration() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState('basic');
  const { addToast } = useToast();
  
  const {
    register: registerField,
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
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                {SUBSCRIPTION_PLANS.map((plan) => (
                  <div
                    key={plan.id}
                    className={`relative rounded-lg border p-4 cursor-pointer transition-all duration-200 ${
                      selectedPlan === plan.id
                        ? 'border-primary-500 bg-primary-50 shadow-md'
                        : 'border-gray-300 hover:border-primary-300'
                    }`}
                    onClick={() => {
                      setSelectedPlan(plan.id);
                      registerField('planId').onChange(plan.id);
                    }}
                  >
                    <h3 className="text-lg font-medium text-gray-900">{plan.name}</h3>
                    <p className="mt-1 text-sm text-gray-500">${plan.price}/month</p>
                    <ul className="mt-2 space-y-1">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="text-sm text-gray-600">
                          • {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
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