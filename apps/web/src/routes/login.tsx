import { createFileRoute, Link } from "@tanstack/react-router";

import { LoginForm } from "../components/AuthForms";
import { z } from "zod";

export const Route = createFileRoute("/login")({
  component: Login,
  validateSearch: z.object({
    redirect: z.string().optional(),
  }),
});

function Login() {
  const { redirect } = Route.useSearch();

  return (
    <article>
      <h1>Login</h1>
      <LoginForm redirect={redirect} />
      <div className="mt-4 text-center">
        <Link to="/signup">Don't have an account? Sign up</Link>
      </div>
    </article>
  );
}
