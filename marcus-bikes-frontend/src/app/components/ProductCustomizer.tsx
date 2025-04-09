'use client';

import { useEffect } from 'react';
import { useCustomization } from '../lib/context/CustomizationContext';
import { Product } from '../lib/data/types';
import ComponentSelector from './ComponentSelector';

interface ProductCustomizerProps {
  product: Product;
}

export default function ProductCustomizer({ product }: ProductCustomizerProps) {
  const { 
    setProduct, 
    currentPrice, 
    validation, 
    addToCart 
  } = useCustomization();

  useEffect(() => {
    setProduct(product);
  }, [product, setProduct]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Preview */}
        <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col">
          <h2 className="text-2xl font-bold mb-4">{product.name}</h2>
          <div className="bg-gray-100 rounded-lg p-6 mb-4 flex-grow flex items-center justify-center">
            <div className="text-center">
              <p className="text-gray-500">Product preview will be shown here</p>
              {/* We could add an actual bicycle visualization here in the future */}
            </div>
          </div>
          <div className="border-t border-gray-200 pt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold">Total Price:</span>
              <span className="text-xl font-bold">{currentPrice.toFixed(2)} EUR</span>
            </div>
            {!validation.valid && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
                {validation.message}
              </div>
            )}
            <button
              onClick={addToCart}
              disabled={!validation.valid}
              className={`w-full py-3 px-4 rounded-lg text-white font-medium ${
                validation.valid
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              Add to Cart
            </button>
          </div>
        </div>

        {/* Component Selectors */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4">Customize Your {product.name}</h3>
          <div className="space-y-6">
            {product.components.map((component) => (
              <ComponentSelector 
                key={component.id} 
                component={component} 
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 