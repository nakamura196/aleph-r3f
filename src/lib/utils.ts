import { Annotation } from "@/types";
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function triggerAnnotationClick(anno: Annotation) {
  const event = new CustomEvent('alannoclick', { detail: anno });
  window.dispatchEvent(event);
}