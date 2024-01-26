import { cn } from "@/lib/utils";
import { type ComponentPropsWithoutRef } from "react";

type Props = ComponentPropsWithoutRef<"div"> & {
  as: keyof JSX.IntrinsicElements;
};

const Headline = ({ className, children, as }: Props) => {
  const Element = as;
  return (
    <Element
      className={cn(
        "font-headline",
        as === "h1" && "mb text-heading leading-headline md:text-headline",
        as === "h2" && "text-heading font-medium leading-heading",
        (as === "h3" || as === "h4" || as === "h5") && "text-lg leading-lg",
      )}
    >
      <span className={className}>{children}</span>
    </Element>
  );
};

export default Headline;
