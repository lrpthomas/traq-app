'use client';

import { useState, useRef, useEffect } from 'react';
import { Check, ChevronDown, X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface Option {
  id: string;
  label: string;
  description?: string;
}

interface MultiSelectPickerProps {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
  allowCustom?: boolean;
  customPlaceholder?: string;
}

export function MultiSelectPicker({
  value,
  onChange,
  options,
  placeholder = 'Select options...',
  allowCustom = true,
  customPlaceholder = 'Add custom entry...',
}: MultiSelectPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [customInput, setCustomInput] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Parse selected items from comma-separated string
  const selectedItems = value
    ? value.split(',').map((t) => t.trim()).filter(Boolean)
    : [];

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Toggle item selection
  const toggleItem = (itemLabel: string) => {
    const newSelection = selectedItems.includes(itemLabel)
      ? selectedItems.filter((t) => t !== itemLabel)
      : [...selectedItems, itemLabel];

    onChange(newSelection.join(', '));
  };

  // Remove a specific item
  const removeItem = (itemLabel: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newSelection = selectedItems.filter((t) => t !== itemLabel);
    onChange(newSelection.join(', '));
  };

  // Add custom entry
  const addCustomEntry = () => {
    if (customInput.trim() && !selectedItems.includes(customInput.trim())) {
      const newSelection = [...selectedItems, customInput.trim()];
      onChange(newSelection.join(', '));
      setCustomInput('');
    }
  };

  // Handle Enter key in custom input
  const handleCustomKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addCustomEntry();
    }
  };

  // Clear all selections
  const clearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm',
          'ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
          'min-h-[40px]',
          isOpen && 'ring-2 ring-ring ring-offset-2'
        )}
      >
        <div className="flex flex-wrap gap-1 flex-1">
          {selectedItems.length === 0 ? (
            <span className="text-muted-foreground">{placeholder}</span>
          ) : (
            selectedItems.map((item) => (
              <Badge
                key={item}
                variant="secondary"
                className="text-xs font-normal"
              >
                {item}
                <button
                  type="button"
                  onClick={(e) => removeItem(item, e)}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))
          )}
        </div>
        <div className="flex items-center gap-1 ml-2">
          {selectedItems.length > 0 && (
            <button
              type="button"
              onClick={clearAll}
              className="text-muted-foreground hover:text-foreground p-1"
              title="Clear all"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <ChevronDown
            className={cn(
              'h-4 w-4 text-muted-foreground transition-transform',
              isOpen && 'rotate-180'
            )}
          />
        </div>
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-lg max-h-64 overflow-auto">
          <div className="p-2">
            {/* Preset options */}
            {options.map((option) => {
              const isSelected = selectedItems.includes(option.label);
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => toggleItem(option.label)}
                  className={cn(
                    'flex w-full items-center gap-2 px-2 py-1.5 text-sm rounded hover:bg-accent',
                    isSelected && 'bg-accent'
                  )}
                  title={option.description}
                >
                  <div
                    className={cn(
                      'flex h-4 w-4 items-center justify-center rounded border',
                      isSelected
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-input'
                    )}
                  >
                    {isSelected && <Check className="h-3 w-3" />}
                  </div>
                  <span className="flex-1 text-left">{option.label}</span>
                </button>
              );
            })}

            {/* Custom entry input */}
            {allowCustom && (
              <div className="border-t mt-2 pt-2">
                <div className="flex gap-2">
                  <Input
                    type="text"
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                    onKeyDown={handleCustomKeyDown}
                    placeholder={customPlaceholder}
                    className="text-sm h-8"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addCustomEntry}
                    disabled={!customInput.trim()}
                    className="h-8 px-2"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
