import * as React from "react";
import {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  withSpring,
} from "react-native-reanimated";

import { cn } from "../lib/utils";
import { AnimatedView, View } from "./interop";

const DEFAULT_MAX = 100;

const ProgressIndicator = React.forwardRef<
  React.ElementRef<typeof View>,
  React.ComponentPropsWithoutRef<typeof View> & {
    value?: number;
    max?: number;
    getValueLabel?: (value: number, max: number) => string;
    indicatorClassName?: string;
  }
>(
  (
    {
      value: valueProp,
      max: maxProp,
      getValueLabel = defaultGetValueLabel,
      className,
      indicatorClassName,
      children,
      ...props
    },
    ref
  ) => {
    const max = maxProp ?? DEFAULT_MAX;
    const value = isValidValueNumber(valueProp, max) ? valueProp : 0;
    const progress = useDerivedValue(() => value ?? 0);

    const indicator = useAnimatedStyle(() => {
      return {
        width: withSpring(
          `${interpolate(progress.value, [0, 100], [1, 100], Extrapolation.CLAMP)}%`,
          { overshootClamping: true }
        ),
      };
    });

    return (
      <View
        role="progressbar"
        ref={ref}
        aria-valuemax={max}
        aria-valuemin={0}
        aria-valuenow={value}
        aria-valuetext={getValueLabel(value, max)}
        accessibilityValue={{
          min: 0,
          max,
          now: value,
          text: getValueLabel(value, max),
        }}
        testID="progress-indicator"
        className={cn(
          "relative h-1 w-full overflow-hidden rounded-full",
          className
        )}
        {...props}
      >
        <View
          testID="progress-background"
          className="absolute bottom-0 left-0 right-0 top-0 bg-muted opacity-20"
        />
        <AnimatedView
          role="presentation"
          style={indicator}
          testID="progress-bar"
          className={cn("h-full", indicatorClassName ?? "bg-primary")}
        />
      </View>
    );
  }
);

ProgressIndicator.displayName = "ProgressIndicator";

export { ProgressIndicator };

function defaultGetValueLabel(value: number, max: number) {
  return `${Math.round((value / max) * 100)}%`;
}

function isValidValueNumber(value: any, max: number): value is number {
  return (
    typeof value === "number" && !isNaN(value) && value <= max && value >= 0
  );
}
