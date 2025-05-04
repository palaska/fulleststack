import { useFonts } from "expo-font";
import { Redirect, SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { useSession } from "@/lib/auth-client";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const { isPending } = useSession();

  useEffect(() => {
    if (loaded && !isPending) {
      SplashScreen.hideAsync();
    }
  }, [loaded, isPending]);

  if (!loaded || isPending) {
    return null;
  }

  return (
    <>
      <StatusBar style="dark" />
      <Stack>
        <Stack.Screen
          name="auth"
          options={{
            animation: "none",
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="(protected)"
          options={{
            animation: "none",
            headerShown: false,
          }}
        />
      </Stack>
    </>
  );
}
