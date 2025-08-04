import React from "react";
import { ActivityIndicator as RNActivityIndicator } from "react-native";

import { useTheme } from "../theme/ThemeContext";

function ActivityIndicator(
  props: React.ComponentPropsWithoutRef<typeof RNActivityIndicator>,
) {
  const { colors } = useTheme();
  return (
    <RNActivityIndicator
      testID="activity-indicator"
      color={colors.primary}
      {...props}
    />
  );
}

export { ActivityIndicator };
