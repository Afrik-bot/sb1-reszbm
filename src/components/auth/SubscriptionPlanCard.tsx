import { SUBSCRIPTION_PLANS } from '@/types/subscription';
import Card from '@/components/ui/Card';
import { CheckIcon } from '@heroicons/react/24/outline';

interface SubscriptionPlanCardProps {
  selectedPlan?: string;
  onSelectPlan: (planId: string) => void;
}

export default function SubscriptionPlanCard({ selectedPlan, onSelectPlan }: SubscriptionPlanCardProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {SUBSCRIPTION_PLANS.map((plan) => (
        <Card
          key={plan.id}
          className={`cursor-pointer transition-all duration-200 ${
            selectedPlan === plan.id
              ? 'ring-2 ring-primary-500 border-primary-500 bg-primary-50/50'
              : 'hover:shadow-lg border border-gray-200'
          }`}
          onClick={() => onSelectPlan(plan.id)}
        >
          <div className="p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">{plan.name}</h3>
              {selectedPlan === plan.id && (
                <CheckIcon className="h-6 w-6 text-primary-500" />
              )}
            </div>
            <p>
              <span className="text-3xl font-bold text-gray-800">${plan.price}</span>
              <span className="text-base font-normal text-muted-foreground">/mo</span>
            </p>
            <ul className="space-y-3">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <CheckIcon className="h-5 w-5 text-primary-500 shrink-0" />
                  <span className="ml-3 text-sm text-gray-600">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </Card>
      ))}
    </div>
  );
}