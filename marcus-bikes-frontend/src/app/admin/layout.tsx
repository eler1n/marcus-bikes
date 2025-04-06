'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  
  // Check if we're on the login page
  const isLoginPage = pathname === '/admin/login';
  
  useEffect(() => {
    // Skip authentication check for the login page
    if (isLoginPage) {
      setAuthenticated(false);
      return;
    }
    
    // Check if admin is authenticated
    const token = localStorage.getItem('adminToken');
    
    if (!token) {
      router.push('/admin/login');
      return;
    }
    
    // Verify token with backend
    const verifyAdmin = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/verify`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (!response.ok) {
          localStorage.removeItem('adminToken');
          router.push('/admin/login');
          return;
        }
        
        setAuthenticated(true);
      } catch (error) {
        console.error('Error verifying admin:', error);
        localStorage.removeItem('adminToken');
        router.push('/admin/login');
      }
    };
    
    verifyAdmin();
  }, [router, isLoginPage, pathname]);
  
  // If on login page, just render the children (login form)
  if (isLoginPage) {
    return <>{children}</>;
  }
  
  // For other admin pages, show loading until authenticated
  if (authenticated === null) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }
  
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-b from-blue-800 to-indigo-900 text-white p-4">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Marcus Bikes Admin</h1>
          <p className="text-sm opacity-70">Shop Management</p>
        </div>
        
        <nav className="space-y-2">
          <Link href="/admin" className="block py-2 px-4 rounded hover:bg-indigo-700 transition">
            Dashboard
          </Link>
          <Link href="/admin/products" className="block py-2 px-4 rounded hover:bg-indigo-700 transition">
            Products
          </Link>
          <Link href="/admin/inventory" className="block py-2 px-4 rounded hover:bg-indigo-700 transition">
            Inventory
          </Link>
          <Link href="/admin/orders" className="block py-2 px-4 rounded hover:bg-indigo-700 transition">
            Orders
          </Link>
          <button
            onClick={() => {
              localStorage.removeItem('adminToken');
              router.push('/admin/login');
            }}
            className="block w-full text-left py-2 px-4 rounded hover:bg-indigo-700 transition mt-8"
          >
            Logout
          </button>
        </nav>
      </div>
      
      {/* Main content */}
      <div className="flex-1 p-8">
        {children}
      </div>
    </div>
  );
} 