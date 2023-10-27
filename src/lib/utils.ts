import { Annotation } from "@/types";
import { ANNO_CLICK, DBL_CLICK, HOME_CLICK } from "@/types/Events";
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function triggerAnnotationClickEvent(anno: Annotation) {
  const event = new CustomEvent(ANNO_CLICK, { detail: anno });
  window.dispatchEvent(event);
}

export function triggerDoubleClickEvent(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
  const event = new CustomEvent(DBL_CLICK, { detail: e });
  window.dispatchEvent(event);
}

export function triggerHomeClickEvent() {
  const event = new CustomEvent(HOME_CLICK);
  window.dispatchEvent(event);
}