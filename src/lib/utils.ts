import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export type SearchParam = string | string[] | undefined;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getSearchParam(sp: SearchParam): string | null {
  return sp ? (Array.isArray(sp) ? sp[0] : sp) : null;
}

export function createTxPattern(content: string) {
  const trimmedContent = content.slice(0, 60);
  const words = trimmedContent.match(/\b\w+\b/g);
  const pattern = words?.map((word) => `%${word}%`).join("");
  return pattern;
}

export const getLocalStorage = (key: string) => {
  if (typeof window !== "undefined") {
    const savedData = localStorage.getItem(key);
    return savedData ? JSON.parse(savedData) : null;
  }
  return null;
};

export const setLocalStorage = (key: string, value: any) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, JSON.stringify(value));
  }
};
