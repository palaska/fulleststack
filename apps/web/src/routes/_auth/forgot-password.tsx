import { createFileRoute } from "@tanstack/react-router";

import { AuthLayout, Button, Field, Heading, Input, Label, Strong, Text, TextLink } from "@/web/components";

export const Route = createFileRoute("/_auth/forgot-password")({
  component: ForgotPassword,
});

function ForgotPassword() {
  return (
    <AuthLayout>
      <form action="" method="POST" className="grid w-full max-w-sm grid-cols-1 gap-8">
        {/* <Logo className="h-6 text-zinc-950 dark:text-white forced-colors:text-[CanvasText]" /> */}
        <Heading>Reset your password</Heading>
        <Text>Enter your email and we’ll send you a link to reset your password.</Text>
        <Field>
          <Label>Email</Label>
          <Input type="email" name="email" />
        </Field>
        <Button type="submit" className="w-full">
          Reset password
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
