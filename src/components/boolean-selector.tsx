'use client';

import { Selector } from './selector';
import { Switch } from './ui/switch';

export function BooleanSelector({
  label,
  description,
  value,
  onChange,
}: {
  label: string;
  description: string;
  value: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <Selector label={label} description={description}>
      <Switch
        checked={value}
        onCheckedChange={(checked: boolean) => {
          onChange(checked);
        }}
      />
    </Selector>
  );
}
