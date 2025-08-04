import { SymbolView } from "expo-symbols";
import {
  type PressableProps,
  type ViewProps,
  type ViewStyle,
} from "react-native";

import { cn } from "../lib/utils";
import { useTheme } from "../theme/ThemeContext";
import { Pressable, View } from "./interop";
import React from "react";

// Add as class when possible: https://github.com/marklawlor/nativewind/issues/522
const BORDER_CURVE: ViewStyle = {
  borderCurve: "continuous",
};

type withoutChildren<T> = Omit<T, "children">;

type StepperProps = withoutChildren<ViewProps> & {
  subtractButton?: withoutChildren<PressableProps> & { className?: string };
  addButton?: withoutChildren<PressableProps> & { className?: string };
  className?: string;
};

function Stepper({
  className,
  subtractButton,
  addButton,
  ...props
}: StepperProps) {
  const { colors } = useTheme();
  return (
    <View
      testID="stepper"
      style={BORDER_CURVE}
      className={cn(
        "ios:bg-card ios:rounded-md ios:border-0 flex-row items-center overflow-hidden rounded-full border border-border",
        className
      )}
      {...props}
    >
      <Pressable
        testID="subtract-button"
        {...subtractButton}
        className={cn(
          "ios:active:bg-border/30 active:bg-primary/10 dark:active:bg-primary/15 dark:ios:active:bg-border/30 ios:px-3 ios:h-[30px] h-[38px] justify-center px-5",
          subtractButton?.disabled && "bg-border/20 opacity-70 dark:opacity-50",
          subtractButton?.className
        )}
      >
        <SymbolView name="minus" size={21} tintColor={colors.foreground} />
      </Pressable>
      <View className="ios:h-5 ios:bg-border h-[38px] w-px rounded-full bg-border" />
      <Pressable
        testID="add-button"
        {...addButton}
        className={cn(
          "ios:active:bg-border/30 active:bg-primary/10 dark:active:bg-primary/15 dark:ios:active:bg-border/30 ios:px-3 ios:h-[30px] h-[38px] justify-center px-5",
          addButton?.disabled && "bg-border/20 opacity-70 dark:opacity-50",
          addButton?.className
        )}
      >
        <SymbolView name="plus" size={21} tintColor={colors.foreground} />
      </Pressable>
    </View>
  );
}

export { Stepper };
