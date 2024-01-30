import { cn } from "@/lib/utils";
import { type ComponentPropsWithRef, forwardRef } from "react";

type Props = ComponentPropsWithRef<"main">;

const Page = forwardRef<HTMLDivElement, Props>(
  ({ className, children }, ref) => {
    return (
      <main
        ref={ref}
        className={cn("relative flex min-h-main flex-col", className)}
      >
        {children}
      </main>
    );
  },
);

export default Page;
