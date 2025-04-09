'use client';

import ShoppingCart from '../components/ShoppingCart';
import styles from '../styles/cart.module.css';
export default function CartPage() {
  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="mb-8">
        <h1 className={styles.cartTitle}>Your Shopping Cart</h1>
        <p className={styles.cartDescription}>
          Review your items before proceeding to checkout.
        </p>
      </div>
      
      <ShoppingCart />
    </div>
  );
} 