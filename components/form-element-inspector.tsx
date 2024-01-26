import { cn } from "@/lib/utils";
import { type ComponentPropsWithoutRef } from "react";
import { type FormElementInstance, FormElements } from "./form-elements";
import Headline from "./ui/headline";
import { Button } from "./ui/button";
import { AiOutlineClose } from "react-icons/ai";
import { useDesigner } from "@/lib/hooks/useDesigner";
import { Separator } from "./ui/separator";

type FormElementInspectorProps = ComponentPropsWithoutRef<"div"> & {
  element: FormElementInstance;
};

const FormElementInspector = ({
  className,
  element,
}: FormElementInspectorProps) => {
  const { setSelectedElement } = useDesigner();

  if (!element) return null;
  const PropertiesForm = FormElements[element.type].propertiesComponent;
  return (
    <div className={cn("flex flex-col px-2 pb-2", className)}>
      <div className="flex items-center justify-between">
        <Headline as="h3">Element Properties</Headline>
        <Button
          size={"icon"}
          variant={"ghost"}
          className=""
          onClick={() => {
            setSelectedElement(null);
          }}
        >
          <AiOutlineClose />
        </Button>
      </div>
      <Separator className="mb-4" />
      <PropertiesForm element={element} />
    </div>
  );
};

export default FormElementInspector;
