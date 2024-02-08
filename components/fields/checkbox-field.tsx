"use client";

import {
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
import { IoMdCheckboxOutline } from "react-icons/io";
import { Checkbox } from "../ui/checkbox";

const type: ElementsType = "CheckboxField";

const extraAttributes = {
  label: "Checkbox label",
  helperText: "Helper text",
  required: false,
};

type CustomInstance = FormElementInstance & {
  extraAttributes: typeof extraAttributes;
};

const propertiesSchema = z.object({
  label: z.string().min(2).max(50),
  helperText: z.string().max(200),
  required: z.boolean().default(false),
});

const DesignerComponent = ({ element }: { element: FormElementInstance }) => {
  const { selectedElement } = useDesigner((state) => ({
    selectedElement: state.selectedElement,
  }));
  return (
    <div className="flex h-auto w-full flex-col justify-center gap-0">
      {selectedElement === element && (
        <Label className="text-muted-foreground">Checkbox</Label>
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

  const [value, setValue] = useState<boolean>(defaultValue === "true");
  const [error, setError] = useState(false);

  useEffect(() => {
    if (isInvalid) {
      setError(true);
    }
  }, [isInvalid]);

  const { label, required, helperText } = elementTyped.extraAttributes;
  const id = `checkbox ${element.id}`;
  return (
    <div className={cn("flex flex-col")}>
      <div
        className={cn(
          "flex items-center gap-2",
          isReadOnly && "pointer-events-none",
        )}
        aria-readonly={isReadOnly}
      >
        <Checkbox
          id={id}
          checked={value}
          className={cn(error ?? "border-red-500")}
          onCheckedChange={(checked) => {
            setValue(checked === true);
            if (!submitValue) return;
            const valid = CheckboxFieldFormElement.validate(
              element,
              checked.toString(),
            );
            if (valid) {
              setError(false);
              submitValue(element.id, checked.toString());
            } else {
              setError(true);
            }
          }}
        />
        <Label htmlFor={id} className={cn(error && "text-red-500")}>
          {label}
          {required && "*"}
        </Label>
      </div>
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

export const CheckboxFieldFormElement: FormElement = {
  type,
  construct: (id) => ({
    id,
    type,
    extraAttributes: extraAttributes,
  }),
  designerButton: {
    icon: IoMdCheckboxOutline,
    label: "Checkbox",
  },
  designerComponent: DesignerComponent,
  formComponent: FormComponent,
  propertiesComponent: PropertiesComponent,
  validate: (element, value) => {
    const elementTyped = element as CustomInstance;
    if (elementTyped.extraAttributes.required) {
      return value === "true";
    }

    return true;
  },
};
