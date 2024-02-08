"use client";

import {
  type ElementsType,
  type FormElement,
  type FormElementInstance,
  type FormElementFormComponentProps,
} from "../form-elements";
import { Label } from "../ui/label";
import { RiSeparator } from "react-icons/ri";
import { Separator } from "../ui/separator";
import useDesigner from "@/lib/hooks/useDesigner";

const type: ElementsType = "SeparatorField";

const DesignerComponent = ({ element }: { element: FormElementInstance }) => {
  const { selectedElement } = useDesigner((state) => ({
    selectedElement: state.selectedElement,
  }));
  return (
    <div className="my-2 flex h-auto w-full flex-col justify-center gap-0">
      {selectedElement === element && (
        <Label className="text-muted-foreground">Separator Field</Label>
      )}
      <FormComponent element={element} />
    </div>
  );
};

const FormComponent = ({ element }: FormElementFormComponentProps) => {
  return <Separator />;
};

const PropertiesComponent = ({ element }: { element: FormElementInstance }) => {
  return <p>No properties for this element</p>;
};

export const SeparatorFieldFormElement: FormElement = {
  type,
  construct: (id) => ({
    id,
    type,
  }),
  designerButton: {
    icon: RiSeparator,
    label: "Separator",
  },
  designerComponent: DesignerComponent,
  formComponent: FormComponent,
  propertiesComponent: PropertiesComponent,
  validate: () => true,
};
