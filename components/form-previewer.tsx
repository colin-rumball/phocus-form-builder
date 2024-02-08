import useDesigner from "@/lib/hooks/useDesigner";
import { cn } from "@/lib/utils";
import { type ComponentPropsWithoutRef } from "react";
import { FormElements } from "./form-elements";
import { Button } from "./ui/button";
import { HiCursorClick } from "react-icons/hi";

type FormPreviewerProps = ComponentPropsWithoutRef<"div">;

const FormPreviewer = ({ className }: FormPreviewerProps) => {
  const { elements } = useDesigner((state) => ({
    elements: state.elements,
  }));
  return (
    <div
      className={cn(
        "flex flex-grow flex-col items-center overflow-y-auto py-xl",
        className,
      )}
    >
      <div className="flex h-auto w-[620px] flex-col gap-2 overflow-y-auto rounded-2xl bg-background p-9">
        {elements.map((element) => {
          const FormComponent = FormElements[element.type].formComponent;
          return <FormComponent key={element.id} element={element} />;
        })}
        <Button className="mt-8">
          <HiCursorClick className="mr-2" />
          <span>Submit</span>
        </Button>
      </div>
    </div>
  );
};

export default FormPreviewer;
