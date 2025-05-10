import { createFileRoute, Link } from "@tanstack/react-router";

import { SignUpForm } from "../components/AuthForms";

export const Route = createFileRoute("/signup")({
  component: () => (
    <article>
      <h1>Sign Up</h1>
      <SignUpForm />
      <div className="mt-4 text-center">
        <Link to="/login" search={{ redirect: "/" }}>Already have an account? Login</Link>
      </div>
    </article>
  ),
});
