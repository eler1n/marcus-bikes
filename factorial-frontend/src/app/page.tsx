'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getProductsByCategory } from './lib/api';
import { Product } from './lib/data/types';
import styles from './styles/home.module.css';

export default function Home() {
  const [bicycles, setBicycles] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBicycles() {
      try {
        setLoading(true);
        const data = await getProductsByCategory('bicycle');
        setBicycles(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching bicycles:', err);
        setError('Failed to load product data');
      } finally {
        setLoading(false);
      }
    }
    
    fetchBicycles();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4">
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroContainer}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              Customize Your Dream Bicycle
            </h1>
            <p className={styles.heroDescription}>
              Build the perfect bicycle for your needs with our customizable options. 
              Select every component to create a truly personalized riding experience.
            </p>
            <Link
              href="/customize"
              className={styles.heroButton}
            >
              Start Customizing
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className={styles.categoriesSection}>
        <h2 className={styles.sectionTitle}>Our Products</h2>
        
        {loading ? (
          <div className={styles.loadingContainer}>
            <div className={styles.loadingSpinner}></div>
          </div>
        ) : error ? (
          <div className={styles.errorContainer}>
            <p className={styles.errorMessage}>{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className={styles.retryButton}
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className={styles.productGrid}>
            {bicycles.length > 0 ? (
              <Link href="/customize" className="group">
                <div className={styles.productCard}>
                  <div className={styles.productImageContainer}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 17.5l3.5-2M18.5 5.5l-3.5 2M8.5 15.5L5 17.5 8.5 19.5M15.5 15.5L19 17.5 15.5 19.5M12 13l3.5 2.5-3.5 2.5M12 13L8.5 15.5 12 18M12 13V10.5M18.5 5.5L15 7.5 12 10.5 9 7.5 5.5 5.5M18.5 5.5L12 2 5.5 5.5" />
                    </svg>
                  </div>
                  <div className="p-4">
                    <h3 className={styles.productTitle}>
                      Bicycles
                    </h3>
                    <p className={styles.productDescription}>
                      Customize your perfect bike with various components
                    </p>
                  </div>
                </div>
              </Link>
            ) : (
              <div className={styles.productCard}>
                <div className={styles.productImageContainer}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 17.5l3.5-2M18.5 5.5l-3.5 2M8.5 15.5L5 17.5 8.5 19.5M15.5 15.5L19 17.5 15.5 19.5M12 13l3.5 2.5-3.5 2.5M12 13L8.5 15.5 12 18M12 13V10.5M18.5 5.5L15 7.5 12 10.5 9 7.5 5.5 5.5M18.5 5.5L12 2 5.5 5.5" />
                  </svg>
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-lg mb-1 flex items-center">
                    Bicycles
                    <span className="ml-2 text-xs bg-red-200 text-red-800 px-2 py-0.5 rounded">No Products</span>
                  </h3>
                  <p className={styles.productDescription}>
                    No bicycles available at the moment
                  </p>
                </div>
              </div>
            )}
            
            <div className={styles.comingSoonCard}>
              <div className={styles.productImageContainer}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12c0 1.2-4.03 6-9 6s-9-4.8-9-6c0-1.2 4.03-6 9-6s9 4.8 9 6z M8.2 9.6c0 0-5.2 2.8-5.2 4.4c0 1.6 5.2 4.4 5.2 4.4" />
                </svg>
              </div>
              <div className="p-4">
                <h3 className="font-medium text-lg mb-1 flex items-center">
                  Skis
                  <span className={styles.comingSoonBadge}>Coming Soon</span>
                </h3>
                <p className={styles.productDescription}>
                  Customize your skis for the perfect snow experience
                </p>
              </div>
            </div>
            
            <div className={styles.comingSoonCard}>
              <div className={styles.productImageContainer}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 4.5l-8 3v9l8 3V4.5zM8 7.5l8 3M8 13.5l8 3" />
                </svg>
              </div>
              <div className="p-4">
                <h3 className="font-medium text-lg mb-1 flex items-center">
                  Surfboards
                  <span className={styles.comingSoonBadge}>Coming Soon</span>
                </h3>
                <p className={styles.productDescription}>
                  Customize your surfboard for the perfect wave ride
                </p>
              </div>
            </div>
            
            <div className={styles.comingSoonCard}>
              <div className={styles.productImageContainer}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.5, 2.5 a 1 1 0 0 1 5 0 M9.5, 21.5 a 1 1 0 0 0 5 0 M3 7.5l18 0 M3 16.5l18 0" />
                </svg>
              </div>
              <div className="p-4">
                <h3 className="font-medium text-lg mb-1 flex items-center">
                  Roller Skates
                  <span className={styles.comingSoonBadge}>Coming Soon</span>
                </h3>
                <p className={styles.productDescription}>
                  Customize your roller skates for the perfect ride
                </p>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Features */}
      <section className={styles.featuresSection}>
        <h2 className={styles.sectionTitle}>Why Choose Us</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className={styles.featureCard}>
            <div className={styles.featureIconContainer}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className={styles.featureTitle}>Full Customization</h3>
            <p className={styles.featureDescription}>
              Choose from a wide range of components to create your perfect ride.
            </p>
          </div>
          
          <div className={styles.featureCard}>
            <div className={styles.featureIconContainer}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className={styles.featureTitle}>Quality Guaranteed</h3>
            <p className={styles.featureDescription}>
              All our components are sourced from trusted manufacturers and tested for durability.
            </p>
          </div>
          
          <div className={styles.featureCard}>
            <div className={styles.featureIconContainer}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className={styles.featureTitle}>Fast Delivery</h3>
            <p className={styles.featureDescription}>
              We assemble and ship your custom product quickly, without compromising on quality.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
