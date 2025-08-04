import { Switch } from "react-native";

import { useTheme } from "../theme/ThemeContext";
import React from "react";

function Toggle(props: React.ComponentPropsWithoutRef<typeof Switch>) {
  const { colors } = useTheme();
  return (
    <Switch
      testID="toggle-switch"
      trackColor={{
        true: colors.primary,
        false: colors.grey,
      }}
      thumbColor={colors.white}
      {...props}
    />
  );
}

export { Toggle };
