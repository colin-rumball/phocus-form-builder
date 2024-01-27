import { TextFieldFormElement } from "./fields/textfield";

export type ElementsType = "TextField";

export type FormElementFormComponentProps = {
  element: FormElementInstance;
  submitValue?: SubmitFunction;
  defaultValue?: string;
  isInvalid?: boolean;
};
export type SubmitFunction = (key: string, value: string) => void;

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
  formComponent: React.FC<FormElementFormComponentProps>;
  propertiesComponent: React.FC<{ element: FormElementInstance }>;

  validate: (element: FormElementInstance, value: string) => boolean;
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
