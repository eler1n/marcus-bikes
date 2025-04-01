'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useCustomization } from '../lib/context/CustomizationContext';
import { getProductById } from '../lib/api';
import { Product } from '../lib/data/types';

export default function ShoppingCart() {
  const { cart, cartTotal, removeFromCart, updateCartItemQuantity } = useCustomization();
  const [products, setProducts] = useState<Record<string, Product>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch all unique product IDs in the cart
    const productIds = [...new Set(cart.map(item => item.productId))];
    
    async function fetchProducts() {
      setLoading(true);
      try {
        const productsMap: Record<string, Product> = {};
        
        // Fetch each product in parallel
        await Promise.all(productIds.map(async (id) => {
          try {
            const product = await getProductById(id);
            productsMap[id] = product;
          } catch (error) {
            console.error(`Error fetching product ${id}:`, error);
          }
        }));
        
        setProducts(productsMap);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    }
    
    if (productIds.length > 0) {
      fetchProducts();
    }
  }, [cart]);

  if (cart.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
        <div className="text-center py-8">
          <p className="text-gray-500">Your cart is empty</p>
          <Link href="/" className="text-blue-600 hover:underline mt-2 inline-block">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
      
      <div className="space-y-4 mb-6">
        {cart.map((item, index) => {
          const product = products[item.productId];
          if (!product) return null;
          
          return (
            <div key={index} className="border border-gray-200 rounded-lg p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <h3 className="font-medium">{product.name}</h3>
                <div className="text-sm text-gray-600 mt-1">
                  {Object.entries(item.selectedOptions).map(([componentId, optionId]) => {
                    const component = product.components.find(c => c.id === componentId);
                    const option = component?.options.find(o => o.id === optionId);
                    if (!component || !option) return null;
                    
                    return (
                      <div key={componentId} className="flex justify-between">
                        <span>{component.name}:</span>
                        <span>{option.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div className="flex items-center">
                <button 
                  onClick={() => updateCartItemQuantity(index, item.quantity - 1)}
                  className="px-2 py-1 bg-gray-200 rounded"
                  disabled={item.quantity <= 1}
                >
                  -
                </button>
                <span className="mx-2">{item.quantity}</span>
                <button 
                  onClick={() => updateCartItemQuantity(index, item.quantity + 1)}
                  className="px-2 py-1 bg-gray-200 rounded"
                >
                  +
                </button>
              </div>
              
              <div className="flex flex-col justify-between items-end">
                <div>
                  <span className="font-medium">{(item.price * item.quantity).toFixed(2)} EUR</span>
                  <span className="block text-xs text-gray-500">
                    {item.price.toFixed(2)} EUR each
                  </span>
                </div>
                <button 
                  onClick={() => removeFromCart(index)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Remove
                </button>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="border-t border-gray-200 pt-4">
        <div className="flex justify-between items-center text-xl font-bold mb-4">
          <span>Total:</span>
          <span>{cartTotal.toFixed(2)} EUR</span>
        </div>
        
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg">
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
} 