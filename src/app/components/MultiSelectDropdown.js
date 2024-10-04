import React, { useState } from 'react';

export default function MultiSelectDropdown({ options, selectedOptions, onChange }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOption = (option) => {
    if (option === 'all') {
      if (selectedOptions.length === options.length) {
        onChange([]);
      } else {
        onChange(options.map((o) => o.site_name));
      }
    } else {
      if (selectedOptions.includes(option)) {
        onChange(selectedOptions.filter((o) => o !== option));
      } else {
        onChange([...selectedOptions, option]);
      }
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-2 border rounded-md"
      >
        {selectedOptions.length > 0 ? selectedOptions.join(', ') : 'Select options'}
      </button>
      {isOpen && (
        <div className="absolute mt-1 w-full border rounded-md bg-white z-10">
          <div className="flex items-center p-2">
            <input
              type="checkbox"
              checked={selectedOptions.length === options.length}
              onChange={() => toggleOption('all')}
              className="mr-2"
            />
            All
          </div>
          {options.map((option) => (
            <div key={option.site_name} className="flex items-center p-2">
              <input
                type="checkbox"
                checked={selectedOptions.includes(option.site_name)}
                onChange={() => toggleOption(option.site_name)}
                className="mr-2"
              />
              {option.site_name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}