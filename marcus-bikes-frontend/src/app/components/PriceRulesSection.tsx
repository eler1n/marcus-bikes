'use client';

import { useState, useEffect, useRef, FC } from 'react';
import { XMarkIcon, PlusIcon } from '@heroicons/react/24/outline';

interface ComponentOption {
  id: number;
  name: string;
}

interface ProductComponent {
  id: number;
  name: string;
  options: ComponentOption[];
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

interface PriceRulesSectionProps {
  productId: number;
  components: ProductComponent[];
  initialPriceRules: PriceRule[];
  onPriceRulesChange: (priceRules: PriceRule[]) => void;
}

const PriceRulesSection: FC<PriceRulesSectionProps> = ({
  productId,
  components,
  initialPriceRules,
  onPriceRulesChange
}) => {
  const [priceRules, setPriceRules] = useState<PriceRule[]>(initialPriceRules || []);
  const [filter, setFilter] = useState<string>('');
  const previousRulesRef = useRef<string>(JSON.stringify(initialPriceRules || []));

  // Update internal state when initialPriceRules changes from parent
  useEffect(() => {
    const initialRulesJSON = JSON.stringify(initialPriceRules);
    const currentRulesJSON = JSON.stringify(priceRules);
    
    // Only update if the initial rules have changed and are different from current state
    if (initialRulesJSON !== currentRulesJSON) {
      setPriceRules(initialPriceRules || []);
    }
  }, [initialPriceRules]);

  // Fix the infinite update loop by only calling onPriceRulesChange when priceRules actually change
  useEffect(() => {
    // Use JSON.stringify to do a deep comparison of the arrays
    const currentRulesJSON = JSON.stringify(priceRules);
    
    // Only call onPriceRulesChange if the rules have actually changed
    if (previousRulesRef.current !== currentRulesJSON) {
      onPriceRulesChange(priceRules);
      previousRulesRef.current = currentRulesJSON;
    }
  }, [priceRules, onPriceRulesChange]);

  const addPriceRule = () => {
    // Default to first component and option if available
    const firstComponent = components[0] || { id: 0, component_id: 0, options: [] };
    let firstOption = { id: 0 };
    
    if (firstComponent.options && firstComponent.options.length > 0) {
      firstOption = firstComponent.options[0];
    }
    
    const secondComponent = components.length > 1 ? components[1] : firstComponent;
    let secondOption = { id: 0 };
    
    if (secondComponent.options && secondComponent.options.length > 0) {
      secondOption = secondComponent.options[0];
    }
    
    console.log('Adding new rule with:', {
      firstComponent: {
        id: firstComponent.id,
        component_id: firstComponent.id,
        name: firstComponent.name,
        optionsCount: firstComponent.options?.length || 0
      },
      firstOption,
      secondComponent: {
        id: secondComponent.id,
        component_id: secondComponent.id,
        name: secondComponent.name,
        optionsCount: secondComponent.options?.length || 0
      },
      secondOption
    });

    const newRule: PriceRule = {
      component_id: firstComponent.id,
      option_id: firstOption.id,
      dependent_component_id: secondComponent.id,
      dependent_option_id: secondOption.id,
      price: 0,
      product_id: productId
    };
    
    // Apply normalization to the new rule
    const normalizedRule = normalizeRules([newRule])[0];
    
    setPriceRules([...priceRules, normalizedRule]);
  };

  const updatePriceRule = (index: number, field: string, value: string | number) => {
    const updatedRules = [...priceRules];
    
    // Convert the value to a number when it should be a number
    const numericValue = typeof value === 'string' ? parseInt(value, 10) : value;
    
    
    if (field === 'component_id' && numericValue !== updatedRules[index].component_id) {
      // If component changes, reset the option to the first available option
      // console.log(`Looking for component with component_id=${numericValue}`);
      components.forEach(c => console.log(`Available component: id=${c.id}, component_id=${c.id}, name=${c.name}`));
      
      const component = components.find(c => c.id === numericValue);
      const firstOption = component?.options[0]?.id || 0;
      
      // console.log('Component changed:', numericValue, 'First option:', firstOption, 'Component:', component);
      
      updatedRules[index] = {
        ...updatedRules[index],
        [field]: numericValue,
        option_id: firstOption
      };
    } else if (field === 'dependent_component_id' && numericValue !== updatedRules[index].dependent_component_id) {
      // If dependent component changes, reset the dependent option
      // console.log(`Looking for dependent component with component_id=${numericValue}`);
      // components.forEach(c => console.log(`Available component: id=${c.id}, component_id=${c.id}, name=${c.name}`));
      
      const component = components.find(c => c.id === numericValue);
      const firstOption = component?.options[0]?.id || 0;
      
      // console.log('Dependent component changed:', numericValue, 'First option:', firstOption, 'Component:', component);
      
      updatedRules[index] = {
        ...updatedRules[index],
        [field]: numericValue,
        dependent_option_id: firstOption
      };
    } else if (field === 'price') {
      // For price, ensure it's a number
      updatedRules[index] = {
        ...updatedRules[index],
        price: typeof numericValue === 'number' ? numericValue : 0
      };
    } else {
      // For all other fields, just update the value as a number
      updatedRules[index] = {
        ...updatedRules[index],
        [field]: numericValue
      };
    }
    
    // console.log('Updated rule:', updatedRules[index]);
    setPriceRules(updatedRules);
  };

  const removePriceRule = (index: number) => {
    const updatedRules = [...priceRules];
    updatedRules.splice(index, 1);
    setPriceRules(updatedRules);
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

  const filteredRules = filter
    ? priceRules.filter(rule => 
        getComponentName(rule.component_id).toLowerCase().includes(filter.toLowerCase()) ||
        getOptionName(rule.component_id, rule.option_id).toLowerCase().includes(filter.toLowerCase()) ||
        getComponentName(rule.dependent_component_id).toLowerCase().includes(filter.toLowerCase()) ||
        getOptionName(rule.dependent_component_id, rule.dependent_option_id).toLowerCase().includes(filter.toLowerCase())
      )
    : priceRules;

  // Add this function to ensure price rules have valid component and option IDs
  const normalizeRules = (rules: PriceRule[]): PriceRule[] => {
    if (!components.length) return rules;
    
    return rules.map(rule => {
      // Find valid components and options for this rule
      let validComponentId = rule.component_id;
      let validOptionId = rule.option_id;
      let validDependentComponentId = rule.dependent_component_id;
      let validDependentOptionId = rule.dependent_option_id;
      
      // Validate component_id
      const componentExists = components.some(c => c.id === rule.component_id);
      if (!componentExists && components.length > 0) {
        validComponentId = components[0].id;
        console.log(`Normalizing rule: component_id ${rule.component_id} not found, using ${validComponentId} instead`);
      }
      
      // Validate option_id
      const component = components.find(c => c.id === validComponentId);
      const optionExists = component?.options.some(o => o.id === rule.option_id);
      if (!optionExists && component && component.options.length > 0) {
        validOptionId = component.options[0].id;
        console.log(`Normalizing rule: option_id ${rule.option_id} not found for component ${validComponentId}, using ${validOptionId} instead`);
      }
      
      // Validate dependent_component_id
      const dependentComponentExists = components.some(c => c.id === rule.dependent_component_id);
      if (!dependentComponentExists && components.length > 0) {
        validDependentComponentId = components[0].id;
        console.log(`Normalizing rule: dependent_component_id ${rule.dependent_component_id} not found, using ${validDependentComponentId} instead`);
      }
      
      // Validate dependent_option_id
      const dependentComponent = components.find(c => c.id === validDependentComponentId);
      const dependentOptionExists = dependentComponent?.options.some(o => o.id === rule.dependent_option_id);
      if (!dependentOptionExists && dependentComponent && dependentComponent.options.length > 0) {
        validDependentOptionId = dependentComponent.options[0].id;
        console.log(`Normalizing rule: dependent_option_id ${rule.dependent_option_id} not found for component ${validDependentComponentId}, using ${validDependentOptionId} instead`);
      }
      
      // Return normalized rule
      return {
        ...rule,
        component_id: validComponentId,
        option_id: validOptionId,
        dependent_component_id: validDependentComponentId,
        dependent_option_id: validDependentOptionId
      };
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="w-1/2">
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Filter price rules..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <button
          onClick={addPriceRule}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition flex items-center"
        >
          <PlusIcon className="h-4 w-4 mr-1" />
          Add Price Rule
        </button>
      </div>

      {priceRules.length === 0 ? (
        <div className="text-center py-6 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg">
          <p className="text-gray-500">No price rules yet. Add price rules to define complex pricing relationships between components.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredRules.map((rule, index) => (
            <div key={rule.id ? `rule-${rule.id}` : `new-rule-${index}`} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="mb-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          If Component
                        </label>
                        <select
                          value={rule.component_id}
                          onChange={(e) => updatePriceRule(index, 'component_id', Number(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        >
                          {components.length > 0 ? (
                            components.map(component => (
                              <option key={component.id} value={component.id}>
                                {component.name}
                              </option>
                            ))
                          ) : (
                            <option key="no-components" value={0}>No components available</option>
                          )}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Option Selected
                        </label>
                        <select
                          value={rule.option_id}
                          onChange={(e) => updatePriceRule(index, 'option_id', Number(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        >
                          {(() => {
                            // Add detailed logging to diagnose the issue
                            console.log(`Looking for component with component_id=${rule.component_id}`);
                            components.forEach(c => console.log(`Available component: id=${c.id}, component_id=${c.id}, name=${c.name}`));
                            
                            const selectedComponent = components.find(c => c.id === rule.component_id);
                            console.log('Selected component for options:', selectedComponent);
                            
                            if (selectedComponent && selectedComponent.options && selectedComponent.options.length > 0) {
                              return selectedComponent.options.map(option => (
                                <option key={option.id} value={option.id}>
                                  {option.name}
                                </option>
                              ));
                            } else {
                              return <option key="no-options" value={0}>No options available</option>;
                            }
                          })()}
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <div className="mb-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          And Dependent Component
                        </label>
                        <select
                          value={rule.dependent_component_id}
                          onChange={(e) => updatePriceRule(index, 'dependent_component_id', Number(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        >
                          {components.length > 0 ? (
                            components.map(component => (
                              <option key={component.id} value={component.id}>
                                {component.name}
                              </option>
                            ))
                          ) : (
                            <option key="no-dep-components" value={0}>No components available</option>
                          )}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Dependent Option
                        </label>
                        <select
                          value={rule.dependent_option_id}
                          onChange={(e) => updatePriceRule(index, 'dependent_option_id', Number(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        >
                          {(() => {
                            // Add detailed logging to diagnose the issue
                            console.log(`Looking for component with component_id=${rule.dependent_component_id}`);
                            components.forEach(c => console.log(`Available dependent component: id=${c.id}, component_id=${c.id}, name=${c.name}`));
                            
                            const selectedDepComponent = components.find(c => c.id === rule.dependent_component_id);
                            console.log('Selected dependent component for options:', selectedDepComponent);
                            
                            if (selectedDepComponent && selectedDepComponent.options && selectedDepComponent.options.length > 0) {
                              return selectedDepComponent.options.map(option => (
                                <option key={option.id} value={option.id}>
                                  {option.name}
                                </option>
                              ));
                            } else {
                              return <option key="no-dep-options" value={0}>No options available</option>;
                            }
                          })()}
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-end">
                    <div className="w-1/3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Special Price Adjustment ($)
                      </label>
                      <div className="flex items-center">
                        <span className="text-gray-500 mr-1">$</span>
                        <input
                          type="number"
                          value={rule.price}
                          onChange={(e) => updatePriceRule(index, 'price', parseFloat(e.target.value) || 0)}
                          min="0"
                          step="0.01"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                    </div>
                    
                    <div className="ml-4 text-sm text-gray-500 italic flex-1">
                      <p>This price will replace the sum of individual option prices when these options are selected together.</p>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => removePriceRule(index)}
                  className="ml-4 text-red-600 hover:text-red-800"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
              
              <div className="mt-2 bg-gray-50 p-3 rounded text-sm">
                <p>
                  <span className="font-medium">Summary:</span> When {getComponentName(rule.component_id)} is set to "{getOptionName(rule.component_id, rule.option_id)}" 
                  and {getComponentName(rule.dependent_component_id)} is set to "{getOptionName(rule.dependent_component_id, rule.dependent_option_id)}", 
                  the price will be ${rule.price.toFixed(2)}.
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PriceRulesSection; 