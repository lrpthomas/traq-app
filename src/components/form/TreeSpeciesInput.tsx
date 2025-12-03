'use client';

import { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { useTreeSpeciesSearch } from '@/hooks/useTreeSpecies';
import { formatSpeciesDisplay } from '@/lib/csvLoader';
import { cn } from '@/lib/utils';
import type { TreeSpecies } from '@/types/traq';

interface Props {
  value: string;
  onChange: (value: string) => void;
  id?: string;
  placeholder?: string;
  className?: string;
}

export function TreeSpeciesInput({
  value,
  onChange,
  id,
  placeholder = 'Start typing to search...',
  className,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { results, hasQuery } = useTreeSpeciesSearch(query);

  // Sync query with external value
  useEffect(() => {
    setQuery(value);
  }, [value]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setQuery(newValue);
    onChange(newValue);
    setIsOpen(true);
  };

  const handleSelect = (species: TreeSpecies) => {
    const displayValue = formatSpeciesDisplay(species);
    setQuery(displayValue);
    onChange(displayValue);
    setIsOpen(false);
    inputRef.current?.blur();
  };

  return (
    <div className="relative">
      <Input
        ref={inputRef}
        id={id}
        value={query}
        onChange={handleInputChange}
        onFocus={() => setIsOpen(true)}
        placeholder={placeholder}
        className={className}
        autoComplete="off"
      />

      {isOpen && hasQuery && results.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto"
        >
          {results.map((species, index) => (
            <button
              key={`${species.scientificName}-${index}`}
              type="button"
              onClick={() => handleSelect(species)}
              className={cn(
                'w-full px-3 py-2 text-left text-sm hover:bg-green-50 focus:bg-green-50 focus:outline-none',
                'border-b last:border-b-0'
              )}
            >
              <span className="font-medium">{species.commonName}</span>
              <span className="text-gray-500 ml-2">({species.scientificName})</span>
              {species.family && (
                <span className="text-gray-400 text-xs block">{species.family}</span>
              )}
            </button>
          ))}
        </div>
      )}

      {isOpen && hasQuery && results.length === 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border rounded-md shadow-lg p-3 text-sm text-gray-500">
          No species found. You can enter a custom name.
        </div>
      )}
    </div>
  );
}
