import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import short from "short-uuid";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateId() {
  return short.generate();
}
