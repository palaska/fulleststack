import type { ReactNode } from "react";

import { TamaguiProvider } from "tamagui";

import { tamaguiConfig } from "./config";

export type UIProviderProps = {
  children: ReactNode;
  /**
   * Optional config to extend the default Tamagui config
   */
  config?: typeof tamaguiConfig;
  /**
   * Disable injecting CSS for this provider
   */
  disableInjectCSS?: boolean;
};

export function UIProvider({
  children,
  config = tamaguiConfig,
  disableInjectCSS = false,
}: UIProviderProps) {
  return (
    <TamaguiProvider config={config} disableInjectCSS={disableInjectCSS}>
      {children}
    </TamaguiProvider>
  );
}
