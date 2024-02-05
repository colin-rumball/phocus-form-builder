import { CheckboxFieldFormElement } from "./fields/checkbox-field";
import { DateFieldFormElement } from "./fields/date-field";
import { NumberFieldFormElement } from "./fields/number-field";
import { OpenAIFieldFormElement } from "./fields/openai-field";
import { ParagraphFieldFormElement } from "./fields/paragraph-field";
import { PhoneNumberFieldFormElement } from "./fields/phone-number-field";
import { SelectFieldFormElement } from "./fields/select-field";
import { SeparatorFieldFormElement } from "./fields/separator-field";
import { SpacerFieldFormElement } from "./fields/spacer-field";
import { SubtitleFieldFormElement } from "./fields/subtitle-field";
import { TextAreaFieldFormElement } from "./fields/text-area-field";
import { TextFieldFormElement } from "./fields/text-field";
import { TitleFieldFormElement } from "./fields/title-field";

export type ElementsType =
  | "TextField"
  | "TitleField"
  | "SubtitleField"
  | "ParagraphField"
  | "SeparatorField"
  | "SpacerField"
  | "NumberField"
  | "PhoneNumberField"
  | "TextAreaField"
  | "DateField"
  | "SelectField"
  | "CheckboxField"
  | "OpenAIField";

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
  TitleField: TitleFieldFormElement,
  SubtitleField: SubtitleFieldFormElement,
  ParagraphField: ParagraphFieldFormElement,
  SeparatorField: SeparatorFieldFormElement,
  SpacerField: SpacerFieldFormElement,
  NumberField: NumberFieldFormElement,
  PhoneNumberField: PhoneNumberFieldFormElement,
  TextAreaField: TextAreaFieldFormElement,
  DateField: DateFieldFormElement,
  SelectField: SelectFieldFormElement,
  CheckboxField: CheckboxFieldFormElement,
  OpenAIField: OpenAIFieldFormElement,
};
