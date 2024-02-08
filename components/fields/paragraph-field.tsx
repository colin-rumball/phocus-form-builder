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
import { BsTextParagraph } from "react-icons/bs";
import { Textarea } from "../ui/textarea";

const type: ElementsType = "ParagraphField";

const extraAttributes = {
  text: "Paragraph text here...",
};

type CustomInstance = FormElementInstance & {
  extraAttributes: typeof extraAttributes;
};

const propertiesSchema = z.object({
  text: z.string().min(2).max(500),
});

const DesignerComponent = ({ element }: { element: FormElementInstance }) => {
  const { selectedElement } = useDesigner((state) => ({
    selectedElement: state.selectedElement,
  }));
  return (
    <div className="flex h-auto w-full flex-col justify-center gap-0">
      {selectedElement === element && (
        <Label className="text-muted-foreground">Paragraph</Label>
      )}
      <FormComponent element={element} />
    </div>
  );
};

const FormComponent = ({ element }: FormElementFormComponentProps) => {
  const elementTyped = element as CustomInstance;

  const { text } = elementTyped.extraAttributes;
  return <p>{text}</p>;
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
      text: elementTyped.extraAttributes.text,
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
          name="text"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Text</FormLabel>
              <FormControl>
                <Textarea
                  rows={8}
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

export const ParagraphFieldFormElement: FormElement = {
  type,
  construct: (id) => ({
    id,
    type,
    extraAttributes: extraAttributes,
  }),
  designerButton: {
    icon: BsTextParagraph,
    label: "Paragraph Field",
  },
  designerComponent: DesignerComponent,
  formComponent: FormComponent,
  propertiesComponent: PropertiesComponent,
  validate: () => true,
};
