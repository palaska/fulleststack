# Migrating from Auth.js to Better-Auth in the Web Client

This document provides step-by-step instructions for migrating your web client from Auth.js to Better-Auth to match your Hono backend.

## 1. Install Required Packages

```bash
# Navigate to the web client directory
cd apps/web

# Install better-auth and remove auth.js
npm install better-auth
npm uninstall @hono/auth-js
```

## 2. Create Auth Client File

Create a new file `src/lib/auth-client.ts`:

```typescript
import { createAuthClient } from "better-auth/react";

// Use relative URL for API requests
// This works with Vite's proxy configuration in development
// and with the co-located deployment in production
export const authClient = createAuthClient({
  // Use /api/auth as the base path - Vite's proxy will handle the routing
  baseURL: "/api",
  fetchOptions: {
    credentials: "include"
  }
});

// Export useful hooks and functions for easy imports elsewhere
export const useSession = authClient.useSession;
export const signIn = authClient.signIn;
export const signOut = authClient.signOut;
export const signUp = authClient.signUp;
```

This approach leverages the proxy configuration in your `vite.config.ts`, which forwards all `/api` requests to your backend server. No need to hardcode any URLs.

## 3. Update Main Entry Point

Update `src/main.tsx` to replace Auth.js SessionProvider with Better-Auth:

```typescript
import { StrictMode } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { createRoot } from "react-dom/client";

import "./index.css";
import queryClient from "@/web/lib/query-client";
import App from "./app";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
);
```

## 4. Update App Component

Modify `src/app.tsx` to use Better-Auth's session hook:

```typescript
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { useSession } from "@/web/lib/auth-client";
import { routeTree } from "@/web/route-tree.gen";

const router = createRouter({
  routeTree,
  context: {
    session: undefined,
  },
});

declare module "@tanstack/react-router" {
  // eslint-disable-next-line ts/consistent-type-definitions
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  const session = useSession();
  return <RouterProvider router={router} context={{ session }} />;
}
```

## 5. Update the Navbar Component

Update `src/components/app-navbar.tsx` to use the new auth client:

```typescript
import { Link, useLocation } from "@tanstack/react-router";
import { useSession, signOut } from "@/web/lib/auth-client";

export default function AppNavbar() {
  const location = useLocation();
  const { data: session, isPending } = useSession();

  return (
    <nav className="container">
      <ul>
        <li><strong>Tasks App</strong></li>
      </ul>
      <ul>
        {location.pathname !== "/" && (
          <li>
            <Link to="/">Home</Link>
          </li>
        )}
        {!isPending && session?.user && (
          <>
            <li className="user-avatar">
              <img src={session.user.image || ''} alt={session.user.name || 'User'} />
              <p>{session.user.name}</p>
            </li>
            <li>
              <button
                type="button"
                className="outline contrast"
                onClick={() => signOut()}
              >
                Sign Out
              </button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
```

## 6. Create Authentication Forms (If Needed)

If you have any sign-in or sign-up forms, update them to use the new auth client. Here's an example for a sign-in form:

```typescript
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { signIn } from "@/web/lib/auth-client";

export default function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn.email({
        email,
        password,
        rememberMe: true,
      });

      if (result.error) {
        setError(result.error.message);
      } else {
        navigate({ to: "/" });
      }
    } catch (err) {
      setError("An error occurred during sign in");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error">{error}</div>}
      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit" disabled={isLoading}>
        {isLoading ? "Signing in..." : "Sign In"}
      </button>
    </form>
  );
}
```

## 7. Update Protected Routes

If you use any route protection, update it to use the new auth client:

```typescript
import { Navigate, Outlet } from "@tanstack/react-router";
import { useSession } from "@/web/lib/auth-client";

export function ProtectedRoute() {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <Navigate to="/signin" />;
  }

  return <Outlet />;
}
```

## 8. Social Authentication (If Used)

If you use social authentication, update the social login buttons:

```typescript
import { signIn } from "@/web/lib/auth-client";

export function SocialLoginButtons() {
  return (
    <div className="social-login">
      <button
        onClick={() => signIn.social({ provider: "github" })}
        type="button"
      >
        Sign in with GitHub
      </button>
      <button
        onClick={() => signIn.social({ provider: "google" })}
        type="button"
      >
        Sign in with Google
      </button>
    </div>
  );
}
```

## 9. API Requests with Authentication

Update any authenticated API requests to properly use the session from Better-Auth:

```typescript
import { apiClient } from "@/web/lib/api-client";

export async function fetchProtectedData() {
  // The session cookie is automatically included with requests
  // because we've set fetchOptions.credentials = "include" in auth-client.ts
  return apiClient.get("/protected-endpoint");
}
```

This works with your existing `api-client.ts` setup which uses relative URLs and leverages Vite's proxy configuration.

## 10. Testing the Migration

1. Start your backend server
2. Start your web client with `npm run dev` (this will use Vite's proxy)
3. Test authentication flows:
   - Sign in/sign up
   - Session persistence
   - Protected routes
   - Sign out

## Understanding the Development Environment

Your `vite.config.ts` includes a proxy configuration that forwards all `/api` requests to your Hono backend:

```typescript
server: {
  proxy: {
    "/api": "http://localhost:8787",
  },
},
```

This means:
- In development, requests to `/api/*` from the browser are proxied to `http://localhost:8787/api/*`
- In production, the build configuration outputs to `../api/public`, suggesting the web client is served by the API server

This proxy setup allows you to use relative URLs in your code without hardcoding server addresses, making the transition between development and production environments seamless.

## Common Issues and Troubleshooting

- **CORS Issues**: The proxy setup should prevent most CORS issues in development. For production, ensure your backend has proper CORS configuration
- **Cookie Issues**: Better-Auth uses HTTP-only cookies by default. Make sure your API requests include credentials (`credentials: "include"`)
- **Session Not Persisting**: Check that both the frontend and backend are configured with the same cookie settings
- **Proxy Not Working**: If you're having issues with the proxy in development, verify your Vite server is running and the proxy settings are correct

## Advanced Configurations

For more complex configurations, refer to the Better-Auth documentation:
- https://www.better-auth.com/docs/concepts/client
- https://www.better-auth.com/docs/basic-usage
