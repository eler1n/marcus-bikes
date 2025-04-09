'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCustomization } from '../lib/context/CustomizationContext';
import { useState, useEffect } from 'react';
import ThemeToggle from './ThemeToggle';
import styles from '../styles/header.module.css';

export default function Header() {
  const pathname = usePathname();
  const { cart } = useCustomization();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Check if user is on admin page or logged in as admin
  useEffect(() => {
    const checkAdminStatus = () => {
      const isAdminPage = pathname?.startsWith('/admin');
      const hasAdminToken = typeof window !== 'undefined' && localStorage.getItem('adminToken') !== null;
      setIsAdmin(isAdminPage || hasAdminToken);
    };
    
    checkAdminStatus();
  }, [pathname]);
  
  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Admin panel is visible if user is on admin page or logged in
  const showAdminLink = isAdmin || pathname === '/admin/login';

  return (
    <header className={`${styles.header} ${isScrolled ? styles.headerScrolled : ''}`}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoText}>Marcus Bikes</span>
        </Link>
        
        {/* Mobile menu button */}
        <button 
          className={styles.menuButton} 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-expanded={isMenuOpen}
          aria-label="Toggle menu"
        >
          <span className={`${styles.menuBar} ${isMenuOpen ? styles.menuBarTop : ''}`}></span>
          <span className={`${styles.menuBar} ${isMenuOpen ? styles.menuBarMiddle : ''}`}></span>
          <span className={`${styles.menuBar} ${isMenuOpen ? styles.menuBarBottom : ''}`}></span>
        </button>
        
        {/* Navigation menu */}
        <nav className={`${styles.nav} ${isMenuOpen ? styles.navOpen : ''}`}>
          <div className={styles.navLinks}>
            <Link
              href="/"
              className={pathname === '/' ? styles.activeNavLink : styles.navLink}
              aria-current={pathname === '/' ? 'page' : undefined}
            >
              Home
            </Link>
            <Link
              href="/categories"
              className={pathname === '/categories' ? styles.activeNavLink : styles.navLink}
              aria-current={pathname === '/categories' ? 'page' : undefined}
            >
              Categories
            </Link>
            <Link
              href="/about"
              className={pathname === '/about' ? styles.activeNavLink : styles.navLink}
              aria-current={pathname === '/about' ? 'page' : undefined}
            >
              About
            </Link>
            {showAdminLink && (
              <Link
                href="/admin"
                className={pathname?.startsWith('/admin') ? styles.activeNavLink : styles.navLink}
                aria-current={pathname?.startsWith('/admin') ? 'page' : undefined}
              >
                Admin
              </Link>
            )}
          </div>
          
          <div className={styles.navActions}>
            <ThemeToggle />
            <Link href="/cart" className={styles.cartLink} aria-label={`Shopping cart with ${cart.length} items`}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={styles.cartIcon}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              {cart.length > 0 && (
                <span className={styles.cartBadge} aria-hidden="true">
                  {cart.length}
                </span>
              )}
            </Link>
          </div>
        </nav>
      </div>
      
      {/* Backdrop for mobile menu */}
      {isMenuOpen && (
        <div 
          className={styles.menuBackdrop}
          onClick={() => setIsMenuOpen(false)}
          aria-hidden="true"
        />
      )}
    </header>
  );
} 