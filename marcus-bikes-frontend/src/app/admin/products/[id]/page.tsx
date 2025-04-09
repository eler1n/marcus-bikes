'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import CollapsibleSection from '@/app/components/CollapsibleSection';
import PriceRulesSection from '@/app/components/PriceRulesSection';
import DependenciesSection, { Dependency } from '@/app/components/DependenciesSection';

interface Component {
  id: number;
  component_id: number;
  name: string;
  description: string;
  options: Array<{
    id: number;
    option_id: number;
    name: string;
    price: number;
  }>;
}

interface ProductDependency {
  id: number;
  source_component_id: number;
  source_option_id: number;
  target_component_id: number;
  target_option_id: number;
  type: string;
}

interface PriceRule {
  id?: number;
  component_id: number;
  option_id: number;
  dependent_component_id: number;
  dependent_option_id: number;
  price: number;
  product_id?: number;
}

interface Product {
  id: number;
  name: string;
  description: string;
  category: string;
  base_price: number;
  components: Component[];
  dependencies: ProductDependency[];
  price_rules: PriceRule[];
}

interface FormErrors {
  id?: string;
  name?: string;
  description?: string;
  category?: string;
  base_price?: string;
  components?: string;
}

export default function ProductEditPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const isNewProduct = params.id === 'new';
  
  const [product, setProduct] = useState<Product>({
    id: 0,
    name: '',
    description: '',
    category: 'bicycle',
    base_price: 0,
    components: [],
    dependencies: [],
    price_rules: []
  });
  
  const [loading, setLoading] = useState(!isNewProduct);
  const [error, setError] = useState<string | null>(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${params.id}`);
        
        if (!response.ok) throw new Error('Failed to fetch product');
        
        const data = await response.json();
        
        // Map backend API response to our frontend model structure
        const mappedData = {
          ...data,
          id: typeof data.id === 'string' ? parseIdToNumber(data.id) : data.id,
          base_price: data.basePrice || 0, // Map basePrice to base_price for frontend model
          // Ensure components have numeric IDs
          components: data.components ? data.components.map((comp: any) => {
            const componentId = typeof comp.component_id === 'string' 
              ? parseIdToNumber(comp.component_id) 
              : (comp.component_id || 0);
              
            return {
              ...comp,
              id: typeof comp.id === 'string' ? parseIdToNumber(comp.id) : comp.id,
              component_id: componentId,
              options: comp.options ? comp.options.map((opt: any) => {
                const optionId = typeof opt.option_id === 'string'
                  ? parseIdToNumber(opt.option_id)
                  : (opt.option_id || 0);
                  
                return {
                  ...opt,
                  id: typeof opt.id === 'string' ? parseIdToNumber(opt.id) : opt.id,
                  option_id: optionId,
                  price: typeof opt.price === 'string' ? parseFloat(opt.price) : opt.price
                };
              }) : []
            };
          }) : [],
          // Map dependencies with numeric IDs
          dependencies: data.dependencies?.map((dep: any) => {
            return {
              id: typeof dep.id === 'string' ? parseIdToNumber(dep.id) : (dep.id || 0),
              source_component_id: typeof dep.sourceComponentId === 'string' 
                ? parseIdToNumber(dep.sourceComponentId) 
                : (dep.sourceComponentId || 0),
              source_option_id: typeof dep.sourceOptionId === 'string'
                ? parseIdToNumber(dep.sourceOptionId)
                : (dep.sourceOptionId || 0),
              target_component_id: typeof dep.targetComponentId === 'string'
                ? parseIdToNumber(dep.targetComponentId)
                : (dep.targetComponentId || 0),
              target_option_id: typeof dep.targetOptionId === 'string'
                ? parseIdToNumber(dep.targetOptionId)
                : (dep.targetOptionId || 0),
              type: dep.type || 'requires'
            };
          }) || [],
          // Add any existing price rules with numeric IDs
          price_rules: data.priceRules?.map((rule: any) => {
            const componentId = typeof rule.componentId === 'string' 
              ? parseIdToNumber(rule.componentId) 
              : (rule.componentId || 0);
              
            const optionId = typeof rule.optionId === 'string'
              ? parseIdToNumber(rule.optionId)
              : (rule.optionId || 0);
              
            const dependentComponentId = typeof rule.dependentComponentId === 'string'
              ? parseIdToNumber(rule.dependentComponentId)
              : (rule.dependentComponentId || 0);
              
            const dependentOptionId = typeof rule.dependentOptionId === 'string'
              ? parseIdToNumber(rule.dependentOptionId)
              : (rule.dependentOptionId || 0);
            
            return {
              id: typeof rule.id === 'string' ? parseIdToNumber(rule.id) : (rule.id || 0),
              component_id: componentId,
              option_id: optionId,
              dependent_component_id: dependentComponentId,
              dependent_option_id: dependentOptionId,
              price: typeof rule.price === 'string' ? parseFloat(rule.price) : (rule.price || 0),
              product_id: parseIdToNumber(params.id)
            };
          }) || []
        };
        
        setProduct(mappedData);
      } catch (error) {
        console.error('Error fetching product:', error);
        setError('Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    if (!isNewProduct) {
      fetchProduct();
    }
  }, [params.id, isNewProduct]);

  const validateForm = () => {
    const errors: FormErrors = {};
    
    if (isNewProduct && (!product.id || product.id === 0)) {
      // Auto-generate ID from name if not provided
      const generatedId = product.name.trim()
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');
      
      if (generatedId) {
        // Silently set the ID based on the name - use a numeric hash of the name
        const numericId = Math.abs(generatedId.split('').reduce((acc: number, char: string) => {
          return acc + char.charCodeAt(0);
        }, 0));
        
        setProduct(prev => ({ ...prev, id: numericId }));
      } else {
        errors.id = 'Product ID is required';
      }
    }
    
    if (!product.name.trim()) {
      errors.name = 'Product name is required';
    }
    
    if (!product.description.trim()) {
      errors.description = 'Product description is required';
    }
    
    if (!product.category) {
      errors.category = 'Category is required';
    }
    
    if (product.base_price < 0) {
      errors.base_price = 'Base price cannot be negative';
    }
    
    if (product.components.length === 0) {
      errors.components = 'At least one component is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    
    setSaveLoading(true);
    
    try {
      const token = localStorage.getItem('adminToken');
      const url = isNewProduct 
        ? `${process.env.NEXT_PUBLIC_API_URL}/products` 
        : `${process.env.NEXT_PUBLIC_API_URL}/products/${params.id}`;
      
      const method = isNewProduct ? 'POST' : 'PUT';

      // Format data for backend API - ensure components and options have correct IDs for new entries
      const productData = {
        ...product,
        // For backend API, make sure base_price is sent correctly
        base_price: product.base_price || 0,
        
        // For update requests, we need to ensure components have proper structure
        components: product.components.map(component => ({
          ...component,
          component_id: component.component_id || Date.now(),
          options: component.options.map(option => ({
            ...option,
            option_id: option.option_id || Date.now()
          }))
        })),
        // Format dependencies for the API
        dependencies: product.dependencies.map(dep => ({
          id: dep.id,
          sourceComponentId: dep.source_component_id,
          sourceOptionId: dep.source_option_id,
          targetComponentId: dep.target_component_id,
          targetOptionId: dep.target_option_id,
          type: dep.type,
          product_id: product.id
        })),
        // Format price rules for the API with numeric IDs
        price_rules: product.price_rules.map(rule => ({
          id: rule.id,
          component_id: rule.component_id,
          option_id: rule.option_id,
          dependent_component_id: rule.dependent_component_id,
          dependent_option_id: rule.dependent_option_id,
          price: rule.price,
          product_id: product.id
        }))
      };
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response from server:', errorData);
        throw new Error(errorData.detail || 'Failed to save product');
      }

      // Save price rules if needed
      if (product.price_rules.length > 0 && !isNewProduct) {
        // Handle price rule creation/update - this might be handled by the backend
        // in a single call, but if not, you can make additional API calls here
      }

      const savedData = await response.json();

      router.push('/admin/products');
    } catch (error: any) {
      console.error('Error saving product:', error);
      setError(error.message || 'Failed to save product');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // For numeric fields, parse the value
    if (name === 'base_price') {
      setProduct({ ...product, [name]: parseFloat(value) || 0 });
    } else {
      setProduct({ ...product, [name]: value });
    }
  };

  // Hidden function to update product ID (for programmatic use)
  const updateProductId = (newId: number) => {
    if (isNewProduct) {
      setProduct({ ...product, id: newId });
    }
  };

  const addComponent = () => {
    const timestamp = Date.now();
    const newComponentId = timestamp;
    const newComponent = {
      id: timestamp,
      component_id: newComponentId,
      name: '',
      description: '',
      options: []
    };
    setProduct({
      ...product,
      components: [...product.components, newComponent]
    });
  };

  const updateComponent = (index: number, field: string, value: string) => {
    const updatedComponents = [...product.components];
    updatedComponents[index] = {
      ...updatedComponents[index],
      [field]: value
    };
    
    // If it's a new component and the name is being updated, update the component_id too
    if (field === 'name' && (!updatedComponents[index].component_id || updatedComponents[index].component_id === 0)) {
      // Convert the name to a numeric hash
      const numericId = Math.abs(value.toLowerCase().split('').reduce((acc: number, char: string) => {
        return acc + char.charCodeAt(0);
      }, 0));
      
      updatedComponents[index].component_id = numericId;
    }
    
    setProduct({
      ...product,
      components: updatedComponents
    });
  };

  const removeComponent = (index: number) => {
    const updatedComponents = [...product.components];
    updatedComponents.splice(index, 1);
    setProduct({
      ...product,
      components: updatedComponents
    });
  };

  const addOption = (componentIndex: number) => {
    const timestamp = Date.now();
    const newOptionId = timestamp;
    const updatedComponents = [...product.components];
    updatedComponents[componentIndex].options.push({
      id: timestamp,
      option_id: newOptionId,
      name: '',
      price: 0
    });
    
    setProduct({
      ...product,
      components: updatedComponents
    });
  };

  const updateOption = (componentIndex: number, optionIndex: number, field: string, value: any) => {
    const updatedComponents = [...product.components];
    const option = updatedComponents[componentIndex].options[optionIndex];
    
    // For price field, ensure it's a number
    if (field === 'price') {
      const numericValue = parseFloat(value);
      updatedComponents[componentIndex].options[optionIndex] = {
        ...option,
        [field]: isNaN(numericValue) ? 0 : numericValue
      };
    } else {
      updatedComponents[componentIndex].options[optionIndex] = {
        ...option,
        [field]: value
      };
      
      // If it's a new option and the name is being updated, update the option_id too
      if (field === 'name' && (!option.option_id || option.option_id === 0)) {
        // Convert the name to a numeric hash
        const numericId = Math.abs(value.toLowerCase().split('').reduce((acc: number, char: string) => {
          return acc + char.charCodeAt(0);
        }, 0));
        
        updatedComponents[componentIndex].options[optionIndex].option_id = numericId;
      }
    }
    
    setProduct({
      ...product,
      components: updatedComponents
    });
  };

  const removeOption = (componentIndex: number, optionIndex: number) => {
    const updatedComponents = [...product.components];
    updatedComponents[componentIndex].options.splice(optionIndex, 1);
    setProduct({
      ...product,
      components: updatedComponents
    });
  };

  const handlePriceRulesChange = (priceRules: PriceRule[]) => {
    // Use deep comparison to avoid unnecessary state updates
    const currentRulesJSON = JSON.stringify(priceRules);
    const currentProductRulesJSON = JSON.stringify(product.price_rules);
    
    // Only update state if the rules have actually changed
    if (currentRulesJSON !== currentProductRulesJSON) {
      setProduct({
        ...product,
        price_rules: priceRules
      });
    }
  };

  const handleDependenciesChange = (dependencies: Dependency[]) => {
    // Map dependencies from the DependenciesSection format to our product format
    const productDependencies: ProductDependency[] = dependencies.map(dep => ({
      id: dep.id || 0,
      source_component_id: dep.source_component_id,
      source_option_id: dep.source_option_id,
      target_component_id: dep.target_component_id,
      target_option_id: dep.target_option_id,
      type: dep.type
    }));
    
    // Use deep comparison to avoid unnecessary state updates
    const currentDepsJSON = JSON.stringify(productDependencies);
    const currentProductDepsJSON = JSON.stringify(product.dependencies);
    
    // Only update state if the dependencies have actually changed
    if (currentDepsJSON !== currentProductDepsJSON) {
      setProduct({
        ...product,
        dependencies: productDependencies
      });
    }
  };

  // Add this function to convert string IDs to numbers
  const parseIdToNumber = (id: string | null | undefined): number => {
    if (!id) return 0;
    const parsed = parseInt(id, 10);
    return isNaN(parsed) ? 0 : parsed;
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{isNewProduct ? 'Add New Product' : 'Edit Product'}</h1>
        <div>
          <Link href="/admin/products" className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 mr-2">
            Cancel
          </Link>
          <button
            onClick={handleSave}
            disabled={saveLoading}
            className={`px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition ${saveLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
          >
            {saveLoading ? 'Saving...' : 'Save Product'}
          </button>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6" role="alert">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}

      <CollapsibleSection title="Basic Information" defaultOpen={false}>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                name="category"
                value={product.category}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="bicycle">Bicycle</option>
                <option value="ski">Ski</option>
                <option value="surfboard">Surfboard</option>
                <option value="rollerskate">Rollerskate</option>
              </select>
              {formErrors.category && <p className="mt-1 text-sm text-red-600">{formErrors.category}</p>}
            </div>
          
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Name
              </label>
              <input
                type="text"
                name="name"
                value={product.name}
                onChange={handleInputChange}
                placeholder="e.g., Custom Mountain Bike"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
              {formErrors.name && <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>}
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={product.description}
              onChange={handleInputChange}
              rows={3}
              placeholder="Describe your product..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            {formErrors.description && <p className="mt-1 text-sm text-red-600">{formErrors.description}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Base Price ($)
            </label>
            <input
              type="number"
              name="base_price"
              value={product.base_price ?? 0}
              onChange={(e) => {
                // Ensure we always have a valid number
                const value = e.target.value;
                const parsedValue = parseFloat(value);
                setProduct({
                  ...product,
                  base_price: isNaN(parsedValue) ? 0 : parsedValue
                });
              }}
              min="0"
              step="0.01"
              className="w-full md:w-1/4 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            {formErrors.base_price && <p className="mt-1 text-sm text-red-600">{formErrors.base_price}</p>}
          </div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Components & Options" defaultOpen={false}>
        <div>
          <div className="flex justify-between items-center mb-4">
            <div></div> {/* Empty div for flex spacing */}
            <button
              onClick={addComponent}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              Add Component
            </button>
          </div>
          
          {formErrors.components && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
              <p>{formErrors.components}</p>
            </div>
          )}
          
          {product.components.length === 0 ? (
            <div className="text-center py-6 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg">
              <p className="text-gray-500">No components yet. Add components to create customizable parts of your product.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {product.components.map((component, componentIndex) => (
                <div key={component.component_id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="grid grid-cols-1 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Component Name
                          </label>
                          <input
                            type="text"
                            value={component.name}
                            onChange={(e) => updateComponent(componentIndex, 'name', e.target.value)}
                            placeholder="e.g., Frame Type, Wheel Type"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Description
                        </label>
                        <input
                          type="text"
                          value={component.description || ''}
                          onChange={(e) => updateComponent(componentIndex, 'description', e.target.value)}
                          placeholder="Brief description of this component"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                    </div>
                    <button
                      onClick={() => removeComponent(componentIndex)}
                      className="ml-4 text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                  
                  <div className="mt-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-md font-medium">Options</h3>
                      <button
                        onClick={() => addOption(componentIndex)}
                        className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 transition text-sm"
                      >
                        Add Option
                      </button>
                    </div>
                    
                    {component.options.length === 0 ? (
                      <div className="text-center py-4 bg-gray-50 border border-dashed border-gray-300 rounded-lg">
                        <p className="text-gray-500 text-sm">No options yet. Add options for this component.</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Name
                              </th>
                              <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Price
                              </th>
                              <th scope="col" className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {component.options.map((option, optionIndex) => (
                              <tr key={option.id}>
                                <td className="px-4 py-2 whitespace-nowrap">
                                  <input
                                    type="text"
                                    value={option.name}
                                    onChange={(e) => updateOption(componentIndex, optionIndex, 'name', e.target.value)}
                                    placeholder="Option name"
                                    className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
                                  />
                                </td>
                                <td className="px-4 py-2 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <span className="text-gray-500 mr-1">$</span>
                                    <input
                                      type="number"
                                      value={option.price}
                                      onChange={(e) => updateOption(componentIndex, optionIndex, 'price', e.target.value)}
                                      min="0"
                                      step="0.01"
                                      className="w-20 px-2 py-1 border border-gray-300 rounded-md text-sm"
                                    />
                                  </div>
                                </td>
                                <td className="px-4 py-2 whitespace-nowrap text-right">
                                  <button
                                    onClick={() => removeOption(componentIndex, optionIndex)}
                                    className="text-red-600 hover:text-red-800 text-sm"
                                  >
                                    Remove
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Dependencies" defaultOpen={false}>
        {(() => {
          // Create properly structured components for DependenciesSection
          const mappedComponents = product.components.map(comp => {
            // Important: We need to pass the actual component ID as the ID for component lookup
            return {
              id: comp.id,  // This must match the source_component_id in dependencies
              component_id: comp.component_id,
              name: comp.name,
              options: comp.options.map(opt => {
                return {
                  id: opt.id,  // Use the original opt.id instead of opt.option_id to match the dependencies
                  name: opt.name
                };
              })
            };
          });
          
          // Make sure the productId is a number
          const numericProductId = typeof product.id === 'string' 
            ? parseIdToNumber(product.id) 
            : (product.id || 0);
          
          // Map dependencies to the format expected by DependenciesSection
          const mappedDependencies = product.dependencies.map(dep => {
            return {
              id: dep.id,
              source_component_id: dep.source_component_id,
              source_option_id: dep.source_option_id,
              target_component_id: dep.target_component_id,
              target_option_id: dep.target_option_id,
              type: dep.type,
              product_id: numericProductId
            };
          });
          
          return (
            <DependenciesSection 
              productId={numericProductId}
              components={mappedComponents}
              initialDependencies={mappedDependencies}
              onDependenciesChange={handleDependenciesChange}
            />
          );
        })()}
      </CollapsibleSection>

      <CollapsibleSection title="Price Rules" defaultOpen={false}>
        {(() => {
          // Create properly structured components for PriceRulesSection
          const mappedComponents = product.components.map(comp => {
            return {
              id: comp.id,
              component_id: comp.component_id, 
              name: comp.name,
              options: comp.options.map(opt => {
                return {
                  id: opt.id, // Use the original opt.id instead of opt.option_id
                  name: opt.name
                };
              })
            };
          });
          
          // Make sure the productId is a number
          const numericProductId = typeof product.id === 'string' 
            ? parseIdToNumber(product.id) 
            : (product.id || 0);
          
          return (
            <PriceRulesSection 
              productId={numericProductId}
              components={mappedComponents}
              initialPriceRules={product.price_rules}
              onPriceRulesChange={handlePriceRulesChange}
            />
          );
        })()}
      </CollapsibleSection>
    </div>
  );
} 