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
import { useEffect } from "react";
import useDesigner from "@/lib/hooks/useDesigner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { LuHeading1, LuSeparatorHorizontal } from "react-icons/lu";
import { Slider } from "../ui/slider";
import { cn } from "@/lib/utils";

const type: ElementsType = "SpacerField";

const extraAttributes = {
  height: 20,
};

type CustomInstance = FormElementInstance & {
  extraAttributes: typeof extraAttributes;
};

const propertiesSchema = z.object({
  height: z.number().min(5).max(250),
});

const DesignerComponent = ({ element }: { element: FormElementInstance }) => {
  const { selectedElement } = useDesigner((state) => ({
    selectedElement: state.selectedElement,
  }));
  const elementTyped = element as CustomInstance;
  const { height } = elementTyped.extraAttributes;
  const isSelected = selectedElement === element;
  return (
    <div className="flex h-full w-full flex-col justify-center gap-0">
      {isSelected && (
        <>
          <Label className="mb-24 text-muted-foreground">
            Spacer: {height}px
          </Label>
          <div
            className={cn(
              "pointer-events-none absolute inset-0 flex select-none items-center justify-center transition-all",
            )}
          >
            <LuSeparatorHorizontal className="h-8 w-8" />
          </div>
        </>
      )}
      <FormComponent element={element} />
    </div>
  );
};

const FormComponent = ({ element }: FormElementFormComponentProps) => {
  const elementTyped = element as CustomInstance;
  const { height } = elementTyped.extraAttributes;
  return <div style={{ height }} className="w-full" />;
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
      height: elementTyped.extraAttributes.height,
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
          name="height"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Height: {field.value}px</FormLabel>
              <FormControl className="pt-2">
                <Slider
                  defaultValue={[field.value]}
                  min={5}
                  max={250}
                  step={5}
                  onValueChange={(value) => field.onChange(value[0])}
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

export const SpacerFieldFormElement: FormElement = {
  type,
  construct: (id) => ({
    id,
    type,
    extraAttributes: extraAttributes,
  }),
  designerButton: {
    icon: LuSeparatorHorizontal,
    label: "Spacer",
  },
  designerComponent: DesignerComponent,
  formComponent: FormComponent,
  propertiesComponent: PropertiesComponent,
  validate: () => true,
};
