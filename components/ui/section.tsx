import { cn } from "@/lib/utils";
import { type ComponentPropsWithRef, forwardRef } from "react";

type Props = ComponentPropsWithRef<"section"> & {
  hero?: boolean;
  bleed?: boolean;
};

const Section = forwardRef<HTMLDivElement, Props>(
  ({ className, children, hero, bleed }, ref) => {
    return (
      <section
        ref={ref}
        className={cn(
          `relative`,
          !hero && !bleed && "container",
          hero && "min-h-half-hero md:min-h-hero",
          className,
        )}
      >
        {children}
      </section>
    );
  },
);

export default Section;
