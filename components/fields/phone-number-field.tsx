"use client";

import { MdTextFields } from "react-icons/md";
import {
  SubmitFunction,
  type ElementsType,
  type FormElement,
  type FormElementInstance,
  type FormElementFormComponentProps,
} from "../form-elements";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import useDesigner from "@/lib/hooks/useDesigner";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Switch } from "../ui/switch";
import { cn } from "@/lib/utils";
import { Bs123, BsPhone } from "react-icons/bs";

const type: ElementsType = "PhoneNumberField";

const extraAttributes = {
  label: "Phone Input Label",
  helperText: "Helper text",
  required: false,
  placeholder: "",
};

type CustomInstance = FormElementInstance & {
  extraAttributes: typeof extraAttributes;
};

const DesignerComponent = ({ element }: { element: FormElementInstance }) => {
  const { selectedElement } = useDesigner((state) => ({
    selectedElement: state.selectedElement,
  }));
  return (
    <div className="flex h-auto w-full flex-col justify-center gap-0">
      {selectedElement === element && (
        <Label className="text-muted-foreground">Phone Input</Label>
      )}
      <FormComponent element={element} isReadOnly />
    </div>
  );
};

const FormComponent = ({
  element,
  submitValue,
  defaultValue,
  isInvalid,
  isReadOnly,
}: FormElementFormComponentProps) => {
  const elementTyped = element as CustomInstance;

  const [value, setValue] = useState(defaultValue ?? "");
  const [error, setError] = useState(false);

  useEffect(() => {
    if (isInvalid) {
      setError(true);
    }
  }, [isInvalid]);

  const { label, placeholder, required, helperText } =
    elementTyped.extraAttributes;
  return (
    <div className="flex w-full flex-col gap-2">
      <Label className={cn(error && "text-red-500")}>
        {label}
        {required && "*"}
      </Label>
      <Input
        readOnly={isReadOnly}
        type="tel"
        pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
        className={cn(error && "border-red-500")}
        placeholder={placeholder}
        onChange={(e) => {
          setValue(e.target.value);
        }}
        onBlur={(e) => {
          const valid = PhoneNumberFieldFormElement.validate(
            element,
            e.target.value,
          );
          setError(!valid);
          if (!valid || !submitValue) return;
          submitValue(element.id, e.target.value);
        }}
        value={value}
      />
      {helperText && (
        <p
          className={cn(
            "text-[0.8rem] text-muted-foreground",
            error && "text-red-500",
          )}
        >
          {helperText}
        </p>
      )}
    </div>
  );
};

const propertiesSchema = z.object({
  label: z.string().min(2).max(50),
  helperText: z.string().max(200),
  required: z.boolean().default(false),
  placeholder: z.string().max(50),
});

const PropertiesComponent = ({ element }: { element: FormElementInstance }) => {
  const elementTyped = element as CustomInstance;
  const { updateElement } = useDesigner((state) => ({
    updateElement: state.updateElement,
  }));
  const form = useForm<z.infer<typeof propertiesSchema>>({
    resolver: zodResolver(propertiesSchema),
    mode: "onBlur",
    defaultValues: {
      label: elementTyped.extraAttributes.label,
      placeholder: elementTyped.extraAttributes.placeholder,
      required: elementTyped.extraAttributes.required,
      helperText: elementTyped.extraAttributes.helperText,
    },
  });

  useEffect(() => {
    form.reset(elementTyped.extraAttributes);
  }, [elementTyped, form]);

  const applyChanges = (data: z.infer<typeof propertiesSchema>) => {
    updateElement(elementTyped.id, {
      ...elementTyped,
      extraAttributes: { ...data },
    });
  };

  return (
    <Form {...form}>
      <form
        onBlur={form.handleSubmit(applyChanges)}
        onSubmit={form.handleSubmit(applyChanges)}
      >
        <FormField
          control={form.control}
          name="label"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Label</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") e.currentTarget.blur();
                  }}
                />
              </FormControl>
              <FormDescription>
                The label of the field. <br /> It will be displayed above the
                field.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="placeholder"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Placeholder</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") e.currentTarget.blur();
                  }}
                />
              </FormControl>
              <FormDescription>The placeholder of the field.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="helperText"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Helper text</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") e.currentTarget.blur();
                  }}
                />
              </FormControl>
              <FormDescription>
                The helper text of the field. <br /> It will be displayed below
                the field.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="required"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>Required</FormLabel>
                <FormDescription>
                  The helper text of the field. <br /> It will be displayed
                  below the field.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export const PhoneNumberFieldFormElement: FormElement = {
  type,
  construct: (id) => ({
    id,
    type,
    extraAttributes: extraAttributes,
  }),
  designerButton: {
    icon: BsPhone,
    label: "Phone Input",
  },
  designerComponent: DesignerComponent,
  formComponent: FormComponent,
  propertiesComponent: PropertiesComponent,
  validate: (element, value) => {
    const elementTyped = element as CustomInstance;
    if (elementTyped.extraAttributes.required) {
      return value.length > 0;
    }

    // valudate value has phone number format
    const phoneRegex =
      /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
    if (value.length > 0 && !phoneRegex.test(value)) {
      return false;
    }

    return true;
  },
};
