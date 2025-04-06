'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import ProductCustomizer from '../../components/ProductCustomizer';
import { getProductById } from '../../lib/api';
import { Product } from '../../lib/data/types';
import styles from '../../styles/customize.module.css';

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        const data = await getProductById(productId);
        setProduct(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product data. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
    
    fetchProduct();
  }, [productId]);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}>
          <div className={styles.spinnerAnimation}></div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorContent}>
          <h2 className={styles.errorTitle}>Error</h2>
          <p className={styles.errorMessage}>{error || 'Failed to load product data'}</p>
          <button 
            onClick={() => window.location.reload()}
            className={styles.retryButton}
          >
            Try Again
          </button>
          <Link 
            href={`/categories/${product?.category || ''}`} 
            className="block text-center text-blue-500 hover:underline mt-4"
          >
            Return to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.pageHeader}>
        <div className="flex items-center justify-between">
          <h1 className={styles.pageTitle}>Customize Your {product.name}</h1>
          <Link 
            href={`/categories/${product.category}`} 
            className="text-blue-500 hover:underline flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
          </Link>
        </div>
        <p className={styles.pageDescription}>
          Select your preferred options for each component to build your perfect {product.name.toLowerCase()}.
        </p>
      </div>
      
      <ProductCustomizer product={product} />
    </div>
  );
} 