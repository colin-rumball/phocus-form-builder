import { cn } from "@/lib/utils";
import { type ComponentPropsWithRef, forwardRef } from "react";

type Props = ComponentPropsWithRef<"main">;

const Page = forwardRef<HTMLDivElement, Props>(
  ({ className, style, children }, ref) => {
    return (
      <>
        <main
          ref={ref}
          className={cn("flex h-full w-full flex-grow flex-col", className)}
          style={style}
        >
          {children}
        </main>
      </>
    );
  },
);

export default Page;
