"use client";

import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
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
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { AiOutlineClose, AiOutlinePlus } from "react-icons/ai";
import useDesigner from "@/lib/hooks/useDesigner";
import {
  type ElementsType,
  type FormElementInstance,
  type SubmitFunction,
  type FormElement,
} from "../form-elements";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { GoCheckbox } from "react-icons/go";
import { Checkbox } from "../ui/checkbox";

const type: ElementsType = "MultiSelectField";

const extraAttributes = {
  label: "Multi Select Field Label",
  helperText: "Helper text",
  required: false,
  placeHolder: "Value here...",
  options: [] as string[],
};

type CustomInstance = FormElementInstance & {
  extraAttributes: typeof extraAttributes;
};

const propertiesSchema = z.object({
  label: z.string().min(2).max(50),
  helperText: z.string().max(200),
  required: z.boolean().default(false),
  placeHolder: z.string().max(50),
  options: z.array(z.string()).default([]),
});

function DesignerComponent({ element }: { element: FormElementInstance }) {
  const elementTyped = element as CustomInstance;
  const { label, required, placeHolder, helperText } =
    elementTyped.extraAttributes;
  return <FormComponent element={elementTyped} />;
}

function FormComponent({
  element,
  submitValue,
  isInvalid,
  defaultValue,
}: {
  element: FormElementInstance;
  submitValue?: SubmitFunction;
  isInvalid?: boolean;
  defaultValue?: string;
}) {
  const elementTyped = element as CustomInstance;

  const [value, setValue] = useState<string[]>([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    setError(isInvalid === true);
  }, [isInvalid]);

  const { label, required, placeHolder, helperText, options } =
    elementTyped.extraAttributes;
  return (
    <div
      className="flex w-full flex-col gap-2"
      onBlur={() => {
        if (!submitValue) return;
        const valid = MultiSelectFieldFormElement.validate(
          elementTyped,
          value.join(","),
        );
        setError(!valid);
        submitValue(elementTyped.id, value.join(","));
      }}
    >
      <Label className={cn(error && "text-red-500")}>
        {label}
        {required && "*"}
      </Label>
      <div
        className="grid grid-cols-2"
        // onValueChange={(value) => {
        //   setValue(value);
        //   if (!submitValue) return;

        //   submitValue(elementTyped.id, value);
        // }}
      >
        {options.map((option, index) => (
          <div className="flex items-center space-x-2" key={index}>
            <Checkbox
              value={option}
              id={option}
              onCheckedChange={(state) => {
                if (state) {
                  setValue([...value, option]);
                } else {
                  setValue(value.filter((v) => v !== option));
                }
              }}
            />
            <Label htmlFor={option}>{option}</Label>
          </div>
        ))}
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
}

type propertiesFormSchemaType = z.infer<typeof propertiesSchema>;
function PropertiesComponent({
  element: elementInstance,
}: {
  element: FormElementInstance;
}) {
  const elementTyped = elementInstance as CustomInstance;
  const { updateElement, setSelectedElement } = useDesigner((state) => ({
    updateElement: state.updateElement,
    setSelectedElement: state.setSelectedElement,
  }));
  const form = useForm<propertiesFormSchemaType>({
    resolver: zodResolver(propertiesSchema),
    mode: "onSubmit",
    defaultValues: {
      label: elementTyped.extraAttributes.label,
      helperText: elementTyped.extraAttributes.helperText,
      required: elementTyped.extraAttributes.required,
      placeHolder: elementTyped.extraAttributes.placeHolder,
      options: elementTyped.extraAttributes.options,
    },
  });

  useEffect(() => {
    form.reset(elementTyped.extraAttributes);
  }, [elementTyped, form]);

  const applyChanges = (data: propertiesFormSchemaType) => {
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
        className="space-y-3"
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
                field
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="placeHolder"
          render={({ field }) => (
            <FormItem>
              <FormLabel>PlaceHolder</FormLabel>
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
                The helper text of the field. <br />
                It will be displayed below the field.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Separator />
        <FormField
          control={form.control}
          name="options"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>Options</FormLabel>
                <Button
                  variant={"outline"}
                  className="gap-2"
                  onClick={(e) => {
                    e.preventDefault(); // avoid submit
                    form.setValue("options", field.value.concat("New option"));
                  }}
                >
                  <AiOutlinePlus />
                  Add
                </Button>
              </div>
              <div className="flex flex-col gap-2">
                {field.value.map((option, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between gap-1"
                  >
                    <Input
                      placeholder=""
                      value={option}
                      onChange={(e) => {
                        field.value[index] = e.target.value;
                        field.onChange(field.value);
                      }}
                    />
                    <Button
                      variant={"ghost"}
                      size={"icon"}
                      onClick={(e) => {
                        e.preventDefault();
                        const newOptions = [...field.value];
                        newOptions.splice(index, 1);
                        field.onChange(newOptions);
                      }}
                    >
                      <AiOutlineClose />
                    </Button>
                  </div>
                ))}
              </div>

              <FormDescription>
                The helper text of the field. <br />
                It will be displayed below the field.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Separator />
        <FormField
          control={form.control}
          name="required"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>Required</FormLabel>
                <FormDescription>
                  The helper text of the field. <br />
                  It will be displayed below the field.
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
}

export const MultiSelectFieldFormElement: FormElement = {
  type,
  construct: (id: string) => ({
    id,
    type,
    extraAttributes,
  }),
  designerButton: {
    icon: GoCheckbox,
    label: "Multi Select",
  },
  designerComponent: DesignerComponent,
  formComponent: FormComponent,
  propertiesComponent: PropertiesComponent,

  validate: (
    formElement: FormElementInstance,
    currentValue: string,
  ): boolean => {
    const element = formElement as CustomInstance;
    if (element.extraAttributes.required) {
      return currentValue.length > 0;
    }

    return true;
  },
};
