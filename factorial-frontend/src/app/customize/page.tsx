'use client';

import { useEffect, useState } from 'react';
import ProductCustomizer from '../components/ProductCustomizer';
import { getProductById } from '../lib/api';
import { Product } from '../lib/data/types';
import styles from '../styles/customize.module.css';

export default function CustomizePage() {
  const [bicycle, setBicycle] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    async function fetchBicycle() {
      try {
        setLoading(true);
        // Fetch the bicycle with ID 'custom-bike'
        const data = await getProductById('custom-bike');
        setBicycle(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching bicycle:', err);
        setError('Failed to load bicycle data. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
    
    fetchBicycle();
  }, []);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}>
          <div className={styles.spinnerAnimation}></div>
        </div>
      </div>
    );
  }

  if (error || !bicycle) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorContent}>
          <h2 className={styles.errorTitle}>Error</h2>
          <p className={styles.errorMessage}>{error || 'Failed to load bicycle data'}</p>
          <button 
            onClick={() => window.location.reload()}
            className={styles.retryButton}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Customize Your Bicycle</h1>
        <p className={styles.pageDescription}>
          Select your preferred options for each component to build your perfect bicycle.
        </p>
      </div>
      
      <ProductCustomizer product={bicycle} />
    </div>
  );
} 