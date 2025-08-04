import { cn } from "@fulleststack/ui";
import * as AvatarPrimitive from "@rn-primitives/avatar";
import { cssInterop } from "nativewind";
import React from "react";

const InteroppedAvatarRoot = cssInterop(AvatarPrimitive.Root, {
  className: "style",
});
const InteroppedAvatarImage = cssInterop(AvatarPrimitive.Image, {
  className: "style",
});
const InteroppedAvatarFallback = cssInterop(AvatarPrimitive.Fallback, {
  className: "style",
});

function Avatar({ ref, alt, className, ...props }: React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> & {
  className?: string;
} & { ref?: React.RefObject<React.ElementRef<typeof AvatarPrimitive.Root> | null> }) {
  return (
    <InteroppedAvatarRoot
      ref={ref}
      alt={alt}
      testID="avatar-root"
      className={cn(
        "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
        className,
      )}
      {...props}
    />
  );
}

Avatar.displayName = AvatarPrimitive.Root.displayName;

function AvatarImage({ ref, className, ...props }: React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image> & {
  className?: string;
} & { ref?: React.RefObject<React.ElementRef<typeof AvatarPrimitive.Image> | null> }) {
  return (
    <InteroppedAvatarImage
      ref={ref}
      testID="avatar-image"
      className={cn("aspect-square h-full w-full", className)}
      {...props}
    />
  );
}

AvatarImage.displayName = AvatarPrimitive.Image.displayName;

function AvatarFallback({ ref, className, ...props }:
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback> & {
    className?: string;
  } & { ref?: React.RefObject<React.ElementRef<typeof AvatarPrimitive.Fallback> | null> }) {
  return (
    <InteroppedAvatarFallback
      ref={ref}
      testID="avatar-fallback"
      className={cn(
        "flex h-full w-full items-center justify-center rounded-full bg-muted",
        className,
      )}
      {...props}
    />
  );
}

AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

export { Avatar, AvatarFallback, AvatarImage };
