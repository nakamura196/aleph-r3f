import { Src, SrcObj } from '@/types';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function areObjectsIdentical(a: any, b: any) {
  return JSON.stringify(a) === JSON.stringify(b);
}

export function normalizeSrc(src: Src): SrcObj[] {
  const srcs: SrcObj[] = [];

  if (typeof src === 'string') {
    srcs.push({
      url: src as string,
    });
  } else if (Array.isArray(src)) {
    // if it's an array, then it's already a ModelSrc object
    srcs.push(...(src as SrcObj[]));
  } else {
    // if it's not a string or an array, then it's a single ModelSrc object
    srcs.push(src as SrcObj);
  }

  return srcs;
}
