import type { SubmitHandler } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Alert, AuthLayout, Button, ErrorMessage, Field, Heading, Input, Label, Spinner, Strong, Text, TextLink } from "@/web/components";
import { BASE_URL, forgetPassword } from "@/web/lib/auth-client";

export const Route = createFileRoute("/_auth/forgot-password")({
  component: ForgotPassword,
});

const schema = z.object({
  email: z.string().email(),
});

function ForgotPassword() {
  const [emailSentTo, setEmailSentTo] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof schema>>({
    defaultValues: {
      email: "",
    },
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<z.infer<typeof schema>> = async (data) => {
    setIsLoading(true);
    const res = await forgetPassword({
      email: data.email,
      redirectTo: `${BASE_URL}/reset-password`,
    });

    if (res.error) {
      setHasError(true);
    }
    else {
      setEmailSentTo(data.email);
    }
    setIsLoading(false);
  };

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit(onSubmit)} className="grid w-full max-w-sm grid-cols-1 gap-8">
        <Heading>Reset your password</Heading>
        <Text>Enter your email and we’ll send you a link to reset your password.</Text>
        {hasError && (
          <Alert variant="error" title="An error has occurred" description="An error has occurred while resetting your password. Please try again." />
        )}
        {emailSentTo !== null && (
          <Alert variant="info" title="Password reset email sent" description={`A link to reset your password has been sent to ${emailSentTo}.`} />
        )}
        <Field>
          <Label>Email</Label>
          <Input type="email" {...register("email")} />
          {errors.email && <ErrorMessage>{errors?.email?.message}</ErrorMessage>}
        </Field>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? <Spinner /> : "Reset password"}
        </Button>
        <Text>
          Don’t have an account?
          {" "}
          <TextLink to="/signup">
            <Strong>Sign up</Strong>
          </TextLink>
        </Text>
      </form>
    </AuthLayout>
  );
}
