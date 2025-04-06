'use client';

import ShoppingCart from '../components/ShoppingCart';

export default function CartPage() {
  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Your Shopping Cart</h1>
        <p className="text-gray-600 mt-2">
          Review your items before proceeding to checkout.
        </p>
      </div>
      
      <ShoppingCart />
    </div>
  );
} 