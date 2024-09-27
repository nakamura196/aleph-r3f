'use client';

import { Selector } from './selector';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

export function OptionSelector({
  label,
  description,
  value,
  onChange,
  options,
}: {
  label: string;
  description: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <Selector label={label} description={description}>
      <Select
        value={value}
        onValueChange={(value) => {
          onChange(value);
        }}>
        <SelectTrigger className="w-full text-black">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {/* //   <select
    //     className="w-full h-8"
    //     value={value}
    //     onChange={(e) => {
    //       onChange(e.target.value);
    //     }}>
    //     {options.map((option) => (
    //       <option key={option.value} value={option.value}>
    //         {option.label}
    //       </option>
    //     ))}
    //   </select> */}
    </Selector>
  );
}
