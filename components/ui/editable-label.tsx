import { cn } from "@/lib/utils";
import { useState, type ComponentPropsWithoutRef } from "react";
import { Input } from "./input";

type EditableLabelProps = ComponentPropsWithoutRef<"div"> & {
  defaultValue: string;
  onValueChange: (value: string) => void;
};

const EditableLabel = ({
  className,
  defaultValue,
  onValueChange,
}: EditableLabelProps) => {
  const [inputValue, setInputValue] = useState(defaultValue);
  return (
    <Input
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      onBlur={() => onValueChange(inputValue)}
      className={cn(
        "m-0 h-auto truncate rounded-none border-none px-0 py-0 focus-visible:ring-foreground",
        className,
      )}
    />
  );
};

export default EditableLabel;
