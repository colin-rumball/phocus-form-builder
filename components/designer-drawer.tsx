"use client";

import { cn } from "@/lib/utils";
import { type ReactNode, type ComponentPropsWithoutRef } from "react";
import { type FormElement, FormElements } from "./form-elements";
import { Button } from "./ui/button";
import Headline from "./ui/headline";
import useDesigner from "@/lib/hooks/useDesigner";
import short from "short-uuid";
import { DrawerClose } from "./ui/drawer";

type DesignerDrawerProps = ComponentPropsWithoutRef<"div">;

const DesignerDrawer = ({ className }: DesignerDrawerProps) => {
  return (
    <div className={cn("flex h-full px-8", className)}>
      <div className="flex flex-col">
        <DrawerSection title="Layout Elements">
          <DrawerBtnElement formElement={FormElements.TitleField} />
          <DrawerBtnElement formElement={FormElements.SubtitleField} />
          <DrawerBtnElement formElement={FormElements.ParagraphField} />
          <DrawerBtnElement formElement={FormElements.SeparatorField} />
          <DrawerBtnElement formElement={FormElements.SpacerField} />
        </DrawerSection>

        <DrawerSection title="Form Elements">
          <DrawerBtnElement formElement={FormElements.TextField} />
          <DrawerBtnElement formElement={FormElements.TextAreaField} />
          <DrawerBtnElement formElement={FormElements.NumberField} />
          <DrawerBtnElement formElement={FormElements.DateField} />
          <DrawerBtnElement formElement={FormElements.SelectField} />
          <DrawerBtnElement formElement={FormElements.CheckboxField} />
        </DrawerSection>
      </div>
    </div>
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
      <div className="flex items-center gap-2">{children}</div>
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
    const newElement = FormElements[formElement.type].construct(
      short.generate(),
    );
    addElement(elements.length, newElement);
  };

  return (
    <DrawerClose asChild>
      <Button
        variant={"outline"}
        className={cn("flex h-[120px] w-[120px] flex-col gap-2")}
        onClick={onClick}
      >
        <Icon className="h-8 w-8 text-primary" />
        <p className="">{label}</p>
      </Button>
    </DrawerClose>
  );
};
