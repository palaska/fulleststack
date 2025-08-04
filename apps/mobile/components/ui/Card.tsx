import * as Slot from "@rn-primitives/slot";
import { BlurView as ExpoBlurView } from "expo-blur";
import { Image, ImageProps } from "expo-image";
import { LinearGradient as ExpoLinearGradient } from "expo-linear-gradient";
import { cssInterop } from "nativewind";
import * as React from "react";
import { ColorValue, Platform, StyleSheet } from "react-native";

import { Text, TextClassContext } from "./Text";
import { useTheme } from "../theme/ThemeContext";
import { cn } from "../lib/utils";
import { View } from "./interop";

const BlurView = cssInterop(ExpoBlurView, {
  className: "style",
}) as React.ForwardRefExoticComponent<
  React.ComponentPropsWithoutRef<typeof ExpoBlurView> & {
    className?: string;
  } & React.RefAttributes<ExpoBlurView>
>;
const LinearGradient = cssInterop(ExpoLinearGradient, {
  className: "style",
});

const Card = React.forwardRef<
  React.ElementRef<typeof View>,
  React.ComponentPropsWithoutRef<typeof View> & { rootClassName?: string }
>(({ className, rootClassName, ...props }, ref) => (
  <View
    testID="card-root"
    className={cn(
      "ios:shadow-xl ios:rounded-2xl rounded-xl bg-card shadow-2xl",
      rootClassName
    )}
  >
    <View
      testID="card-container"
      ref={ref}
      className={cn(
        "ios:rounded-2xl justify-end overflow-hidden rounded-xl",
        className
      )}
      {...props}
    />
  </View>
));
Card.displayName = "Card";

const CardBadge = React.forwardRef<
  React.ElementRef<typeof View>,
  React.ComponentPropsWithoutRef<typeof View>
>(({ className, style, ...props }, ref) => {
  const { colors } = useTheme();
  return (
    <TextClassContext.Provider value="text-xs font-medium tracking-widest ios:uppercase">
      <View
        ref={ref}
        className={cn(
          "android:right-2 android:top-2.5 android:rounded-full android:border android:border-border ios:left-0 ios:rounded-br-2xl absolute top-0 z-50 px-3 py-1 pl-2",
          className
        )}
        style={style ?? { backgroundColor: colors.card }}
        {...props}
      />
    </TextClassContext.Provider>
  );
});
CardBadge.displayName = "CardBadge";

const CardContent = React.forwardRef<
  React.ElementRef<typeof View>,
  React.ComponentPropsWithoutRef<typeof View> & {
    linearGradientColors?: readonly string[];
    iosBlurIntensity?: number;
    iosBlurClassName?: string;
  }
>(
  (
    {
      className,
      linearGradientColors,
      iosBlurIntensity = 3,
      iosBlurClassName,
      ...props
    },
    ref
  ) => {
    if (linearGradientColors) {
      return (
        <LinearGradient
          colors={
            (linearGradientColors ?? []) as [
              ColorValue,
              ColorValue,
              ...ColorValue[],
            ]
          }
          className="pt-4"
        >
          {Platform.OS === "ios" && (
            <BlurView
              intensity={iosBlurIntensity}
              className={cn(
                "absolute bottom-0 left-0 right-0 top-1/2",
                iosBlurClassName
              )}
            />
          )}
          <View
            ref={ref}
            className={cn("ios:px-5 space-y-1.5 px-4 pb-4", className)}
            {...props}
          />
        </LinearGradient>
      );
    }
    return (
      <>
        {Platform.OS === "ios" && (
          <BlurView intensity={iosBlurIntensity} className={iosBlurClassName} />
        )}
        <View
          ref={ref}
          className={cn("ios:px-5 space-y-1.5 px-4 py-4", className)}
          {...props}
        />
      </>
    );
  }
);
CardContent.displayName = "CardContent";

const CardImage = React.forwardRef<
  React.ElementRef<typeof Image>,
  Omit<ImageProps, "className"> & { materialRootClassName?: string }
>(
  (
    {
      transition = 200,
      style = StyleSheet.absoluteFill,
      contentPosition = "top right",
      contentFit = "cover",
      materialRootClassName,
      ...props
    },
    ref
  ) => {
    const Root = Platform.OS === "ios" ? Slot.Image : View;
    return (
      <Root
        className={Platform.select({
          ios: undefined,
          default: cn(
            "relative flex-1 overflow-hidden rounded-2xl",
            materialRootClassName
          ),
        })}
      >
        <Image
          ref={ref}
          transition={transition}
          style={style}
          contentPosition={contentPosition}
          contentFit={contentFit}
          {...props}
        />
      </Root>
    );
  }
);
CardImage.displayName = "CardImage";

function CardTitle({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof Text>) {
  return (
    <Text
      role="heading"
      aria-level={3}
      className={cn(
        "ios:font-bold text-3xl font-medium leading-none tracking-tight text-card-foreground",
        className
      )}
      {...props}
    />
  );
}

function CardSubtitle({
  className,
  variant = Platform.select({ ios: "footnote" }),
  ...props
}: React.ComponentPropsWithoutRef<typeof Text>) {
  return (
    <Text
      variant={variant}
      className={cn(
        "ios:font-bold ios:uppercase font-medium opacity-70",
        className
      )}
      {...props}
    />
  );
}

function CardDescription({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof Text>) {
  return (
    <Text
      className={cn("leading-5 text-muted-foreground", className)}
      {...props}
    />
  );
}

const CardFooter = React.forwardRef<
  React.ElementRef<typeof ExpoBlurView>,
  React.ComponentPropsWithoutRef<typeof ExpoBlurView> & { className?: string }
>(({ className, ...props }, ref) => (
  <BlurView
    ref={ref}
    intensity={Platform.select({ ios: 15, default: 0 })}
    className={cn(
      "ios:px-5 ios:pt-3 flex-row items-center gap-4 px-4 pb-4 pt-0",
      className
    )}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardBadge,
  CardContent,
  CardDescription,
  CardFooter,
  CardImage,
  CardSubtitle,
  CardTitle,
};
