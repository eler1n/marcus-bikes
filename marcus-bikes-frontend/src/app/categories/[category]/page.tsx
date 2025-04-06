'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getProductsByCategory } from '../../lib/api';
import { Product } from '../../lib/data/types';
import styles from '../../styles/home.module.css';

// Helper function to format category names for display
const formatCategoryName = (category: string): string => {
  return category.charAt(0).toUpperCase() + category.slice(1);
};

export default function CategoryProductsPage() {
  const params = useParams();
  const category = params.category as string;
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const data = await getProductsByCategory(category);
        setProducts(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(`Failed to load ${formatCategoryName(category)} products. Please try again later.`);
      } finally {
        setLoading(false);
      }
    }
    
    fetchProducts();
  }, [category]);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p className={styles.errorMessage}>{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className={styles.retryButton}
        >
          Try Again
        </button>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div>
        <div className="mb-8">
          <h1 className={styles.sectionTitle}>{formatCategoryName(category)} Products</h1>
          <Link href="/categories" className="block text-center text-blue-500 hover:underline mb-4">
            ← Back to Categories
          </Link>
        </div>
        
        <div className={styles.errorContainer}>
          <p>No products available in this category yet.</p>
          <Link href="/categories" className={styles.retryButton}>
            Return to Categories
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className={styles.sectionTitle}>{formatCategoryName(category)} Products</h1>
        <Link href="/categories" className="block text-center text-blue-500 hover:underline mb-4">
          ← Back to Categories
        </Link>
        <p className="text-center text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Select a product to customize and create your perfect {category}.
        </p>
      </div>
      
      <div className={styles.productGrid}>
        {products.map((product) => (
          <Link key={product.id} href={`/products/${product.id}`} className="group">
            <div className={styles.productCard}>
              <div className={styles.productImageContainer}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 17.5l3.5-2M18.5 5.5l-3.5 2M8.5 15.5L5 17.5 8.5 19.5M15.5 15.5L19 17.5 15.5 19.5M12 13l3.5 2.5-3.5 2.5M12 13L8.5 15.5 12 18M12 13V10.5M18.5 5.5L15 7.5 12 10.5 9 7.5 5.5 5.5M18.5 5.5L12 2 5.5 5.5" />
                </svg>
              </div>
              <div className="p-4">
                <h3 className={styles.productTitle}>
                  {product.name}
                </h3>
                <p className={styles.productDescription}>
                  {product.description}
                </p>
                <p className="mt-2 text-blue-600 font-semibold">
                  ${product.components.reduce((minPrice, component) => {
                    const minOptionPrice = Math.min(...component.options.map(opt => opt.price));
                    return minPrice + minOptionPrice;
                  }, product.basePrice).toFixed(2)}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
} 