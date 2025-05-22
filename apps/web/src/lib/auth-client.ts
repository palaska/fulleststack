import { adminClient, emailOTPClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

// Use relative URL for API requests
// This works with Vite's proxy configuration in development
// and with the co-located deployment in production

export const BASE_URL = "http://localhost:5173";
export const authClient = createAuthClient({
  // Use /api as the base path - Vite's proxy will handle the routing
  baseURL: BASE_URL,
  fetchOptions: {
    credentials: "include",
  },
  plugins: [
    adminClient(),
    emailOTPClient(),
  ],
});

// Export useful hooks and functions for easy imports elsewhere
export const useSession = authClient.useSession;
export const signIn = authClient.signIn;
export const signOut = authClient.signOut;
export const signUp = authClient.signUp;
export const forgetPassword = authClient.forgetPassword;
export const resetPassword = authClient.resetPassword;

export type Session = typeof authClient.$Infer.Session.session;
export type User = typeof authClient.$Infer.Session.user;

type AuthError = {
  title: string;
  description: string;
};

type ErrorTypes = Partial<
  Record<
    keyof typeof authClient.$ERROR_CODES,
    AuthError
  >
>;

const errorCodes = {
  EMAIL_NOT_VERIFIED: {
    title: "Verification Required",
    description: "Please verify your email before signing in.",
  },
  USER_ALREADY_EXISTS: {
    title: "Account Exists",
    description: "An account with this email already exists.",
  },
  INVALID_EMAIL_OR_PASSWORD: {
    title: "Invalid Credentials",
    description: "The email or password you entered is incorrect.",
  },
} satisfies ErrorTypes;

export function getAuthError(
  { code, fallbackMessage }: { code: string; fallbackMessage?: string },
): AuthError {
  if (code in errorCodes) {
    return errorCodes[code as keyof typeof errorCodes];
  }

  return {
    title: "Authentication Error",
    description: fallbackMessage ?? "An unexpected error occurred. Please try again.",
  };
}
