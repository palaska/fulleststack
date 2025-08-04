import { Picker as RNPicker } from "@react-native-picker/picker";

import { cn } from "../lib/utils";
import { useTheme } from "../theme/ThemeContext";
import { View } from "./interop";
import React from "react";

export function Picker<T>({
  mode = "dropdown",
  style,
  dropdownIconColor,
  dropdownIconRippleColor,
  className,
  testID = "picker",
  ...props
}: React.ComponentPropsWithoutRef<typeof RNPicker<T>> & {
  className?: string;
}) {
  const { colors } = useTheme();
  return (
    <View
      testID="picker-container"
      className={cn(
        "ios:shadow-sm ios:shadow-black/5 rounded-md border border-background bg-background",
        className
      )}
    >
      <RNPicker
        testID={testID}
        mode={mode}
        style={
          style ?? {
            backgroundColor: colors.root,
            borderRadius: 8,
          }
        }
        dropdownIconColor={dropdownIconColor ?? colors.foreground}
        dropdownIconRippleColor={dropdownIconRippleColor ?? colors.foreground}
        {...props}
      />
    </View>
  );
}

export const PickerItem = RNPicker.Item;
