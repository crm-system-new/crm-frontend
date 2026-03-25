import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string): string {
  if (!date) return "-";
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}

export function formatMoney(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
}

export function getStageColor(stage: string): string {
  const colors: Record<string, string> = {
    NEW: "bg-blue-100 text-blue-800",
    CONTACTED: "bg-yellow-100 text-yellow-800",
    QUALIFIED: "bg-green-100 text-green-800",
    PROPOSAL: "bg-purple-100 text-purple-800",
    NEGOTIATION: "bg-orange-100 text-orange-800",
    WON: "bg-emerald-100 text-emerald-800",
    LOST: "bg-red-100 text-red-800",
    CONVERTED: "bg-teal-100 text-teal-800",
    DISCOVERY: "bg-indigo-100 text-indigo-800",
    CLOSED_WON: "bg-emerald-100 text-emerald-800",
    CLOSED_LOST: "bg-red-100 text-red-800",
  };
  return colors[stage?.toUpperCase()] || "bg-gray-100 text-gray-800";
}

export function getStatusColor(status: string): "default" | "secondary" | "destructive" | "outline" {
  const map: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    ACTIVE: "default",
    OPEN: "default",
    IN_PROGRESS: "default",
    DRAFT: "secondary",
    PENDING: "secondary",
    SCHEDULED: "secondary",
    RESOLVED: "outline",
    CLOSED: "outline",
    INACTIVE: "destructive",
    CANCELLED: "destructive",
    PAUSED: "destructive",
    UNSUBSCRIBED: "destructive",
  };
  return map[status?.toUpperCase()] || "secondary";
}
