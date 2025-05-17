import { CheckCircleIcon, ExclamationTriangleIcon, InformationCircleIcon, XCircleIcon } from "@heroicons/react/20/solid";
import React from "react";

import { cn } from "@/web/lib/utils";

import { Button } from "./button";

const variants = {
  info: {
    Icon: InformationCircleIcon,
    className: "bg-blue-100",
    iconClassName: "text-blue-400",
    titleClassName: "text-blue-800",
    descriptionClassName: "text-blue-700",
  },
  success: {
    Icon: CheckCircleIcon,
    className: "bg-green-100",
    iconClassName: "text-green-400",
    titleClassName: "text-green-800",
    descriptionClassName: "text-green-700",
  },
  warning: {
    Icon: ExclamationTriangleIcon,
    className: "bg-yellow-100",
    iconClassName: "text-yellow-400",
    titleClassName: "text-yellow-800",
    descriptionClassName: "text-yellow-700",
  },
  error: {
    Icon: XCircleIcon,
    className: "bg-red-100",
    iconClassName: "text-red-400",
    titleClassName: "text-red-800",
    descriptionClassName: "text-red-700",
  },
} as const;

type AlertProps = Omit<React.ComponentProps<"div">, "title"> & {
  variant?: keyof typeof variants;
  icon?: React.ReactNode;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  actions?: React.ReactNode[];
};

export function Alert({
  variant = "info",
  icon,
  title,
  description,
  actions,
  className,
  ...props
}: AlertProps) {
  const { Icon } = variants[variant];

  return (
    <div
      {...props}
      className={cn(
        "rounded-md p-4",
        variants[variant].className,
        className,
      )}
    >
      <div className="flex">
        <div className="shrink-0">
          {icon || (
            <Icon
              aria-hidden="true"
              className={cn("size-5", variants[variant].iconClassName)}
            />
          )}
        </div>
        <div className="ml-3">
          {title && (
            <AlertTitle className={variants[variant].titleClassName}>
              {title}
            </AlertTitle>
          )}
          {description && (
            <AlertDescription className={variants[variant].descriptionClassName}>
              {description}
            </AlertDescription>
          )}
          {actions && (
            <div className="mt-4">
              <div className="-mx-2 -my-1.5 flex gap-2">
                {actions.map((action, index) => (
                  <React.Fragment key={index}>
                    {action}
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function AlertTitle({ className, ...props }: React.ComponentProps<"h3">) {
  return <h3 className={cn("text-sm font-medium text-gray-800", className)} {...props} />;
}

export function AlertDescription({ className, ...props }: React.ComponentProps<"p">) {
  return <p className={cn("text-sm text-gray-600", className)} {...props} />;
}

export function AlertAction({ className, ...props }: React.ComponentProps<typeof Button>) {
  return <Button className={cn("text-sm", className)} {...props} />;
}
