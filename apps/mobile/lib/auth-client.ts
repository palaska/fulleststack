import { expoClient } from "@better-auth/expo/client";
import { createAuthClient } from "better-auth/react";
import * as SecureStore from "expo-secure-store";

import { API_URL, APP_NAME } from "../constants/config";

// Create the auth client
export const authClient = createAuthClient({
  baseURL: API_URL,
  plugins: [
    expoClient({
      scheme: APP_NAME,
      storagePrefix: APP_NAME,
      storage: SecureStore,
    }),
  ],
});

// Export useful hooks and functions for easy imports elsewhere
export const useSession = authClient.useSession;
export const signIn = authClient.signIn;
export const signOut = authClient.signOut;
export const signUp = authClient.signUp;

// Export types for easier use in the app
export type Session = typeof authClient.$Infer.Session.session;
export type User = typeof authClient.$Infer.Session.user;
