"use client";

import { cn, generateId } from "@/lib/utils";
import { type ReactNode, type ComponentPropsWithoutRef } from "react";
import { type FormElement, FormElements } from "./form-elements";
import { Button } from "./ui/button";
import Headline from "./ui/headline";
import useDesigner from "@/lib/hooks/useDesigner";
import short from "short-uuid";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTrigger,
} from "./ui/drawer";
import { FaPlus } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";

type DesignerDrawerProps = ComponentPropsWithoutRef<"div">;

const DesignerDrawer = ({ className }: DesignerDrawerProps) => {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant={"secondary"} className="h-auto rounded-full p-3">
          <FaPlus className="h-7 w-7" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerClose>
            <IoCloseSharp className="absolute right-4 top-4 h-7 w-7" />
          </DrawerClose>
        </DrawerHeader>
        <div className={cn("flex h-full px-8", className)}>
          <div className="flex flex-col">
            <DrawerSection title="Layout Elements">
              <DrawerBtnElement formElement={FormElements.TitleField} />
              <DrawerBtnElement formElement={FormElements.SubtitleField} />
              <DrawerBtnElement formElement={FormElements.ParagraphField} />
              <DrawerBtnElement formElement={FormElements.SeparatorField} />
              <DrawerBtnElement formElement={FormElements.SpacerField} />
              <DrawerBtnElement formElement={FormElements.ImageField} />
            </DrawerSection>

            <DrawerSection title="Form Elements">
              <DrawerBtnElement formElement={FormElements.TextField} />
              <DrawerBtnElement formElement={FormElements.TextAreaField} />
              <DrawerBtnElement formElement={FormElements.NumberField} />
              <DrawerBtnElement formElement={FormElements.PhoneNumberField} />
              <DrawerBtnElement formElement={FormElements.EmailField} />
              <DrawerBtnElement formElement={FormElements.DateField} />
              <DrawerBtnElement formElement={FormElements.SelectField} />
              <DrawerBtnElement formElement={FormElements.SingleSelectField} />
              <DrawerBtnElement formElement={FormElements.MultiSelectField} />
              <DrawerBtnElement formElement={FormElements.CheckboxField} />
            </DrawerSection>
          </div>
        </div>
        <DrawerFooter></DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default DesignerDrawer;

const DrawerSection = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => {
  return (
    <div className="mb-4 flex flex-col gap-1">
      <Headline as="h3" className="">
        {title}
      </Headline>
      <div className="flex flex-wrap items-center gap-2">{children}</div>
    </div>
  );
};

const DrawerBtnElement = ({ formElement }: { formElement: FormElement }) => {
  const { addElement, elements } = useDesigner((state) => ({
    addElement: state.addElement,
    elements: state.elements,
  }));
  const { icon: Icon, label } = formElement.designerButton;

  const onClick = () => {
    const newElement = FormElements[formElement.type].construct(generateId());
    addElement(elements.length, newElement);
  };

  return (
    <DrawerClose asChild>
      <Button
        variant={"outline"}
        className={cn(
          "flex h-[120px] w-[120px] flex-col items-center justify-center gap-2",
        )}
        onClick={onClick}
      >
        <Icon className="h-8 w-8 text-primary" />
        <p className="whitespace-break-spaces text-center">{label}</p>
      </Button>
    </DrawerClose>
  );
};
