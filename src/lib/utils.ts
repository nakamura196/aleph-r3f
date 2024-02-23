import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function areObjectsIdentical(a: any, b: any) {
  return JSON.stringify(a) === JSON.stringify(b);
}
