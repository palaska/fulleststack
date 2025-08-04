import * as React from "react";
import { Platform, ViewStyle } from "react-native";

import { Text } from "./Text";
import { cn } from "../lib/utils";
import { View } from "./interop";

const Form = React.forwardRef<
  React.ElementRef<typeof View>,
  React.ComponentPropsWithoutRef<typeof View>
>(({ className, ...props }, ref) => {
  return (
    <View
      ref={ref}
      className={cn("flex-1 gap-9", className)}
      testID="form-root"
      {...props}
    />
  );
});

// Add as class when possible: https://github.com/marklawlor/nativewind/issues/522
const BORDER_CURVE: ViewStyle = {
  borderCurve: "continuous",
};

type FormSectionProps = React.ComponentPropsWithoutRef<typeof View> & {
  rootClassName?: string;
  footnote?: string;
  footnoteClassName?: string;
  ios?: {
    title: string;
    titleClassName?: string;
  };
};

const FormSection = React.forwardRef<
  React.ElementRef<typeof View>,
  FormSectionProps
>(
  (
    {
      rootClassName,
      className,
      footnote,
      footnoteClassName,
      ios,
      style = BORDER_CURVE,
      children: childrenProps,
      ...props
    },
    ref
  ) => {
    const children = React.useMemo(() => {
      if (Platform.OS !== "ios") return childrenProps;
      const childrenArray = React.Children.toArray(childrenProps);
      // Add isLast prop to last child
      return React.Children.map(childrenArray, (child, index) => {
        if (!React.isValidElement(child)) return child;
        const isLast = index === childrenArray.length - 1;
        if (typeof child === "string") {
          console.log("FormSection - Invalid asChild element", child);
        }
        return React.cloneElement(
          child as React.ReactElement<{ isLast?: boolean }>,
          { isLast }
        );
      });
    }, [childrenProps]);

    return (
      <View testID="form-section" className={cn("relative", rootClassName)}>
        {Platform.OS === "ios" && !!ios?.title && (
          <Text
            variant="footnote"
            className={cn(
              "pb-1 pl-3 uppercase text-muted-foreground",
              ios?.titleClassName
            )}
          >
            {ios.title}
          </Text>
        )}
        <View className="flex-1">
          <View
            ref={ref}
            className={cn(
              "ios:overflow-hidden ios:rounded-lg ios:bg-card ios:gap-0 ios:pl-1 gap-4",
              className
            )}
            style={style}
            {...props}
          >
            {children}
          </View>
          {!!footnote && (
            <Text
              className={cn(
                "ios:pl-3 ios:pt-1 pl-3 pt-0.5 text-muted-foreground",
                footnoteClassName
              )}
              variant="footnote"
            >
              {footnote}
            </Text>
          )}
        </View>
      </View>
    );
  }
);

const FormItem = React.forwardRef<
  React.ElementRef<typeof View>,
  React.ComponentPropsWithoutRef<typeof View> & {
    isLast?: boolean;
    iosSeparatorClassName?: string;
  }
>(({ className, isLast, iosSeparatorClassName, ...props }, ref) => {
  return (
    <>
      <View
        ref={ref}
        className={cn("ios:pr-1", className)}
        testID="form-item"
        {...props}
      />
      {Platform.OS === "ios" && !isLast && (
        <View
          testID="form-separator"
          className={cn("ml-2 h-px flex-1 bg-border", iosSeparatorClassName)}
        />
      )}
    </>
  );
});

export { Form, FormItem, FormSection };
