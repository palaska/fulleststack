import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";

import { z } from "zod";
import { signUp } from "../lib/auth-client";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ExclamationCircleIcon } from "@heroicons/react/16/solid";

export const Route = createFileRoute("/signup")({
  component: Signup,
  validateSearch: z.object({
    redirect: z.string().optional(),
  }),
});

const signupSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  password: z.string().min(8),
  confirmPassword: z.string().min(8),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

function Signup() {
  const { redirect } = Route.useSearch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<z.infer<typeof signupSchema>>({
    defaultValues: {
      email: "",
      name: "",
      password: "",
      confirmPassword: "",
    },
    resolver: zodResolver(signupSchema),
  });

  const onSubmit: SubmitHandler<z.infer<typeof signupSchema>> = async (data) => {
    const res = await signUp.email({
      email: data.email,
      password: data.password,
      name: data.name,
    });

    if (res.error) {
      alert(res.error.message || "Authentication failed");
    }
    else {
      navigate({ to: redirect ?? "/" });
    }
  }

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
            Create an account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm/6 font-medium text-gray-900">
                Name
              </label>
              <div className="mt-2 grid grid-cols-1">
                <input
                  {...register("name")}
                  type="text"
                  required
                  autoComplete="name"
                  className={`col-start-1 row-start-1 block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 ${errors.email && "pl-3 pr-10 text-red-900 outline-red-300 placeholder:text-red-300 focus:outline-red-600 sm:pr-9"}`}
                />
                {errors.name && (
                  <ExclamationCircleIcon
                    aria-hidden="true"
                    className="pointer-events-none col-start-1 row-start-1 mr-3 size-5 self-center justify-self-end text-red-500 sm:size-4"
                  />
                )}
              </div>
              <p id="name-error" className="mt-2 text-sm text-red-600">
                {errors.name?.message}
              </p>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
                Email address
              </label>
              <div className="mt-2 grid grid-cols-1">
                <input
                  {...register("email")}
                  type="email"
                  required
                  autoComplete="email"
                  className={`col-start-1 row-start-1 block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 ${errors.email && "pl-3 pr-10 text-red-900 outline-red-300 placeholder:text-red-300 focus:outline-red-600 sm:pr-9"}`}
                />
                {errors.email && (
                  <ExclamationCircleIcon
                    aria-hidden="true"
                    className="pointer-events-none col-start-1 row-start-1 mr-3 size-5 self-center justify-self-end text-red-500 sm:size-4"
                  />
                )}
              </div>
              <p id="email-error" className="mt-2 text-sm text-red-600">
                {errors.email?.message}
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
                  Password
                </label>
              </div>
              <div className="mt-2 grid grid-cols-1">
                <input
                  {...register("password")}
                  type="password"
                  required
                  autoComplete="current-password"
                  className={`col-start-1 row-start-1 block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 ${errors.password && "pl-3 pr-10 text-red-900 outline-red-300 placeholder:text-red-300 focus:outline-red-600 sm:pr-9"}`}
                />
                {errors.password && (
                  <ExclamationCircleIcon
                    aria-hidden="true"
                    className="pointer-events-none col-start-1 row-start-1 mr-3 size-5 self-center justify-self-end text-red-500 sm:size-4"
                  />
                )}
              </div>
              <p id="password-error" className="mt-2 text-sm text-red-600">
                {errors.password?.message}
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="confirmPassword" className="block text-sm/6 font-medium text-gray-900">
                  Confirm password
                </label>
              </div>
              <div className="mt-2 grid grid-cols-1">
                <input
                  {...register("confirmPassword")}
                  type="password"
                  required
                  autoComplete="confirm-password"
                  className={`col-start-1 row-start-1 block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 ${errors.confirmPassword && "pl-3 pr-10 text-red-900 outline-red-300 placeholder:text-red-300 focus:outline-red-600 sm:pr-9"}`}
                />
                {errors.confirmPassword && (
                  <ExclamationCircleIcon
                    aria-hidden="true"
                    className="pointer-events-none col-start-1 row-start-1 mr-3 size-5 self-center justify-self-end text-red-500 sm:size-4"
                  />
                )}
              </div>
              <p id="confirmPassword-error" className="mt-2 text-sm text-red-600">
                {errors.confirmPassword?.message}
              </p>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Create account
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm/6 text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-500">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
