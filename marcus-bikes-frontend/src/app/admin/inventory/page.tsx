'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface InventoryItem {
  id: number;
  option_id: number;
  quantity: number;
  low_stock_threshold: number;
  stock_status: string;
  // The option field doesn't appear to be in the API response
}

// To properly display inventory information, we need to fetch option data separately
interface Option {
  id: number;
  option_id: string;
  name: string;
  component_id: number;
}

interface Component {
  id: number;
  component_id: string;
  name: string;
  product_id: string;
}

interface Product {
  id: string;
  name: string;
  category: string;
}

export default function AdminInventory() {
  const router = useRouter();
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [options, setOptions] = useState<Record<number, Option>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [stockFilter, setStockFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [editItem, setEditItem] = useState<number | null>(null);
  const [editValues, setEditValues] = useState<{ quantity: number; threshold: number }>({ quantity: 0, threshold: 5 });

  useEffect(() => {
    const fetchInventory = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('adminToken');
        
        // Fetch inventory data
        const inventoryResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/inventory`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!inventoryResponse.ok) throw new Error('Failed to fetch inventory');
        const inventoryData = await inventoryResponse.json();
        console.log('Inventory data received:', inventoryData);
        setInventory(inventoryData);
        
        // Fetch options data to display names
        try {
          const optionsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/options`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (optionsResponse.ok) {
            const optionsData = await optionsResponse.json();
            // Create a lookup object by option ID
            const optionsMap: Record<number, Option> = {};
            optionsData.forEach((option: Option) => {
              optionsMap[option.id] = option;
            });
            setOptions(optionsMap);
          }
        } catch (optionsError) {
          console.error('Error fetching options:', optionsError);
          // Continue with inventory data even if options fetch fails
        }
        
      } catch (error) {
        console.error('Error fetching inventory:', error);
        setError('Failed to load inventory data');
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, []);

  const handleUpdateInventory = async (id: number) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/inventory/option/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          quantity: editValues.quantity,
          low_stock_threshold: editValues.threshold,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update inventory');
      }

      const updatedItem = await response.json();
      
      // Update the item in the state
      setInventory(prev => prev.map(item => 
        item.option_id === id ? { ...item, ...updatedItem } : item
      ));
      
      setEditItem(null);
    } catch (error) {
      console.error('Error updating inventory:', error);
      setError('Failed to update inventory');
    }
  };

  // Filter the inventory data
  const filteredInventory = inventory
    .filter(item => 
      searchTerm === '' || 
      // If we have option data, search by name
      (options[item.option_id]?.name?.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .filter(item => categoryFilter === 'all') // Simplified since we might not have category data
    .filter(item => {
      if (stockFilter === 'all') return true;
      if (stockFilter === 'in_stock') return item.stock_status === 'in_stock';
      if (stockFilter === 'limited_stock') return item.stock_status === 'limited_stock';
      if (stockFilter === 'out_of_stock') return item.stock_status === 'out_of_stock';
      return true;
    });

  if (loading) {
    return <div className="text-center py-10">Loading inventory data...</div>;
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
      <h1 className="text-3xl font-bold mb-8">Inventory Management</h1>

      <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
        <div className="p-4 border-b flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="flex space-x-2">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All Categories</option>
              <option value="bicycle">Bicycles</option>
              <option value="ski">Skis</option>
              <option value="surfboard">Surfboards</option>
              <option value="rollerskate">Roller Skates</option>
            </select>
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All Stock Status</option>
              <option value="in_stock">In Stock</option>
              <option value="limited_stock">Limited Stock</option>
              <option value="out_of_stock">Out of Stock</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Option
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredInventory.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    No inventory items found.
                  </td>
                </tr>
              ) : (
                filteredInventory.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {options[item.option_id]?.name || `Option ID: ${item.option_id}`}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editItem === item.option_id ? (
                        <input
                          type="number"
                          min="0"
                          value={editValues.quantity}
                          onChange={(e) => setEditValues({...editValues, quantity: parseInt(e.target.value) || 0})}
                          className="w-20 px-2 py-1 border border-gray-300 rounded-md"
                        />
                      ) : (
                        <div className="text-sm text-gray-900">{item.quantity}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                        ${item.stock_status === 'in_stock' ? 'bg-green-100 text-green-800' : 
                          item.stock_status === 'limited_stock' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-red-100 text-red-800'}`}
                      >
                        {item.stock_status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </span>
                      {editItem === item.option_id && (
                        <div className="mt-1">
                          <label className="text-xs text-gray-500 block">Low Stock Threshold:</label>
                          <input
                            type="number"
                            min="1"
                            value={editValues.threshold}
                            onChange={(e) => setEditValues({...editValues, threshold: parseInt(e.target.value) || 1})}
                            className="w-20 px-2 py-1 border border-gray-300 rounded-md mt-1"
                          />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {editItem === item.option_id ? (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleUpdateInventory(item.option_id)}
                            className="text-green-600 hover:text-green-900"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditItem(null)}
                            className="text-gray-600 hover:text-gray-900"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setEditItem(item.option_id);
                            setEditValues({
                              quantity: item.quantity,
                              threshold: item.low_stock_threshold
                            });
                          }}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Edit
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 