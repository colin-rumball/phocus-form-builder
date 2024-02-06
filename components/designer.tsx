"use client";

import { cn, generateId } from "@/lib/utils";
import { useState, type ComponentPropsWithoutRef, useTransition } from "react";
import { useDndMonitor, useDraggable, useDroppable } from "@dnd-kit/core";
import { type FormElementInstance, FormElements } from "./form-elements";
import useDesigner from "@/lib/hooks/useDesigner";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Textarea } from "./ui/textarea";
import { api } from "@/convex/_generated/api";
import { useAction } from "convex/react";
import FormGenerator from "./form-generator";
import { SiOpenai } from "react-icons/si";
import DesignerDrawer from "./designer-drawer";
import { PiDotsSixBold } from "react-icons/pi";
import FormElementInspector from "./form-element-inspector";
import { HiTrash } from "react-icons/hi2";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { RxReset } from "react-icons/rx";
import SimpleLoadingSpinner from "./loading-icons";

type DesignerProps = ComponentPropsWithoutRef<"div">;

const Designer = ({ className }: DesignerProps) => {
  const {
    elements,
    addElement,
    selectedElement,
    removeAllElements,
    setSelectedElement,
    moveElement,
  } = useDesigner((state) => ({
    elements: state.elements,
    addElement: state.addElement,
    removeAllElements: state.removeAllElements,
    selectedElement: state.selectedElement,
    setSelectedElement: state.setSelectedElement,
    moveElement: state.moveElement,
  }));
  const { undo, pastStates } = useDesigner.temporal.getState();

  const [generating, startTransition] = useTransition();
  const [openAIUserInput, setOpenAIUserInput] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const generate = useAction(api.openai.generate);

  const droppable = useDroppable({
    id: "designer-drop-area",
    data: {
      isDesignerDropArea: true,
    },
  });

  const generateFormElements = async () => {
    const rawResponse = await generate({
      messageBody: openAIUserInput,
    });

    setOpenAIUserInput("");
    setDialogOpen(false);

    if (rawResponse === null) {
      console.log("No response");
      return;
    }

    try {
      const jsonResponse = JSON.parse(rawResponse) as {
        elements: FormElementInstance[];
      };
      const newElements = jsonResponse.elements;

      newElements.forEach((element, index) => {
        element.id = generateId();
        addElement(elements.length + index, element);
      });
    } catch (e) {
      console.log("Error parsing openai response", rawResponse);

      console.error(e);
      return;
    }
  };

  useDndMonitor({
    onDragEnd: ({ active, over }) => {
      if (!active || !over) return;

      //const isDesignerBtnElement = !!active.data?.current?.isDesignerBtnElement;
      //const isDroppingOverDesignerDropArea = !!over.data?.current?.isDesignerDropArea;
      const isDroppingOverDesignerElementTopHalf =
        !!over.data?.current?.isTopHalfDesignerElement;
      const isDroppingOverDesignerElementBottomHalf =
        !!over.data?.current?.isBottomHalfDesignerElement;
      const isDroppingOverDesignerElement =
        isDroppingOverDesignerElementTopHalf ||
        isDroppingOverDesignerElementBottomHalf;

      // if (isDesignerBtnElement) {
      //   // New element from
      //   const type = active.data.current?.type as ElementsType;

      //   const newElement = FormElements[type].construct(generateId());
      //   if (isDroppingOverDesignerDropArea) {
      //     // add to the bottom
      //     if (type !== "OpenAIField") {
      //       addElement(elements.length, newElement);
      //       return;
      //     } else {
      //       setDialogOpen(true);
      //       selectedIndex.current = elements.length;
      //       return;
      //     }
      //   } else {
      //     // add in place of another element
      //     if (isDroppingOverDesignerElement) {
      //       let newElementIndex = elements.findIndex(
      //         (e) => e.id === over.data.current?.elementId,
      //       );
      //       if (newElementIndex === -1) throw new Error("Element not found");
      //       if (isDroppingOverDesignerElementBottomHalf) newElementIndex += 1;
      //       if (type !== "OpenAIField") {
      //         addElement(newElementIndex, newElement);
      //       } else {
      //         setDialogOpen(true);
      //         selectedIndex.current = newElementIndex;
      //       }
      //       return;
      //     }
      //   }
      // }

      const isDesignerElement = !!active.data?.current?.isDesignerElement;

      if (isDesignerElement) {
        const activeId = active.data.current?.elementId as string;
        const activeElementIndex = elements.findIndex((e) => e.id === activeId);

        if (activeElementIndex === -1)
          throw new Error("Active element index not found");

        const activeElement = elements[activeElementIndex];
        if (!activeElement) throw new Error("Active element not found");

        if (isDroppingOverDesignerElement) {
          // Dropping over another element
          const overId = over.data.current?.elementId as string;
          const overElementIndex = elements.findIndex((e) => e.id === overId);

          if (overElementIndex === -1)
            throw new Error("Over element not found");

          let newElementIndex = overElementIndex;
          if (isDroppingOverDesignerElementBottomHalf) newElementIndex += 1;
          moveElement(activeElement.id, newElementIndex);
        } else {
          // Dropping over the drop area
          // moveElement(activeElement.id, elements.length);
        }
      }
    },
  });

  return (
    <div className={cn("my-lg flex h-full w-full", className)}>
      <div
        className="h-full w-full transition-all"
        onClick={(e) => {
          e.stopPropagation();
          if (selectedElement) setSelectedElement(null);
        }}
      >
        <div
          ref={droppable.setNodeRef}
          className={cn(
            "m-auto flex h-full max-w-[620px] flex-col items-center overflow-y-auto rounded-xl bg-background",
          )}
        >
          {elements.length === 0 && <FormGenerator className="mt-16" />}
          {!droppable.isOver && elements.length === 0 && (
            <p className="flex flex-grow items-center text-xl font-bold text-muted-foreground">
              Or add form fields manually
            </p>
          )}
          {elements.length > 0 && (
            <div className="flex w-full flex-col gap-0 p-1">
              {elements.map((element: FormElementInstance) => {
                return (
                  <DesignerElementWrapper key={element.id} element={element} />
                );
              })}
            </div>
          )}
          <div
            className={cn(
              "my-6 flex items-center space-x-4",
              droppable.active && "hidden",
            )}
          >
            <DesignerDrawer />

            {elements.length !== 0 && (
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant={"default"}
                    className="flex h-auto space-x-3 rounded-full p-3"
                  >
                    <SiOpenai className="h-7 w-7" />
                    <span>Add using AI</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="flex flex-col gap-3 p-4">
                  <DialogHeader>
                    <DialogTitle>Generate Elements Using AI</DialogTitle>
                    <DialogDescription>
                      Describe the elements you're trying to add and we'll
                      generate it for you.
                    </DialogDescription>
                  </DialogHeader>
                  <Textarea
                    rows={5}
                    onChange={(e) => setOpenAIUserInput(e.target.value)}
                    value={openAIUserInput}
                  />
                  <DialogFooter>
                    <Button
                      className="gap-2"
                      disabled={generating}
                      onClick={(e) => {
                        e.preventDefault();
                        startTransition(generateFormElements);
                      }}
                    >
                      Generate{" "}
                      {generating && <SimpleLoadingSpinner className="" />}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const DesignerElementWrapper = ({
  element,
}: {
  element: FormElementInstance;
}) => {
  const { selectedElement, setSelectedElement } = useDesigner((state) => ({
    selectedElement: state.selectedElement,
    setSelectedElement: state.setSelectedElement,
  }));

  const topHalf = useDroppable({
    id: element.id + "-top-half",
    data: {
      type: element.type,
      elementId: element.id,
      isTopHalfDesignerElement: true,
    },
  });
  const bottomHalf = useDroppable({
    id: element.id + "-bottom-half",
    data: {
      type: element.type,
      elementId: element.id,
      isBottomHalfDesignerElement: true,
    },
  });

  const draggable = useDraggable({
    id: element.id + "-drag-handler",
    data: {
      type: element.type,
      elementId: element.id,
      isDesignerElement: true,
    },
  });
  if (draggable.isDragging)
    return <div className="relative m-2 h-8 rounded-md bg-accent"></div>;

  const isSelectedElement = selectedElement?.id === element.id;
  const DesignerElement = FormElements[element.type].designerComponent;
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        setSelectedElement(element);
      }}
      className={cn(
        "relative m-1 flex h-auto flex-col rounded-md text-foreground",
      )}
    >
      {!isSelectedElement && (
        <>
          <div
            ref={topHalf.setNodeRef}
            className={cn(
              "absolute inset-x-0 top-0 h-1/2 rounded-t-md",
              // topHalf.isOver && "bg-primary/20",
            )}
          />
          <div
            ref={bottomHalf.setNodeRef}
            className={cn(
              "absolute inset-x-0 bottom-0 h-1/2 rounded-b-md",
              // bottomHalf.isOver && "bg-primary/20",
            )}
          />
          {topHalf.isOver && (
            <div className="absolute top-0 h-[7px] w-full rounded-md rounded-b-none bg-primary" />
          )}
          {bottomHalf.isOver && (
            <div className="absolute bottom-0 h-[7px] w-full rounded-md rounded-t-none bg-primary" />
          )}
        </>
      )}

      <div
        className={cn(
          "flex h-full w-full flex-col items-center rounded-md px-4 py-0 transition-all",
          isSelectedElement && "bg-accent ring-1 ring-foreground",
        )}
      >
        <div
          className={cn(
            "relative m-0 flex h-0 w-full items-center justify-end overflow-hidden transition-all",
            isSelectedElement && "mb-2 h-7",
          )}
        >
          <div
            ref={draggable.setNodeRef}
            {...draggable.attributes}
            {...draggable.listeners}
            className="absolute left-1/2 -translate-x-1/2 cursor-grab active:cursor-grabbing"
          >
            <PiDotsSixBold className="h-7 w-7" />
          </div>
          {!!selectedElement && (
            <FormElementInspector element={selectedElement} />
          )}
        </div>
        <DesignerElement element={element} />
      </div>
    </div>
  );
};

export default Designer;
