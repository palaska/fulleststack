import type { InputHTMLAttributes } from "react";
import type { FieldError } from "react-hook-form";

import { ExclamationCircleIcon } from "@heroicons/react/16/solid";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  label?: string;
  error?: FieldError;
};

export default function Input(props: InputProps) {
  const { id, error, label, ...rest } = props;
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label htmlFor={id} className="block text-sm/6 font-medium text-gray-900">
          {label}
        </label>
      )}
      <div className="grid grid-cols-1">
        <input
          id={id}
          {...rest}
          className={`col-start-1 row-start-1 block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 ${error && "pl-3 pr-10 text-red-900 outline-red-300 placeholder:text-red-300 focus:outline-red-600 sm:pr-9"}`}
        />
        {error && (
          <>
            <ExclamationCircleIcon
              aria-hidden="true"
              className="pointer-events-none col-start-1 row-start-1 mr-3 size-5 self-center justify-self-end text-red-500 sm:size-4"
            />
            <p id={error?.ref?.name} className="mt-2 text-sm text-red-600">
              {error?.message}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
