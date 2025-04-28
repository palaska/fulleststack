import { createFileRoute, Link } from "@tanstack/react-router";

import { SignUpForm } from "../components/auth-forms";

export const Route = createFileRoute("/signup")({
  component: () => (
    <article>
      <h1>Sign Up</h1>
      <SignUpForm />
      <div className="mt-4 text-center">
        <Link to="/signin">Already have an account? Sign in</Link>
      </div>
    </article>
  ),
});
