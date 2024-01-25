import { cn } from "@/lib/utils";
import { type ComponentPropsWithRef, forwardRef } from "react";
import { containerStyles } from "./container";

type Props = ComponentPropsWithRef<"div"> & {
  padded?: boolean;
  container?: boolean;
};

const SubSection = forwardRef<HTMLDivElement, Props>(
  ({ className, children, padded, container }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "",
          padded && "p-lg md:p-xl",
          container && containerStyles(),
          className,
        )}
      >
        {children}
      </div>
    );
  },
);

export default SubSection;
