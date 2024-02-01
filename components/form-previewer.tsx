import useDesigner from "@/lib/hooks/useDesigner";
import { cn } from "@/lib/utils";
import { type ComponentPropsWithoutRef } from "react";
import { FormElements } from "./form-elements";

type FormPreviewerProps = ComponentPropsWithoutRef<"div">;

const FormPreviewer = ({ className }: FormPreviewerProps) => {
  const { elements } = useDesigner((state) => ({
    elements: state.elements,
  }));
  return (
    <div
      className={cn(
        "my-lg flex flex-grow flex-col items-center justify-center overflow-y-auto",
        className,
      )}
    >
      <div className="flex h-full w-full max-w-[620px] flex-grow flex-col gap-4 overflow-y-auto rounded-2xl bg-background p-8">
        {elements.map((element) => {
          const FormComponent = FormElements[element.type].formComponent;
          return <FormComponent key={element.id} element={element} />;
        })}
      </div>
    </div>
  );
};

export default FormPreviewer;
