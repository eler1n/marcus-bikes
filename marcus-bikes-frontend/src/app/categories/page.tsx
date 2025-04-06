'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getCategoryCounts } from '../lib/api';
import styles from '../styles/home.module.css';

// Define the categories available in the application
const categories = [
  {
    id: 'bicycle',
    name: 'Bicycles',
    description: 'Customize your perfect bike with various components',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 17.5l3.5-2M18.5 5.5l-3.5 2M8.5 15.5L5 17.5 8.5 19.5M15.5 15.5L19 17.5 15.5 19.5M12 13l3.5 2.5-3.5 2.5M12 13L8.5 15.5 12 18M12 13V10.5M18.5 5.5L15 7.5 12 10.5 9 7.5 5.5 5.5M18.5 5.5L12 2 5.5 5.5" />
      </svg>
    ),
  },
  {
    id: 'ski',
    name: 'Skis',
    description: 'Design your ultimate skiing experience with custom skis',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        {/* Left ski */}
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 3c-.5 6 0 12 0 18M6 10h2M6 14h2" />
        {/* Right ski */}
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 3c.5 6 0 12 0 18M16 10h2M16 14h2" />
      </svg>
    ),
  },
  {
    id: 'surfboard',
    name: 'Surfboards',
    description: 'Create your perfect surfboard for catching the best waves',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        {/* Surfboard outline */}
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3c3 2 6 9 6 9s-3 7-6 9c-3-2-6-9-6-9s3-7 6-9z" />
        {/* Center fin */}
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 12v6" />
      </svg>
    ),
  },
  {
    id: 'rollerskate',
    name: 'Roller Skates',
    description: 'Build your dream roller skates with custom parts and designs',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        {/* Boot */}
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 4v8a2 2 0 002 2h8v-6l-4-4H6z" />
        {/* Sole */}
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 14h12" />
        {/* Wheels */}
        <circle cx="7" cy="18" r="1" stroke="currentColor" strokeWidth={1.5} />
        <circle cx="11" cy="18" r="1" stroke="currentColor" strokeWidth={1.5} />
        <circle cx="15" cy="18" r="1" stroke="currentColor" strokeWidth={1.5} />
        <circle cx="19" cy="18" r="1" stroke="currentColor" strokeWidth={1.5} />
      </svg>
    ),
  },
];

export default function CategoriesPage() {
  const [loading, setLoading] = useState(true);
  const [categoriesWithProducts, setCategoriesWithProducts] = useState<Record<string, boolean>>({});

  useEffect(() => {
    async function checkCategoriesWithProducts() {
      try {
        setLoading(true);
        
        // Get counts for all categories in a single API call
        const categoryCounts = await getCategoryCounts();
        
        // Convert results to a record object for easier lookup
        const categoryStatus = categoryCounts.reduce((acc, { category, count }) => {
          acc[category] = count > 0;
          return acc;
        }, {} as Record<string, boolean>);
        
        setCategoriesWithProducts(categoryStatus);
      } catch (error) {
        console.error('Error checking categories:', error);
      } finally {
        setLoading(false);
      }
    }
    
    checkCategoriesWithProducts();
  }, []);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className={styles.sectionTitle}>Product Categories</h1>
        <p className="text-center text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Browse our selection of customizable products across different categories. 
          Select a category to see available products.
        </p>
      </div>
      
      <div className={styles.productGrid}>
        {categories.map((category) => {
          const hasProducts = categoriesWithProducts[category.id] || false;
          
          // For categories with no products
          if (!hasProducts) {
            return (
              <div 
                key={category.id} 
                className={`${styles.productCard} opacity-70 cursor-not-allowed`}
              >
                <div className={styles.productImageContainer}>
                  <div className="opacity-40">{category.icon}</div>
                </div>
                <div className="p-4">
                  <h3 className={styles.productTitle}>
                    {category.name}
                    <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">
                      Coming Soon
                    </span>
                  </h3>
                  <p className={`${styles.productDescription} opacity-70`}>
                    {category.description}
                  </p>
                </div>
              </div>
            );
          }
          
          // For categories with products
          return (
            <Link 
              key={category.id} 
              href={`/categories/${category.id}`} 
              className="group"
            >
              <div className={styles.productCard}>
                <div className={styles.productImageContainer}>
                  {category.icon}
                </div>
                <div className="p-4">
                  <h3 className={styles.productTitle}>
                    {category.name}
                  </h3>
                  <p className={styles.productDescription}>
                    {category.description}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
} 