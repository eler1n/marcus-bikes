'use client';

import { useState, useEffect } from 'react';
import { Component, Option } from '../lib/data/types';
import { useCustomization } from '../lib/context/CustomizationContext';

interface ComponentSelectorProps {
  component: Component;
}

export default function ComponentSelector({ component }: ComponentSelectorProps) {
  const { 
    selectedOptions, 
    selectOption, 
    getComponentAvailableOptions,
    getOptionAdjustedPrice
  } = useCustomization();
  const [availableOptions, setAvailableOptions] = useState<Option[]>([]);
  
  useEffect(() => {
    const options = getComponentAvailableOptions(component.id);
    setAvailableOptions(options);
  }, [component.id, getComponentAvailableOptions, selectedOptions]);
  
  const handleOptionSelect = (optionId: string) => {
    selectOption(component.id, optionId);
  };

  const selectedOptionId = selectedOptions[component.id];

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <h4 className="font-medium text-lg mb-2">{component.name}</h4>
      {component.description && (
        <p className="text-gray-600 text-sm mb-3">{component.description}</p>
      )}
      
      <div className="space-y-2">
        {availableOptions.length > 0 ? (
          availableOptions.map((option) => {
            const { price, isAdjusted } = getOptionAdjustedPrice(component.id, option);
            
            return (
              <div key={option.id} className="flex items-center">
                <input
                  type="radio"
                  id={`${component.id}-${option.id}`}
                  name={component.id}
                  value={option.id}
                  checked={selectedOptionId === option.id}
                  onChange={() => handleOptionSelect(option.id)}
                  className="mr-2"
                />
                <label htmlFor={`${component.id}-${option.id}`} className="flex justify-between w-full">
                  <span>{option.name}</span>
                  <div className="flex flex-col items-end">
                    {isAdjusted && (
                      <span className="text-xs text-gray-500 line-through">
                        {option.price.toFixed(2)} EUR
                      </span>
                    )}
                    <span className={`font-medium ${isAdjusted ? 'text-blue-600' : ''}`}>
                      {price.toFixed(2)} EUR
                      {isAdjusted && <span className="text-xs ml-1">*</span>}
                    </span>
                  </div>
                </label>
              </div>
            );
          })
        ) : (
          <p className="text-red-500 text-sm">No available options for this component</p>
        )}
        
        {availableOptions.length > 0 && !selectedOptionId && (
          <p className="text-amber-500 text-sm mt-2">Please select an option</p>
        )}
        
        {availableOptions.some(option => 
          getOptionAdjustedPrice(component.id, option).isAdjusted
        ) && (
          <p className="text-xs text-blue-600 mt-2">
            * Price adjusted based on other selections
          </p>
        )}
      </div>
    </div>
  );
} 