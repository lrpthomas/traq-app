'use client';

import { useState, useRef, useEffect } from 'react';
import { Check, ChevronDown, X, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

/**
 * ISA TRAQ Level 2 Basic Assessment Tools
 * Based on ISA Best Management Practices: Tree Risk Assessment
 *
 * These tools are appropriate for a Basic (Level 2) ground-based visual assessment.
 * Advanced equipment (resistograph, tomograph, etc.) is for Level 3 assessments.
 */
const ASSESSMENT_TOOLS = [
  // Sounding & Probing
  {
    id: 'mallet',
    label: 'Rubber Mallet',
    description: 'For sounding trunk/branches to detect decay or hollow areas',
    category: 'Sounding & Probing',
  },
  {
    id: 'probe',
    label: 'Probe',
    description: 'For evaluating depth of cavities and decay pockets',
    category: 'Sounding & Probing',
  },
  {
    id: 'soil-probe',
    label: 'Soil Probe',
    description: 'For checking soil conditions and root zone',
    category: 'Sounding & Probing',
  },

  // Visual Aids
  {
    id: 'binoculars',
    label: 'Binoculars',
    description: 'For viewing upper crown from ground level',
    category: 'Visual Aids',
  },
  {
    id: 'monocular',
    label: 'Monocular',
    description: 'Compact option for viewing upper crown',
    category: 'Visual Aids',
  },
  {
    id: 'magnifying-glass',
    label: 'Magnifying Glass / Hand Lens',
    description: 'For close inspection of insects, fungi, bark conditions',
    category: 'Visual Aids',
  },
  {
    id: 'camera',
    label: 'Camera',
    description: 'For documentation and photo records',
    category: 'Visual Aids',
  },

  // Measuring Tools
  {
    id: 'diameter-tape',
    label: 'Diameter Tape (D-tape)',
    description: 'For measuring trunk diameter (DBH)',
    category: 'Measuring',
  },
  {
    id: 'measuring-tape',
    label: 'Measuring Tape',
    description: 'For measuring distances, crown spread, etc.',
    category: 'Measuring',
  },
  {
    id: 'clinometer',
    label: 'Clinometer',
    description: 'For measuring tree height and lean angle',
    category: 'Measuring',
  },
  {
    id: 'hypsometer',
    label: 'Laser Hypsometer',
    description: 'For accurate height and distance measurements',
    category: 'Measuring',
  },
  {
    id: 'compass',
    label: 'Compass',
    description: 'For documenting lean direction and site orientation',
    category: 'Measuring',
  },

  // Excavation Tools
  {
    id: 'trowel',
    label: 'Trowel',
    description: 'For minor root collar excavation',
    category: 'Excavation',
  },
  {
    id: 'mattock',
    label: 'Mattock',
    description: 'For root collar excavation in compacted soil',
    category: 'Excavation',
  },
  {
    id: 'air-spade',
    label: 'Air Spade',
    description: 'For non-destructive root collar excavation',
    category: 'Excavation',
  },

  // Other Basic Tools
  {
    id: 'hand-pruners',
    label: 'Hand Pruners',
    description: 'For collecting samples, clearing obstructions',
    category: 'Other',
  },
  {
    id: 'chisel',
    label: 'Chisel',
    description: 'For probing decay and removing loose bark',
    category: 'Other',
  },
  {
    id: 'flashlight',
    label: 'Flashlight',
    description: 'For inspecting cavities and dark areas',
    category: 'Other',
  },
  {
    id: 'ladder',
    label: 'Ladder',
    description: 'For closer inspection of lower canopy',
    category: 'Other',
  },
] as const;

// Group tools by category
const TOOL_CATEGORIES = ASSESSMENT_TOOLS.reduce((acc, tool) => {
  if (!acc[tool.category]) {
    acc[tool.category] = [];
  }
  acc[tool.category].push(tool);
  return acc;
}, {} as Record<string, typeof ASSESSMENT_TOOLS[number][]>);

interface ToolsPickerProps {
  value: string;
  onChange: (value: string) => void;
}

export function ToolsPicker({ value, onChange }: ToolsPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Parse selected tools from comma-separated string
  const selectedTools = value
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

  // Toggle tool selection
  const toggleTool = (toolLabel: string) => {
    const newSelection = selectedTools.includes(toolLabel)
      ? selectedTools.filter((t) => t !== toolLabel)
      : [...selectedTools, toolLabel];

    onChange(newSelection.join(', '));
  };

  // Remove a specific tool
  const removeTool = (toolLabel: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newSelection = selectedTools.filter((t) => t !== toolLabel);
    onChange(newSelection.join(', '));
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
          {selectedTools.length === 0 ? (
            <span className="text-muted-foreground">Select tools used...</span>
          ) : (
            selectedTools.map((tool) => (
              <Badge
                key={tool}
                variant="secondary"
                className="text-xs font-normal"
              >
                {tool}
                <button
                  type="button"
                  onClick={(e) => removeTool(tool, e)}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))
          )}
        </div>
        <div className="flex items-center gap-1 ml-2">
          {selectedTools.length > 0 && (
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
        <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-lg max-h-80 overflow-auto">
          <div className="p-2">
            {/* Info header */}
            <div className="flex items-center gap-2 px-2 py-1.5 mb-2 text-xs text-muted-foreground bg-muted rounded">
              <Info className="h-3.5 w-3.5 shrink-0" />
              <span>Tools appropriate for ISA Level 2 Basic Assessment</span>
            </div>

            {/* Tool categories */}
            {Object.entries(TOOL_CATEGORIES).map(([category, tools]) => (
              <div key={category} className="mb-2">
                <div className="px-2 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {category}
                </div>
                {tools.map((tool) => {
                  const isSelected = selectedTools.includes(tool.label);
                  return (
                    <Tooltip key={tool.id}>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          onClick={() => toggleTool(tool.label)}
                          className={cn(
                            'flex w-full items-center gap-2 px-2 py-1.5 text-sm rounded hover:bg-accent',
                            isSelected && 'bg-accent'
                          )}
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
                          <span className="flex-1 text-left">{tool.label}</span>
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="max-w-xs">
                        <p className="text-xs">{tool.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </div>
            ))}

            {/* Quick actions */}
            <div className="border-t pt-2 mt-2 flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-xs flex-1"
                onClick={() => {
                  // Common basic toolkit
                  const basicTools = ['Rubber Mallet', 'Binoculars', 'Probe', 'Diameter Tape (D-tape)', 'Camera'];
                  onChange(basicTools.join(', '));
                }}
              >
                Basic Toolkit
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-xs flex-1"
                onClick={() => {
                  // Full assessment toolkit
                  const fullTools = [
                    'Rubber Mallet',
                    'Binoculars',
                    'Probe',
                    'Diameter Tape (D-tape)',
                    'Measuring Tape',
                    'Clinometer',
                    'Camera',
                    'Trowel',
                    'Magnifying Glass / Hand Lens',
                  ];
                  onChange(fullTools.join(', '));
                }}
              >
                Full Toolkit
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
