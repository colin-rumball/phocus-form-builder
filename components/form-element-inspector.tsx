import { cn } from "@/lib/utils";
import { useState, type ComponentPropsWithoutRef } from "react";
import { type FormElementInstance, FormElements } from "./form-elements";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { HiOutlineCog8Tooth } from "react-icons/hi2";

type FormElementInspectorProps = ComponentPropsWithoutRef<"div"> & {
  element: FormElementInstance;
};

const FormElementInspector = ({
  className,
  element,
}: FormElementInspectorProps) => {
  const [sheetOpen, setSheetOpen] = useState(false);

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
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default FormElementInspector;
