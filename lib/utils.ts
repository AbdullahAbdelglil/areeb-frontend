import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string): string {
  if (!dateString) return "N/A"

  const date = new Date(dateString)
  if (isNaN(date.getTime())) return "Invalid date"

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date)
}

export function formatPrice(price: string | number): string {
  if (price === undefined || price === null) return "Free"

  const numericPrice = typeof price === "string" ? Number.parseFloat(price) : price

  if (isNaN(numericPrice) || numericPrice === 0) return "Free"

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(numericPrice)
}

export function truncateText(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) return text
  return text.substring(0, maxLength) + "..."
}
