import { cn } from "@/lib/utils";
import { type ComponentPropsWithoutRef } from "react";
import { ImSpinner5 } from "react-icons/im";

type SimpleLoadingSpinnerProps = ComponentPropsWithoutRef<"div">;

const SimpleLoadingSpinner = ({ className }: SimpleLoadingSpinnerProps) => {
  return <ImSpinner5 className={cn("animate-spin", className)} />;
};

export default SimpleLoadingSpinner;
