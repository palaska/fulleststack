import { Redirect, Stack } from "expo-router";

import { useSession } from "@/lib/auth-client";

export default function ProtectedLayout() {
  const { data: session } = useSession();

  if (session === null) {
    return <Redirect href="/auth" />;
  }

  return (
    <Stack>
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
