export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  features: string[];
  stripeProductId: string;
  stripePriceId: string;
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'basic',
    name: 'Basic',
    price: 49,
    features: [
      'Up to 10 clients',
      'Basic document management',
      'Chat support',
      'Calendar integration'
    ],
    stripeProductId: 'prod_basic',
    stripePriceId: 'price_basic'
  },
  {
    id: 'professional',
    name: 'Professional',
    price: 99,
    features: [
      'Up to 50 clients',
      'Advanced document management',
      'Priority chat support',
      'Video conferencing',
      'Custom availability hours'
    ],
    stripeProductId: 'prod_professional',
    stripePriceId: 'price_professional'
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 199,
    features: [
      'Unlimited clients',
      'Enterprise document management',
      '24/7 priority support',
      'Advanced video conferencing',
      'Custom branding',
      'API access'
    ],
    stripeProductId: 'prod_enterprise',
    stripePriceId: 'price_enterprise'
  }
];