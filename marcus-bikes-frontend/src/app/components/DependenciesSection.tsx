'use client';

import { useState, useEffect, useRef, FC } from 'react';
import { XMarkIcon, PlusIcon } from '@heroicons/react/24/outline';

interface ComponentOption {
  id: number;
  name: string;
}

interface ProductComponent {
  id: number;
  component_id: number;
  name: string;
  options: ComponentOption[];
}

export interface Dependency {
  id?: number;
  source_component_id: number;
  source_option_id: number;
  target_component_id: number;
  target_option_id: number;
  type: string;
  product_id?: number;
}

interface DependenciesSectionProps {
  productId: number;
  components: ProductComponent[];
  initialDependencies: Dependency[];
  onDependenciesChange: (dependencies: Dependency[]) => void;
}

const DependenciesSection: FC<DependenciesSectionProps> = ({
  productId,
  components,
  initialDependencies,
  onDependenciesChange
}) => {
  const [dependencies, setDependencies] = useState<Dependency[]>(initialDependencies || []);
  const [filter, setFilter] = useState<string>('');
  const previousDependenciesRef = useRef<string>(JSON.stringify(initialDependencies || []));

  // Update internal state when initialDependencies changes from parent
  useEffect(() => {
    const initialDepsJSON = JSON.stringify(initialDependencies);
    const currentDepsJSON = JSON.stringify(dependencies);
    
    // Only update if the initial dependencies have changed and are different from current state
    if (initialDepsJSON !== currentDepsJSON) {
      setDependencies(initialDependencies || []);
    }
  }, [initialDependencies]);

  // Fix the infinite update loop by only calling onDependenciesChange when dependencies actually change
  useEffect(() => {
    // Use JSON.stringify to do a deep comparison of the arrays
    const currentDepsJSON = JSON.stringify(dependencies);
    
    // Only call onDependenciesChange if the dependencies have actually changed
    if (previousDependenciesRef.current !== currentDepsJSON) {
      onDependenciesChange(dependencies);
      previousDependenciesRef.current = currentDepsJSON;
    }
  }, [dependencies, onDependenciesChange]);

  const addDependency = () => {
    // Default to first component and option if available
    const firstComponent = components[0] || { id: 0, options: [] };
    let firstOption = { id: 0 };
    
    if (firstComponent.options && firstComponent.options.length > 0) {
      firstOption = firstComponent.options[0];
    }
    
    const secondComponent = components.length > 1 ? components[1] : firstComponent;
    let secondOption = { id: 0 };
    
    if (secondComponent.options && secondComponent.options.length > 0) {
      secondOption = secondComponent.options[0];
    }

    const newDependency: Dependency = {
      source_component_id: firstComponent.id,
      source_option_id: firstOption.id,
      target_component_id: secondComponent.id,
      target_option_id: secondOption.id,
      type: 'requires', // Default dependency type
      product_id: productId
    };
    
    // Apply normalization to the new dependency
    const normalizedDependency = normalizeDependencies([newDependency])[0];
    
    setDependencies([...dependencies, normalizedDependency]);
  };

  const updateDependency = (index: number, field: string, value: string | number) => {
    const updatedDependencies = [...dependencies];
    
    // Convert the value to a number when it should be a number
    const numericValue = field !== 'type' && typeof value === 'string' ? parseInt(value, 10) : value;
    
    if (field === 'source_component_id' && numericValue !== updatedDependencies[index].source_component_id) {
      // If source component changes, reset the source option to the first available option
      const component = components.find(c => c.id === numericValue);
      const firstOption = component?.options[0]?.id || 0;
      
      updatedDependencies[index] = {
        ...updatedDependencies[index],
        source_component_id: typeof numericValue === 'number' ? numericValue : parseInt(String(numericValue), 10),
        source_option_id: firstOption
      };
    } else if (field === 'target_component_id' && numericValue !== updatedDependencies[index].target_component_id) {
      // If target component changes, reset the target option
      const component = components.find(c => c.id === numericValue);
      const firstOption = component?.options[0]?.id || 0;
      
      updatedDependencies[index] = {
        ...updatedDependencies[index],
        target_component_id: typeof numericValue === 'number' ? numericValue : parseInt(String(numericValue), 10),
        target_option_id: firstOption
      };
    } else if (field === 'type') {
      // For type field, it's a string
      updatedDependencies[index] = {
        ...updatedDependencies[index],
        [field]: value as string
      };
    } else {
      // For all other numeric fields, ensure they are numbers
      updatedDependencies[index] = {
        ...updatedDependencies[index],
        [field]: typeof numericValue === 'number' ? numericValue : parseInt(String(numericValue), 10)
      };
    }
    
    setDependencies(updatedDependencies);
  };

  const removeDependency = (index: number) => {
    const updatedDependencies = [...dependencies];
    updatedDependencies.splice(index, 1);
    setDependencies(updatedDependencies);
  };

  const getComponentName = (componentId: number) => {
    const component = components.find(c => c.id === componentId);
    return component?.name || 'Unknown Component';
  };

  const getOptionName = (componentId: number, optionId: number) => {
    const component = components.find(c => c.id === componentId);
    const option = component?.options.find(o => o.id === optionId);
    return option?.name || 'Unknown Option';
  };

  const filteredDependencies = filter
    ? dependencies.filter(dep => 
        getComponentName(dep.source_component_id).toLowerCase().includes(filter.toLowerCase()) ||
        getOptionName(dep.source_component_id, dep.source_option_id).toLowerCase().includes(filter.toLowerCase()) ||
        getComponentName(dep.target_component_id).toLowerCase().includes(filter.toLowerCase()) ||
        getOptionName(dep.target_component_id, dep.target_option_id).toLowerCase().includes(filter.toLowerCase())
      )
    : dependencies;

  // Add this function to ensure dependencies have valid component and option IDs
  const normalizeDependencies = (deps: Dependency[]): Dependency[] => {
    if (!components.length) return deps;
    
    return deps.map(dep => {
      // Find valid components and options for this dependency
      let validSourceComponentId = dep.source_component_id;
      let validSourceOptionId = dep.source_option_id;
      let validTargetComponentId = dep.target_component_id;
      let validTargetOptionId = dep.target_option_id;
      
      // Validate source_component
      const sourceComponentExists = components.some(c => c.id === dep.source_component_id);
      if (!sourceComponentExists && components.length > 0) {
        validSourceComponentId = components[0].id;
      }
      
      // Validate source_option
      const sourceComponent = components.find(c => c.id === validSourceComponentId);
      const sourceOptionExists = sourceComponent?.options.some(o => o.id === dep.source_option_id);
      if (!sourceOptionExists && sourceComponent && sourceComponent.options.length > 0) {
        validSourceOptionId = sourceComponent.options[0].id;
      }
      
      // Validate target_component
      const targetComponentExists = components.some(c => c.id === dep.target_component_id);
      if (!targetComponentExists && components.length > 0) {
        validTargetComponentId = components[0].id;
      }
      
      // Validate target_option
      const targetComponent = components.find(c => c.id === validTargetComponentId);
      const targetOptionExists = targetComponent?.options.some(o => o.id === dep.target_option_id);
      if (!targetOptionExists && targetComponent && targetComponent.options.length > 0) {
        validTargetOptionId = targetComponent.options[0].id;
      }
      
      // Return normalized dependency
      return {
        ...dep,
        source_component_id: validSourceComponentId,
        source_option_id: validSourceOptionId,
        target_component_id: validTargetComponentId,
        target_option_id: validTargetOptionId
      };
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="w-64">
          <input
            type="text"
            placeholder="Filter dependencies..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <button 
          onClick={addDependency}
          className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
        >
          <PlusIcon className="h-5 w-5 mr-1" />
          Add Dependency
        </button>
      </div>

      {dependencies.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg">
          <p className="text-gray-500">No dependencies defined. Add dependencies to establish relationships between components.</p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  If This Component
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Has This Option
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dependency Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  This Component
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  With This Option
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDependencies.map((dependency, index) => {
                // Find the source component and its options
                const sourceComponent = components.find(c => c.id === dependency.source_component_id);
                const sourceOptions = sourceComponent ? sourceComponent.options : [];
                
                // Find the target component and its options
                const targetComponent = components.find(c => c.id === dependency.target_component_id);
                const targetOptions = targetComponent ? targetComponent.options : [];
                
                return (
                <tr key={dependency.id || index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={dependency.source_component_id}
                      onChange={(e) => updateDependency(index, 'source_component_id', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      {components.map((component) => (
                        <option key={component.id} value={component.id}>
                          {component.name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={dependency.source_option_id}
                      onChange={(e) => updateDependency(index, 'source_option_id', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      {sourceOptions.length > 0 ? (
                        sourceOptions.map((option) => (
                          <option key={option.id} value={option.id}>
                            {option.name}
                          </option>
                        ))
                      ) : (
                        <option value={0}>No options available</option>
                      )}
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={dependency.type}
                      onChange={(e) => updateDependency(index, 'type', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="requires">Requires</option>
                      <option value="excludes">Excludes</option>
                      <option value="recommends">Recommends</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={dependency.target_component_id}
                      onChange={(e) => updateDependency(index, 'target_component_id', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      {components.map((component) => (
                        <option key={component.id} value={component.id}>
                          {component.name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={dependency.target_option_id}
                      onChange={(e) => updateDependency(index, 'target_option_id', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      {targetOptions.length > 0 ? (
                        targetOptions.map((option) => (
                          <option key={option.id} value={option.id}>
                            {option.name}
                          </option>
                        ))
                      ) : (
                        <option value={0}>No options available</option>
                      )}
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button
                      onClick={() => removeDependency(index)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DependenciesSection; 