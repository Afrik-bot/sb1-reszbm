import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines multiple class names using clsx and tailwind-merge
 * @param inputs - Class names to combine
 * @returns Combined and deduped class names
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}