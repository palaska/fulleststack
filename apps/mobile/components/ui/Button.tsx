import * as Slot from "@rn-primitives/slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import {
  Platform,
  Pressable as RNPressable,
  PressableProps,
  ViewStyle,
} from "react-native";

import { TextClassContext } from "./Text";
import { cn } from "../lib/utils";
import { useTheme } from "../theme/ThemeContext";
import { Pressable, View } from "./interop";

const buttonVariants = cva("flex-row items-center justify-center gap-2", {
  variants: {
    variant: {
      primary: "ios:active:opacity-80 bg-primary",
      secondary:
        "ios:border-primary ios:active:bg-primary/5 border border-foreground/40",
      tonal:
        "ios:bg-primary/10 dark:ios:bg-primary/10 ios:active:bg-primary/15 bg-primary/15 dark:bg-primary/30",
      plain: "ios:active:opacity-70",
    },
    size: {
      none: "",
      sm: "py-1 px-2.5 rounded-full",
      md: "ios:rounded-lg py-2 ios:py-1.5 ios:px-3.5 px-5 rounded-full",
      lg: "py-3 px-5 ios:py-3 rounded-lg gap-2",
      icon: "ios:rounded-lg h-10 w-10 rounded-full",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "lg",
  },
});

const androidRootVariants = cva("overflow-hidden", {
  variants: {
    size: {
      none: "",
      icon: "rounded-full",
      sm: "rounded-full",
      md: "rounded-full",
      lg: "rounded-xl",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

const buttonTextVariants = cva("font-medium", {
  variants: {
    variant: {
      primary: "text-black",
      secondary: "ios:text-primary text-foreground",
      tonal: "ios:text-primary text-foreground",
      plain: "text-primary",
    },
    size: {
      none: "",
      icon: "",
      sm: "text-[15px] leading-5",
      md: "text-[17px] leading-7",
      lg: "text-[20px] leading-9",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "md",
  },
});

function convertToRGBA(hex: string, opacity: number): string {
  let hexValue = hex.replace("#", "");

  // Handle shorthand hex codes (#RGB)
  if (hexValue.length === 3) {
    hexValue = hexValue
      .split("")
      .map((char) => char + char)
      .join("");
  }

  if (hexValue.length !== 6) {
    throw new Error("Invalid HEX color format");
  }

  const red = parseInt(hexValue.substring(0, 2), 16);
  const green = parseInt(hexValue.substring(2, 4), 16);
  const blue = parseInt(hexValue.substring(4, 6), 16);

  if (opacity < 0 || opacity > 1) {
    throw new Error("Opacity must be a number between 0 and 1");
  }
  return `rgba(${red},${green},${blue},${opacity})`;
}

// Add as class when possible: https://github.com/marklawlor/nativewind/issues/522
const BORDER_CURVE: ViewStyle = {
  borderCurve: "continuous",
};

type ButtonVariantProps = Omit<
  VariantProps<typeof buttonVariants>,
  "variant"
> & {
  variant?: Exclude<VariantProps<typeof buttonVariants>["variant"], null>;
};

type AndroidOnlyButtonProps = {
  /**
   * ANDROID ONLY: The class name of root responsible for hidding the ripple overflow.
   */
  androidRootClassName?: string;
};

// Update ButtonProps to include colorScheme and appColors
export type ButtonProps = PressableProps &
  ButtonVariantProps &
  AndroidOnlyButtonProps & {
    className?: string;
  };

const Root = Platform.OS === "android" ? View : Slot.Pressable;

const Button = React.forwardRef<
  React.ElementRef<typeof RNPressable>,
  ButtonProps
>(
  (
    {
      className,
      variant = "primary",
      size,
      style = BORDER_CURVE,
      androidRootClassName,
      ...props
    },
    ref
  ) => {
    const { colorScheme, appColors } = useTheme(); // Get from context

    // Define ANDROID_RIPPLE inside the component or pass appColors to it if defined outside
    // For simplicity, defining it here or making it a memoized calculation based on appColors
    const ANDROID_RIPPLE = React.useMemo(
      () => ({
        dark: {
          primary: {
            color: convertToRGBA(appColors.dark.grey3, 0.4),
            borderless: false,
          },
          secondary: {
            color: convertToRGBA(appColors.dark.grey5, 0.8),
            borderless: false,
          },
          plain: {
            color: convertToRGBA(appColors.dark.grey5, 0.8),
            borderless: false,
          },
          tonal: {
            color: convertToRGBA(appColors.dark.grey5, 0.8),
            borderless: false,
          },
        },
        light: {
          primary: {
            color: convertToRGBA(appColors.light.grey4, 0.4),
            borderless: false,
          },
          secondary: {
            color: convertToRGBA(appColors.light.grey5, 0.4),
            borderless: false,
          },
          plain: {
            color: convertToRGBA(appColors.light.grey5, 0.4),
            borderless: false,
          },
          tonal: {
            color: convertToRGBA(appColors.light.grey6, 0.4),
            borderless: false,
          },
        },
      }),
      [appColors]
    );

    return (
      <TextClassContext.Provider value={buttonTextVariants({ variant, size })}>
        <Root
          testID="button-root"
          className={Platform.select({
            ios: undefined,
            default: androidRootVariants({
              size,
              className: androidRootClassName,
            }),
          })}
          {...Platform.select({
            android: props, // Pass props to Root only on Android
            default: {},
          })}
        >
          <Pressable
            testID="button-pressable"
            className={cn(
              props.disabled && "opacity-50",
              buttonVariants({ variant, size, className })
            )}
            ref={ref}
            style={style}
            android_ripple={ANDROID_RIPPLE[colorScheme][variant!]}
            {...props}
          />
        </Root>
      </TextClassContext.Provider>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonTextVariants, buttonVariants };
// export type { ButtonProps }; // Already exported inline
