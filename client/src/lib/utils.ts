import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Returns a gradient class based on the color scheme
 * @param colorScheme - The color scheme to use
 * @returns A Tailwind CSS class for the gradient
 */
export function getGradientClass(colorScheme: string): string {
  switch (colorScheme) {
    case "blue-violet":
      return "bg-gradient-to-br from-blue-600 to-violet-600";
    case "teal-emerald":
      return "bg-gradient-to-br from-teal-500 to-emerald-500";
    case "amber-red":
      return "bg-gradient-to-br from-amber-500 to-red-500";
    case "purple-pink":
      return "bg-gradient-to-br from-purple-600 to-pink-500";
    case "gray-dark":
      return "bg-gradient-to-br from-gray-700 to-gray-900";
    default:
      return "bg-gradient-to-br from-blue-600 to-violet-600";
  }
}

/**
 * Returns a contrasting text color for a given color scheme
 * @param colorScheme - The color scheme to contrast with
 * @returns A Tailwind CSS class for the text color
 */
export function getContrastTextColor(colorScheme: string): string {
  // All our gradients need white text
  return "text-white";
}

/**
 * Returns a contrasting muted text color for a given color scheme
 * @param colorScheme - The color scheme to contrast with
 * @returns A Tailwind CSS class for the muted text color
 */
export function getMutedTextColor(colorScheme: string): string {
  switch (colorScheme) {
    case "blue-violet":
      return "text-blue-100";
    case "teal-emerald":
      return "text-teal-100";
    case "amber-red":
      return "text-amber-100";
    case "purple-pink":
      return "text-purple-100";
    case "gray-dark":
      return "text-gray-300";
    default:
      return "text-blue-100";
  }
}

/**
 * Returns a social icon for a given platform
 * @param platform - The social platform identifier
 * @returns A material icon name
 */
export function getSocialIcon(platform: string): string {
  switch (platform.toLowerCase()) {
    case "facebook":
      return "facebook";
    case "twitter":
    case "x":
      return "twitter";
    case "linkedin":
      return "linkedin";
    case "github":
      return "code";
    case "instagram":
      return "camera_alt";
    case "discord":
      return "discord";
    case "website":
      return "language";
    default:
      return "link";
  }
}

/**
 * Generate initials from a name
 * @param name Full name to generate initials from
 * @returns Initials (up to 2 characters)
 */
export function getInitials(name: string): string {
  if (!name) return "?";
  
  const names = name.split(" ");
  if (names.length === 1) {
    return names[0].substring(0, 2).toUpperCase();
  }
  
  return `${names[0].charAt(0)}${names[names.length - 1].charAt(0)}`.toUpperCase();
}

/**
 * Formats a timestamp into a readable date
 * @param timestamp - A Date object or timestamp string/number
 * @returns A formatted date string
 */
export function formatDate(timestamp: Date | string | number): string {
  const date = new Date(timestamp);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

/**
 * Validates if a string is a valid email
 * @param email - Email string to validate
 * @returns Boolean indicating if email is valid
 */
export function isValidEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

/**
 * Validates if a string is a valid URL
 * @param url - URL string to validate
 * @returns Boolean indicating if URL is valid
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Formats a wallet address for display
 * @param address - The wallet address to format
 * @returns A formatted address string
 */
export function formatWalletAddress(address: string): string {
  if (!address) return '';
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
}

/**
 * Creates a random 'mock' IPFS hash for development
 * @returns A string that looks like an IPFS hash
 */
export function createMockIpfsHash(): string {
  return `Qm${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
}

/**
 * Safely parses JSON without throwing
 * @param jsonString - The JSON string to parse
 * @param fallback - Fallback value if parsing fails
 * @returns The parsed object or fallback
 */
export function safeJsonParse<T>(jsonString: string, fallback: T): T {
  try {
    return JSON.parse(jsonString) as T;
  } catch {
    return fallback;
  }
}
