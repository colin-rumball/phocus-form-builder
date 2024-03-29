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
import { LuHeading2 } from "react-icons/lu";
import Headline from "../ui/headline";

const type: ElementsType = "SubtitleField";

const extraAttributes = {
  subtitle: "Subtitle",
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
        <Label className="text-muted-foreground">
          {extraAttributes.subtitle}
        </Label>
      )}
      <FormComponent element={element} />
    </div>
  );
};

const FormComponent = ({ element }: FormElementFormComponentProps) => {
  const elementTyped = element as CustomInstance;
  const { subtitle } = elementTyped.extraAttributes;
  return <Headline as="h2">{subtitle}</Headline>;
};

const propertiesSchema = z.object({
  subtitle: z.string().min(2).max(50),
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
      subtitle: elementTyped.extraAttributes.subtitle,
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
          name="subtitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subtitle</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") e.currentTarget.blur();
                  }}
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

export const SubtitleFieldFormElement: FormElement = {
  type,
  construct: (id) => ({
    id,
    type,
    extraAttributes: extraAttributes,
  }),
  designerButton: {
    icon: LuHeading2,
    label: "Subtitle Field",
  },
  designerComponent: DesignerComponent,
  formComponent: FormComponent,
  propertiesComponent: PropertiesComponent,
  validate: () => true,
};
