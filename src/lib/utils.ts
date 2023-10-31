import { Event } from "@/types/Events";
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function triggerEvent(eventName: Event, args?: any) {
  const event = new CustomEvent(eventName, { detail: args });
  window.dispatchEvent(event);
}
