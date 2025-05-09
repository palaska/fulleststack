import { createFileRoute, Link } from "@tanstack/react-router";

import { SignInForm } from "../components/auth-forms";

export const Route = createFileRoute("/signin")({
  component: () => (
    <article>
      <h1>Sign In</h1>
      <SignInForm />
      <div className="mt-4 text-center">
        <Link to="/signup">Don't have an account? Sign up</Link>
      </div>
    </article>
  ),
});
