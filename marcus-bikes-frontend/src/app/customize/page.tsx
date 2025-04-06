'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../styles/customize.module.css';

export default function CustomizePage() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to the categories page
    router.replace('/categories');
  }, [router]);

  // Show a loading indicator while redirecting
  return (
    <div className={styles.loadingContainer}>
      <div className={styles.loadingSpinner}>
        <div className={styles.spinnerAnimation}></div>
      </div>
      <p className="mt-4 text-center text-gray-600">Redirecting to categories...</p>
    </div>
  );
} 