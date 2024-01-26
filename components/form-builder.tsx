"use client";

import { type Doc } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { type ComponentPropsWithoutRef } from "react";
import Headline from "./ui/headline";
import { Button } from "./ui/button";
import { MdOutlinePublish, MdPreview } from "react-icons/md";
import { HiSaveAs } from "react-icons/hi";
import Image from "next/image";
import TopographySVG from "@/public/svg/topography.svg";
import Designer from "./designer";
import {
  DndContext,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import DragOverlayWrapper from "./drag-overlay-wrapper";
import { useDesigner } from "@/lib/hooks/useDesigner";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { FormElements } from "./form-elements";

type FormBuilderProps = ComponentPropsWithoutRef<"div"> & {
  form: Doc<"forms">;
};

const FormBuilder = ({ form, className }: FormBuilderProps) => {
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 10,
    },
  });

  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 300,
      tolerance: 5,
    },
  });

  const sensors = useSensors(mouseSensor, touchSensor);
  return (
    <DndContext sensors={sensors}>
      <div className="flex h-full w-full flex-col">
        <nav className="flex items-center justify-between gap-3 border-b-2 p-4">
          <Headline as="h3" className="truncate font-medium">
            <span className="mr-2 text-muted-foreground">Form:</span>
            {form.name}
          </Headline>
          <div className="flex items-center gap-2">
            <PreviewDialogBtn />
            {!form.published && (
              <>
                <SaveFormBtn />
                <PublishFormBtn />
              </>
            )}
          </div>
        </nav>
        <div className="relative flex w-full flex-grow items-center justify-center overflow-y-auto bg-accent bg-[url(/svg/graph-paper.svg)] dark:bg-[url(/svg/graph-paper-dark.svg)]">
          <Designer />
        </div>
      </div>
      <DragOverlayWrapper />
    </DndContext>
  );
};

export default FormBuilder;

const PreviewDialogBtn = () => {
  const { elements } = useDesigner();
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"outline"} className={cn("gap-2")}>
          <MdPreview className="h-6 w-6" />
          Preview
        </Button>
      </DialogTrigger>
      <DialogContent className="flex h-screen max-h-screen w-screen max-w-full flex-grow flex-col gap-0 p-0">
        <div className="border-b px-4 py-2">
          <p className="text-lg font-bold text-muted-foreground">
            Form Preview
          </p>
          <p className="text-muted-foreground">
            This is how your form will look to users
          </p>
        </div>
        <div className="flex flex-grow flex-col items-center justify-center overflow-y-auto bg-accent bg-[url(/svg/graph-paper.svg)] p-4 dark:bg-[url(/svg/graph-paper-dark.svg)]">
          <div className="flex h-full w-full max-w-[620px] flex-grow flex-col gap-4 overflow-y-auto rounded-2xl bg-background p-8">
            {elements.map((element) => {
              const FormComponent = FormElements[element.type].formComponent;
              return <FormComponent key={element.id} element={element} />;
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
const SaveFormBtn = () => {
  return (
    <Button className={cn("gap-2")}>
      <HiSaveAs className="h-4 w-4" />
      Save
    </Button>
  );
};

const PublishFormBtn = () => {
  return (
    <Button
      className={cn(
        "gap-2 bg-gradient-to-r from-indigo-400 to-cyan-400 text-white",
      )}
    >
      <MdOutlinePublish className="h-4 w-4" /> Publish
    </Button>
  );
};
