import { useSession } from "@/lib/auth-client";
import { Redirect, Stack } from "expo-router";

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
