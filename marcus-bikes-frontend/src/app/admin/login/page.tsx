'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminLogin() {
  const router = useRouter();
  const [username, setUsername] = useState('marcus');
  const [password, setPassword] = useState('bike-shop-owner');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [bypassLoading, setBypassLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  // Check if API is available
  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/health`, { 
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          // Set a timeout to avoid waiting too long
          signal: AbortSignal.timeout(5000)
        });
        
        if (response.ok) {
          setApiStatus('online');
        } else {
          setApiStatus('offline');
        }
      } catch (error) {
        console.error('API check error:', error);
        setApiStatus('offline');
      }
    };
    
    checkApiStatus();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || 'Failed to login');
      }

      const data = await response.json();
      localStorage.setItem('adminToken', data.access_token);
      
      // Store expiration time
      const expiresAt = new Date(data.expires_at).getTime();
      localStorage.setItem('adminTokenExpiry', expiresAt.toString());
      
      router.push('/admin');
    } catch (error: any) {
      setError(error.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBypass = () => {
    setBypassLoading(true);
    setError(null);
    
    // Create a mock token (only for development)
    const mockToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJtYXJjdXMiLCJuYW1lIjoiTWFyY3VzIChCaWtlIFNob3AgT3duZXIpIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNjE2MTUxOTM1LCJleHAiOjE2NDc2ODc5MzV9.7MjSO_RFe9ozgTYgbpyIFfgQaeG2_0tvDgfIVt7XFEM";
    
    try {
      localStorage.setItem('adminToken', mockToken);
      
      // Set a dummy expiry 24 hours from now
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);
      localStorage.setItem('adminTokenExpiry', expiresAt.getTime().toString());
      
      // Short delay for UI feedback
      setTimeout(() => {
        router.push('/admin');
      }, 500);
    } catch (error: any) {
      setError('Failed to set mock token. ' + error.message);
      setBypassLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">m Admin</h1>
          <p className="text-gray-600">Login to manage your shop</p>
          
          {/* API Status Indicator */}
          {apiStatus === 'checking' && (
            <div className="mt-2 text-xs text-gray-500">Checking API connection...</div>
          )}
          {apiStatus === 'online' && (
            <div className="mt-2 text-xs text-green-500 flex items-center justify-center">
              <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-1"></span>
              API connected
            </div>
          )}
          {apiStatus === 'offline' && (
            <div className="mt-2 text-xs text-red-500 flex items-center justify-center">
              <span className="inline-block w-2 h-2 bg-red-500 rounded-full mr-1"></span>
              API offline - use bypass option
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div className="space-y-3">
            <button
              type="submit"
              disabled={loading || (apiStatus === 'offline')}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
            
            {/* Development bypass option */}
            <button
              type="button"
              onClick={handleBypass}
              disabled={bypassLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
            >
              {bypassLoading ? 'Accessing...' : 'Development Access (Bypass API)'}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-indigo-600 hover:text-indigo-500">
            Return to Store
          </Link>
        </div>
        
        <div className="mt-4 pt-3 border-t border-gray-200">
          <div className="text-xs text-gray-500">
            <p>Default credentials:</p>
            <p className="mt-1">Username: marcus</p>
            <p>Password: bike-shop-owner</p>
          </div>
        </div>
      </div>
    </div>
  );
} 