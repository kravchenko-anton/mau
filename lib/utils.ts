import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Polish plural for "wydarzenie": 1 → wydarzenie, 2–4 → wydarzenia, else → wydarzeń.
// Returns "Wkrótce" for 0 to match the empty-state copy used across the site.
export function formatEventCount(count: number): string {
  if (count <= 0) return "Wkrótce"
  const mod10 = count % 10
  const mod100 = count % 100
  let word = "wydarzeń"
  if (count === 1) word = "wydarzenie"
  else if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) word = "wydarzenia"
  return `${count} ${word}`
}
