// API configuration constants

/**
 * Utility function that returns a value if it exists, or throws an error if it doesn't
 */
export function getOrThrow<T>(value: T | undefined | null, errorMessage: string): T {
  if (value === undefined || value === null) {
    throw new Error(errorMessage);
  }
  return value;
}

export const API_URL = getOrThrow(
  process.env.EXPO_PUBLIC_API_URL,
  "EXPO_PUBLIC_API_URL environment variable is required",
);

export const APP_NAME = "fulleststackapp";
