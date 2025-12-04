'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const COMPASS_DIRECTIONS = [
  { value: 'N', label: 'N - North' },
  { value: 'NNE', label: 'NNE - North-Northeast' },
  { value: 'NE', label: 'NE - Northeast' },
  { value: 'ENE', label: 'ENE - East-Northeast' },
  { value: 'E', label: 'E - East' },
  { value: 'ESE', label: 'ESE - East-Southeast' },
  { value: 'SE', label: 'SE - Southeast' },
  { value: 'SSE', label: 'SSE - South-Southeast' },
  { value: 'S', label: 'S - South' },
  { value: 'SSW', label: 'SSW - South-Southwest' },
  { value: 'SW', label: 'SW - Southwest' },
  { value: 'WSW', label: 'WSW - West-Southwest' },
  { value: 'W', label: 'W - West' },
  { value: 'WNW', label: 'WNW - West-Northwest' },
  { value: 'NW', label: 'NW - Northwest' },
  { value: 'NNW', label: 'NNW - North-Northwest' },
  { value: 'Variable', label: 'Variable' },
  { value: 'None', label: 'None / Calm' },
] as const;

interface DirectionPickerProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function DirectionPicker({
  value,
  onChange,
  placeholder = 'Select direction...',
}: DirectionPickerProps) {
  return (
    <Select value={value || ''} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {COMPASS_DIRECTIONS.map((dir) => (
          <SelectItem key={dir.value} value={dir.value}>
            {dir.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
