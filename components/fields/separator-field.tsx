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

const type: ElementsType = "SeparatorField";

const DesignerComponent = ({ element }: { element: FormElementInstance }) => {
  return (
    <div className="flex w-full flex-col gap-2">
      <Label className="text-muted-foreground">Separator Field</Label>
      <Separator />
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
