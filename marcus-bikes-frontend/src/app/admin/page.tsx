'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

// Define types for our statistics
interface DashboardStats {
  totalProducts: number;
  lowStockItems: number;
  totalOrders: number;
  pendingOrders: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    lowStockItems: 0,
    totalOrders: 0,
    pendingOrders: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const token = localStorage.getItem('adminToken');
        
        // Fetch products count
        const productsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`);
        const productsData = await productsResponse.json();
        
        // Fetch inventory with low stock
        const inventoryResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/inventory/low-stock`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const inventoryData = await inventoryResponse.json();
        
        // Fetch orders
        const ordersResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const ordersData = await ordersResponse.json();
        
        // Filter pending orders
        const pendingOrders = ordersData.filter((order: any) => order.status === 'pending');
        
        setStats({
          totalProducts: productsData.length,
          lowStockItems: inventoryData.length,
          totalOrders: ordersData.length,
          pendingOrders: pendingOrders.length,
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="text-center py-10">Loading dashboard data...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
        <p className="font-bold">Error</p>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Stats Cards */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-700">Total Products</h2>
          <p className="text-3xl font-bold text-indigo-600 mt-2">{stats.totalProducts}</p>
          <Link href="/admin/products" className="text-sm text-indigo-500 hover:underline mt-4 inline-block">
            View Products →
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-700">Low Stock Items</h2>
          <p className="text-3xl font-bold text-yellow-500 mt-2">{stats.lowStockItems}</p>
          <Link href="/admin/inventory" className="text-sm text-indigo-500 hover:underline mt-4 inline-block">
            Manage Inventory →
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-700">Total Orders</h2>
          <p className="text-3xl font-bold text-green-600 mt-2">{stats.totalOrders}</p>
          <Link href="/admin/orders" className="text-sm text-indigo-500 hover:underline mt-4 inline-block">
            View All Orders →
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-700">Pending Orders</h2>
          <p className="text-3xl font-bold text-orange-500 mt-2">{stats.pendingOrders}</p>
          <Link 
            href="/admin/orders?status=pending" 
            className="text-sm text-indigo-500 hover:underline mt-4 inline-block"
          >
            View Pending Orders →
          </Link>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/admin/products/new"
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition text-center"
          >
            Add New Product
          </Link>
          <Link
            href="/admin/inventory"
            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition text-center"
          >
            Update Inventory
          </Link>
          <Link
            href="/admin/orders?status=pending"
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition text-center"
          >
            Process Orders
          </Link>
        </div>
      </div>
    </div>
  );
} 