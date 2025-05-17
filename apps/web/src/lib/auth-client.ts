import { adminClient } from "better-auth/client/plugins";
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
