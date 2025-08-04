import * as CheckboxPrimitive from "@rn-primitives/checkbox";
import { useControllableState } from "@rn-primitives/hooks";
import { SymbolView } from "expo-symbols";
import * as React from "react";
import { Platform } from "react-native";
import { cssInterop } from "nativewind";

import { cn } from "../lib/utils";

// Create interopped versions of CheckboxPrimitive components
const InteroppedCheckboxRoot = cssInterop(CheckboxPrimitive.Root, {
  className: "style",
}) as React.ForwardRefExoticComponent<
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> & {
    className?: string;
  } & React.RefAttributes<React.ElementRef<typeof CheckboxPrimitive.Root>>
>;
const InteroppedCheckboxIndicator = cssInterop(CheckboxPrimitive.Indicator, {
  className: "style",
});

type CheckboxProps = Omit<
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>,
  "checked" | "onCheckedChange"
> & {
  defaultChecked?: boolean;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  className?: string;
};

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(
  (
    {
      className,
      checked: checkedProps,
      onCheckedChange: onCheckedChangeProps,
      defaultChecked = false,
      ...props
    },
    ref
  ) => {
    const [checked = false, onCheckedChange] = useControllableState({
      prop: checkedProps,
      defaultProp: defaultChecked,
      onChange: onCheckedChangeProps,
    });
    return (
      <InteroppedCheckboxRoot
        ref={ref}
        testID="checkbox-root"
        className={cn(
          "ios:rounded-full ios:h-[22px] ios:w-[22px] h-[18px] w-[18px] rounded-sm border border-muted-foreground",
          checked && "border-0 bg-primary",
          props.disabled && "opacity-50",
          className
        )}
        checked={checked}
        onCheckedChange={onCheckedChange}
        {...props}
      >
        <InteroppedCheckboxIndicator
          testID="checkbox-indicator"
          className={cn("h-full w-full items-center justify-center")}
        >
          <SymbolView
            name="checkmark"
            size={Platform.select({ ios: 15, default: 16 })}
            tintColor={"white"}
          />
        </InteroppedCheckboxIndicator>
      </InteroppedCheckboxRoot>
    );
  }
);
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
