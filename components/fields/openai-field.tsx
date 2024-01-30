"use client";

import {
  type ElementsType,
  type FormElement,
  type FormElementInstance,
  type FormElementFormComponentProps,
} from "../form-elements";
import { SiOpenai } from "react-icons/si";

const type: ElementsType = "OpenAIField";

const DesignerComponent = ({ element }: { element: FormElementInstance }) => {
  return null;
};

const FormComponent = ({ element }: FormElementFormComponentProps) => {
  return null;
};

const PropertiesComponent = ({ element }: { element: FormElementInstance }) => {
  return <p>No properties for this element</p>;
};

export const OpenAIFieldFormElement: FormElement = {
  type,
  construct: (id) => ({
    id,
    type,
  }),
  designerButton: {
    icon: SiOpenai,
    label: "Generate Fields",
  },
  designerComponent: DesignerComponent,
  formComponent: FormComponent,
  propertiesComponent: PropertiesComponent,
  validate: () => true,
};
