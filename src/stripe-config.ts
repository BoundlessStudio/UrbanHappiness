export interface StripeProduct {
  id: string;
  priceId: string;
  name: string;
  description: string;
  mode: 'subscription' | 'payment';
  price: string;
  currency: string;
}

export const stripeProducts: StripeProduct[] = [
  {
    id: 'prod_STU7MFCJ4qTzUe',
    priceId: 'price_1RYX93D8EBLHUT0QHQYDDpR9',
    name: 'Pro',
    description: 'Advanced features for professional developers',
    mode: 'subscription',
    price: 'C$20.00',
    currency: 'CAD'
  },
  {
    id: 'prod_STU6vulpQDA2OH',
    priceId: 'price_1RYX8eD8EBLHUT0Qaa6amaGs',
    name: 'Hobby',
    description: 'Perfect for personal projects and learning',
    mode: 'subscription',
    price: 'C$10.00',
    currency: 'CAD'
  },
  {
    id: 'prod_STU6XMO0iuEcvG',
    priceId: 'price_1RYX7wD8EBLHUT0Qs3z7wn0W',
    name: 'Free',
    description: 'Get started with basic features',
    mode: 'subscription',
    price: 'C$0.00',
    currency: 'CAD'
  }
];

export const getProductByPriceId = (priceId: string): StripeProduct | undefined => {
  return stripeProducts.find(product => product.priceId === priceId);
};

export const getProductByName = (name: string): StripeProduct | undefined => {
  return stripeProducts.find(product => product.name.toLowerCase() === name.toLowerCase());
};