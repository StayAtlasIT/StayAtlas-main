import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

const SORT_OPTIONS = [
  { label: 'Price: Low to High', value: 'price_low_high' },
  { label: 'Price: High to Low', value: 'price_high_low' },
  { label: 'Newly Listed', value: 'newly_listed' },
  { label: 'Top Rated', value: 'top_rated' },
];

const SortButton = ({ onSortChange }) => {
  const [open, setOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState(SORT_OPTIONS[0]);
  const dropdownRef = useRef(null);

  const handleOptionClick = (option) => {
    setSelectedSort(option);
    setOpen(false);
    if (onSortChange) onSortChange(option.value);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="mr-10 flex items-center gap-2 px-4 py-2 border rounded-xl text-sm font-medium bg-white shadow hover:bg-gray-50"
      >
        Sort: {selectedSort.label}
        <ChevronDown size={16} />
      </button>

      {open && (
        <div className="absolute z-20 mt-2 w-56 bg-white border rounded-xl shadow-lg">
          {SORT_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => handleOptionClick(option)}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                selectedSort.value === option.value ? 'bg-gray-100 font-semibold' : ''
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SortButton;
