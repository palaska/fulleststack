import { SymbolView, SymbolViewProps } from "expo-symbols";
import * as React from "react";
import { Platform, ViewProps } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button, ButtonProps } from "./Button";
import { Text } from "./Text";
import { useTheme } from "../theme/ThemeContext";
import { cn } from "../lib/utils";
import { BlurView, View } from "./interop";

type ToolbarProps = Omit<ViewProps, "children" | "style"> & {
  leftView?: React.ReactNode;
  rightView?: React.ReactNode;
  iosHint?: string;
  iosBlurIntensity?: number;
  className?: string;
};

function Toolbar({
  leftView,
  rightView,
  iosHint,
  className,
  iosBlurIntensity = 60,
  ...props
}: ToolbarProps) {
  const insets = useSafeAreaInsets();

  return (
    <BlurView
      testID="toolbar"
      intensity={Platform.select({ ios: iosBlurIntensity, default: 0 })}
      style={{
        paddingBottom: insets.bottom + 8,
      }}
      className={cn(
        "ios:bg-transparent ios:border-t-0 border-border/25 flex-row items-center justify-between border-t bg-card px-4 pt-2.5 dark:border-t-0",
        className
      )}
      {...props}
    >
      {Platform.OS === "ios" && !iosHint ? (
        <>
          <View testID="toolbar-left">{leftView}</View>
          <View testID="toolbar-right">{rightView}</View>
        </>
      ) : (
        <>
          <View testID="toolbar-left" className="flex-1 flex-row gap-2">
            {leftView}
          </View>
          {Platform.OS === "ios" && !!iosHint && (
            <Text
              testID="toolbar-hint"
              variant="caption2"
              className="font-medium"
            >
              {iosHint}
            </Text>
          )}
          <View testID="toolbar-right" className="flex-1 flex-row justify-end">
            {rightView}
          </View>
        </>
      )}
    </BlurView>
  );
}

// type IconProps = ROIconProps<"material">;
// type MaterialSchemeOnlyIconProps = Omit<
//   ROIconProps<"material">,
//   "namingScheme"
// >;

const ToolbarIcon = React.forwardRef<
  React.ElementRef<typeof Button>,
  ButtonProps & { icon: SymbolViewProps }
>(({ icon, className, androidRootClassName, ...props }, ref) => {
  const { colors } = useTheme();
  return (
    <Button
      ref={ref}
      size="icon"
      variant="plain"
      className={cn("h-11 w-11 rounded-lg", className)}
      androidRootClassName={cn("rounded-lg", androidRootClassName)}
      {...props}
    >
      <SymbolView
        tintColor={Platform.select({
          ios: colors.primary,
          default: colors.foreground,
        })}
        size={Platform.select({ ios: 27, default: 24 })}
        {...(icon as SymbolViewProps)}
      />
    </Button>
  );
});

ToolbarIcon.displayName = "ToolbarIcon";

const ToolbarCTA = React.forwardRef<
  React.ElementRef<typeof Button>,
  ButtonProps & { icon: SymbolViewProps }
>(({ icon, className, androidRootClassName, ...props }, ref) => {
  const { colors } = useTheme();
  return (
    <Button
      ref={ref}
      size="icon"
      variant={Platform.select({ ios: "plain", default: "tonal" })}
      className={cn("h-11 w-11 rounded-lg", className)}
      androidRootClassName={cn("rounded-lg", androidRootClassName)}
      {...props}
    >
      <SymbolView
        size={Platform.select({ ios: 27, default: 24 })}
        tintColor={Platform.select({
          ios: colors.primary,
          default: colors.foreground,
        })}
        {...(icon as SymbolViewProps)}
      />
    </Button>
  );
});

ToolbarCTA.displayName = "ToolbarCTA";

export { Toolbar, ToolbarCTA, ToolbarIcon };
