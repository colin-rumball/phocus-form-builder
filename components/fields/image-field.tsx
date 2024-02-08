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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const type: ElementsType = "ImageField";

type ImageFieldExtraAttributes = {
  label: string;
  helperText: string;
  imageUrl: string | null;
  size: "SMALL" | "MEDIUM" | "LARGE";
};

const extraAttributes: ImageFieldExtraAttributes = {
  label: "Image Label",
  helperText: "Helper text",
  imageUrl: null,
  size: "MEDIUM",
};

type CustomInstance = FormElementInstance & {
  extraAttributes: typeof extraAttributes;
};

const propertiesSchema = z.object({
  label: z.string().max(50),
  helperText: z.string().max(200),
  imageUrl: z.string().nullable(),
  size: z.union([z.literal("SMALL"), z.literal("MEDIUM"), z.literal("LARGE")]),
});

const DesignerComponent = ({ element }: { element: FormElementInstance }) => {
  const { selectedElement } = useDesigner((state) => ({
    selectedElement: state.selectedElement,
  }));
  return (
    <div className="flex h-auto w-full flex-col justify-center gap-0">
      {selectedElement === element && (
        <Label className="text-muted-foreground">Image</Label>
      )}
      <FormComponent element={element} />
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

  const { label, helperText, imageUrl, size } = elementTyped.extraAttributes;
  return (
    <div className="flex w-full flex-col gap-2">
      <Label className={cn(error && "text-red-500")}>{label}</Label>
      <div className="flex w-full justify-center">
        <div
          className={cn(
            "relative flex flex-col items-center gap-2",
            size === "SMALL" && "w-1/3",
            size === "MEDIUM" && "w-2/3",
            size === "LARGE" && "w-full",
          )}
        >
          {imageUrl && (
            <Image
              src={imageUrl}
              className="h-auto rounded-lg"
              alt={helperText || "Uploaded Image"}
              width={620}
              height={300}
            />
          )}
          {!imageUrl && (
            <div className="flex h-40 w-full items-center justify-center rounded-lg border-2 border-dotted bg-transparent">
              <RiFileUploadLine className="h-10 w-10" />
            </div>
          )}
        </div>
      </div>
      <p
        className={cn(
          "w-full text-[0.8rem] text-muted-foreground",
          error && "text-red-500",
        )}
      >
        {helperText}
      </p>
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
      size: elementTyped.extraAttributes.size,
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
          name="size"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Helper text</FormLabel>
              <FormControl>
                <Select onValueChange={(value) => field.onChange(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Image Size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SMALL">Small</SelectItem>
                    <SelectItem value="MEDIUM">Medium</SelectItem>
                    <SelectItem value="LARGE">Large</SelectItem>
                  </SelectContent>
                </Select>
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
    label: "Image",
  },
  designerComponent: DesignerComponent,
  formComponent: FormComponent,
  propertiesComponent: PropertiesComponent,
  validate: (element, value) => {
    return true;
  },
};
