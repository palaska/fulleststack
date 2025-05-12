import type { SubmitHandler } from "react-hook-form";

import Input from "@/web/components/Input";
import { ExclamationCircleIcon } from "@heroicons/react/16/solid";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { signIn } from "../lib/auth-client";

export const Route = createFileRoute("/login")({
  component: Login,
  validateSearch: z.object({
    redirect: z.string().optional(),
  }),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

function Login() {
  const { redirect } = Route.useSearch();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<z.infer<typeof loginSchema>>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(loginSchema),
  });

  const navigate = useNavigate();
  const onSubmit: SubmitHandler<z.infer<typeof loginSchema>> = async (data) => {
    const res = await signIn.email({
      email: data.email,
      password: data.password,
      rememberMe: true,
    });

    if (res.error) {
      alert(res.error.message || "Authentication failed");
    }
    else {
      navigate({ to: redirect ?? "/" });
    }
  };

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            alt="Your Company"
            src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
            className="mx-auto h-10 w-auto"
          />
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="mt-2 grid grid-cols-1">
              <Input id="email" label="Email address" {...register("email")} type="email" required autoComplete="email" error={errors.email} />
            </div>

            <div className="flex flex-col gap-2">
              <Input id="password" label="Password" {...register("password")} type="password" autoComplete="current-password" required error={errors.password} />
              <a href="#" className="self-end text-sm font-semibold text-indigo-600 hover:text-indigo-500">
                Forgot password?
              </a>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign in
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm/6 text-gray-500">
            Not a member?
            {" "}
            <Link to="/signup" className="font-semibold text-indigo-600 hover:text-indigo-500">
              Create a new account
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
