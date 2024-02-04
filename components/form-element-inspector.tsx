import { cn } from "@/lib/utils";
import { useState, type ComponentPropsWithoutRef } from "react";
import { type FormElementInstance, FormElements } from "./form-elements";
import Headline from "./ui/headline";
import { Button } from "./ui/button";
import { AiOutlineClose } from "react-icons/ai";
import useDesigner from "@/lib/hooks/useDesigner";
import { Separator } from "./ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { HiTrash } from "react-icons/hi";
import { HiOutlineCog8Tooth } from "react-icons/hi2";

type FormElementInspectorProps = ComponentPropsWithoutRef<"div"> & {
  element: FormElementInstance;
};

const FormElementInspector = ({
  className,
  element,
}: FormElementInspectorProps) => {
  const [sheetOpen, setSheetOpen] = useState(false);
  const { setSelectedElement, removeElement } = useDesigner((state) => ({
    setSelectedElement: state.setSelectedElement,
    removeElement: state.removeElement,
  }));

  if (!element) return null;
  const PropertiesForm = FormElements[element.type].propertiesComponent;
  return (
    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
      <SheetTrigger asChild>
        <Button
          variant={"ghost"}
          className="p-2 transition-all hover:scale-110 hover:text-primary"
        >
          <HiOutlineCog8Tooth className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side={"left"}>
        <SheetHeader>
          <SheetTitle>Form Element Properties</SheetTitle>
          <Separator />
          <SheetDescription></SheetDescription>
        </SheetHeader>
        <div className={cn("my-4 flex flex-col gap-6", className)}>
          <PropertiesForm element={element} />

          <Button
            className="flex w-full justify-center gap-2 text-center"
            variant={"destructive"}
            onClick={() => {
              removeElement(element.id);
              setSheetOpen(false);
              setSelectedElement(null);
            }}
          >
            <HiTrash className="h-5 w-5" />
            <span>Delete Form Element</span>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default FormElementInspector;
