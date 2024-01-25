"use client";

import { cn } from "@/lib/utils";
import { type ComponentPropsWithRef, forwardRef } from "react";
import { useFormStatus } from "react-dom";
import { Button, ButtonProps } from "../ui/button2";

const FormSubmitButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ ...props }, ref) => {
    const { pending } = useFormStatus();
    return (
      <Button ref={ref} aria-disabled={pending} type="submit" {...props} />
    );
  },
);

export default FormSubmitButton;
