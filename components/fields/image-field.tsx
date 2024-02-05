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
import { cn } from "@/lib/utils";
import { RiFileUploadLine } from "react-icons/ri";
import { UploadButton } from "../uploadthing";
import { CiImageOn } from "react-icons/ci";
import Image from "next/image";

const type: ElementsType = "ImageField";

const extraAttributes = {
  label: "Image Field Label",
  helperText: "Helper text",
  imageUrl: null,
};

type CustomInstance = FormElementInstance & {
  extraAttributes: typeof extraAttributes;
};

const propertiesSchema = z.object({
  label: z.string().max(50),
  helperText: z.string().max(200),
  imageUrl: z.string().nullable(),
});

const DesignerComponent = ({ element }: { element: FormElementInstance }) => {
  const elementTyped = element as CustomInstance;
  const { label, imageUrl, helperText } = elementTyped.extraAttributes;
  return (
    <div className="flex w-full flex-col gap-2">
      <Label>{label}</Label>
      {imageUrl && (
        <Image
          src={imageUrl}
          className="h-auto w-full rounded-lg"
          alt={helperText || "Uploaded Image"}
          width={620}
          height={500}
        />
      )}
      {!imageUrl && (
        <div className="flex h-40 w-full items-center justify-center rounded-lg border-2 border-dotted bg-transparent">
          <RiFileUploadLine className="h-10 w-10" />
        </div>
      )}
      {helperText && (
        <p className={cn("text-[0.8rem] text-muted-foreground")}>
          {helperText}
        </p>
      )}
    </div>
  );
};

const FormComponent = ({
  element,
  submitValue,
  defaultValue,
  isInvalid,
}: FormElementFormComponentProps) => {
  const elementTyped = element as CustomInstance;
  const [error, setError] = useState(false);

  useEffect(() => {
    if (isInvalid) {
      setError(true);
    }
  }, [isInvalid]);

  const { label, helperText, imageUrl } = elementTyped.extraAttributes;
  return (
    <div className="flex w-full flex-col gap-2">
      <Label className={cn(error && "text-red-500")}>{label}</Label>
      {imageUrl && (
        <Image
          src={imageUrl}
          className="h-auto w-full rounded-lg"
          alt={helperText || "Uploaded Image"}
          width={620}
          height={500}
        />
      )}
      {!imageUrl && (
        <div className="flex h-40 w-full items-center justify-center rounded-lg border-2 border-dotted bg-transparent">
          <RiFileUploadLine className="h-10 w-10" />
        </div>
      )}
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
  const [propImageUrl, setPropImageUrl] = useState<string | null>(
    elementTyped.extraAttributes.imageUrl,
  );
  const form = useForm<z.infer<typeof propertiesSchema>>({
    resolver: zodResolver(propertiesSchema),
    mode: "onBlur",
    defaultValues: {
      label: elementTyped.extraAttributes.label,
      helperText: elementTyped.extraAttributes.helperText,
    },
  });

  useEffect(() => {
    form.reset(elementTyped.extraAttributes);
  }, [elementTyped, form]);

  const applyChanges = (data: z.infer<typeof propertiesSchema>) => {
    updateElement(elementTyped.id, {
      ...elementTyped,
      extraAttributes: { ...data, imageUrl: propImageUrl },
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
        <div className="my-4">
          <FormLabel>Image</FormLabel>
          {propImageUrl && (
            <Image
              src={propImageUrl}
              className="my-2 h-auto w-full rounded-lg"
              alt={"Uploaded Image"}
              width={620}
              height={500}
            />
          )}
          <UploadButton
            endpoint="imageUploader"
            onClientUploadComplete={(res) => {
              // Do something with the response
              if (res.length > 0 && res[0]?.url) {
                setPropImageUrl(res[0]?.url);
                updateElement(elementTyped.id, {
                  ...elementTyped,
                  extraAttributes: {
                    ...elementTyped.extraAttributes,
                    imageUrl: res[0]?.url,
                  },
                });
              }
              console.log("Files: ", res);
            }}
            onUploadError={(error: Error) => {
              // TODO: Do something with the error.
              alert(error.message);
            }}
          />
        </div>
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
      </form>
    </Form>
  );
};

export const ImageFieldFormElement: FormElement = {
  type,
  construct: (id) => ({
    id,
    type,
    extraAttributes: extraAttributes,
  }),
  designerButton: {
    icon: CiImageOn,
    label: "Image Field",
  },
  designerComponent: DesignerComponent,
  formComponent: FormComponent,
  propertiesComponent: PropertiesComponent,
  validate: (element, value) => {
    return true;
  },
};
