import RNSlider from "@react-native-community/slider";
import { Platform } from "react-native";
import { useTheme } from "../theme/ThemeContext";
import React from "react";

function Slider({
  thumbTintColor,
  minimumTrackTintColor,
  maximumTrackTintColor,
  ...props
}: React.ComponentPropsWithoutRef<typeof RNSlider>) {
  const { colors } = useTheme();
  return (
    <RNSlider
      testID="slider"
      thumbTintColor={
        (thumbTintColor ?? Platform.OS === "ios")
          ? colors.white
          : colors.primary
      }
      minimumTrackTintColor={minimumTrackTintColor ?? colors.primary}
      maximumTrackTintColor={
        (maximumTrackTintColor ?? Platform.OS === "android")
          ? colors.primary
          : undefined
      }
      {...props}
    />
  );
}

export { Slider };
