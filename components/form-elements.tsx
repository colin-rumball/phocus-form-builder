import { TextFieldFormElement } from "./fields/textfield";

export type ElementsType = "TextField";

export type FormElement = {
  type: ElementsType;

  construct: (id: string) => FormElementInstance;

  designerButton: {
    icon: React.ElementType;
    label: string;
  };

  designerComponent: React.FC<{
    element: FormElementInstance;
  }>;
  formComponent: React.FC;
  propertiesComponent: React.FC<{ element: FormElementInstance }>;

  // id: string;
  // label: string;
  // placeholder: string;
  // required: boolean;
  // description: string;
  // options: string[];
};

export type FormElementInstance = {
  id: string;
  type: ElementsType;
  extraAttributes?: Record<string, unknown>;
};

type FormElementsType = {
  [key in ElementsType]: FormElement;
};
export const FormElements: FormElementsType = {
  TextField: TextFieldFormElement,
};