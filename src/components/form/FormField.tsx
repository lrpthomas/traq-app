'use client';

import { ReactNode } from 'react';
import { HelpCircle, Bookmark, BookmarkCheck } from 'lucide-react';
import { Label } from '@/components/ui/label';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { getFieldHelp } from '@/lib/fieldHelp';
import { useFieldMemory } from '@/hooks/useMemory';

interface FormFieldProps {
  fieldPath: string;
  label: string;
  children: ReactNode;
  required?: boolean;
  showMemoryToggle?: boolean;
  currentValue?: unknown;
  className?: string;
  helpOverride?: {
    title?: string;
    description?: string;
    examples?: string[];
  };
}

/**
 * Form field wrapper with label, tooltip help, and memory toggle
 */
export function FormField({
  fieldPath,
  label,
  children,
  required = false,
  showMemoryToggle = true,
  currentValue,
  className,
  helpOverride,
}: FormFieldProps) {
  const help = helpOverride || getFieldHelp(fieldPath);
  const { enabled: memoryEnabled, toggle: toggleMemory } = useFieldMemory(
    fieldPath,
    currentValue
  );

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center gap-2">
        <Label htmlFor={fieldPath} className="flex items-center gap-1">
          {label}
          {required && <span className="text-red-500">*</span>}
        </Label>

        {/* Help Tooltip */}
        {help && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={`Help for ${label}`}
                >
                  <HelpCircle className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" className="max-w-xs p-3">
                <div className="space-y-2">
                  <p className="font-medium">{help.title || label}</p>
                  <p className="text-sm text-muted-foreground">{help.description}</p>
                  {help.examples && help.examples.length > 0 && (
                    <div className="text-sm">
                      <p className="font-medium text-muted-foreground">Examples:</p>
                      <ul className="list-disc list-inside text-muted-foreground">
                        {help.examples.map((example, i) => (
                          <li key={i}>{example}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

        {/* Memory Toggle */}
        {showMemoryToggle && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className={cn(
                    'h-6 w-6 p-0',
                    memoryEnabled && 'text-green-600 hover:text-green-700'
                  )}
                  onClick={toggleMemory}
                  aria-label={memoryEnabled ? 'Disable memory' : 'Enable memory'}
                >
                  {memoryEnabled ? (
                    <BookmarkCheck className="h-4 w-4" />
                  ) : (
                    <Bookmark className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p className="text-sm">
                  {memoryEnabled
                    ? 'Click to stop remembering this value'
                    : 'Click to remember this value for future assessments'}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>

      {children}
    </div>
  );
}

/**
 * Checkbox field with integrated label
 */
interface CheckboxFieldProps {
  fieldPath: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  showMemoryToggle?: boolean;
  className?: string;
}

export function CheckboxField({
  fieldPath,
  label,
  checked,
  onChange,
  showMemoryToggle = false,
  className,
}: CheckboxFieldProps) {
  const help = getFieldHelp(fieldPath);
  const { enabled: memoryEnabled, toggle: toggleMemory } = useFieldMemory(
    fieldPath,
    checked
  );

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <input
        type="checkbox"
        id={fieldPath}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
      />
      <Label htmlFor={fieldPath} className="text-sm font-normal cursor-pointer">
        {label}
      </Label>

      {/* Help Tooltip */}
      {help && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label={`Help for ${label}`}
              >
                <HelpCircle className="h-3 w-3" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" className="max-w-xs p-3">
              <div className="space-y-2">
                <p className="font-medium">{help.title || label}</p>
                <p className="text-sm text-muted-foreground">{help.description}</p>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      {/* Memory Toggle */}
      {showMemoryToggle && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={cn(
            'h-5 w-5 p-0',
            memoryEnabled && 'text-green-600 hover:text-green-700'
          )}
          onClick={toggleMemory}
          aria-label={memoryEnabled ? 'Disable memory' : 'Enable memory'}
        >
          {memoryEnabled ? (
            <BookmarkCheck className="h-3 w-3" />
          ) : (
            <Bookmark className="h-3 w-3" />
          )}
        </Button>
      )}
    </div>
  );
}
