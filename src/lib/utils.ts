import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getSubdomain = (host?: string | null) => {
  let subdomain: string | null = null;
  if (!host && typeof window !== "undefined") {
    host = window.location.host;
  }
  if (host && host.includes(".")) {
    const candidate = host.split(".")[0];
    if (candidate && !candidate.includes("localhost")) {
      subdomain = candidate;
    }
  }
  return subdomain;
};
