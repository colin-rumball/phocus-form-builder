"use client";

import { cn } from "@/lib/utils";
import { type ComponentPropsWithoutRef } from "react";
import { useDndMonitor, useDraggable, useDroppable } from "@dnd-kit/core";
import { type FormElementInstance, FormElements } from "./form-elements";
import useDesigner from "@/lib/hooks/useDesigner";
import { Button } from "./ui/button";
import FormGenerator from "./form-generator";
import { PiDotsSixBold } from "react-icons/pi";
import FormElementInspector from "./form-element-inspector";
import { HiTrash } from "react-icons/hi2";
import DesignerControls from "./designer-controls";

type DesignerProps = ComponentPropsWithoutRef<"div">;

const Designer = ({ className }: DesignerProps) => {
  const { elements, selectedElement, setSelectedElement, moveElement } =
    useDesigner((state) => ({
      elements: state.elements,
      selectedElement: state.selectedElement,
      setSelectedElement: state.setSelectedElement,
      moveElement: state.moveElement,
    }));

  const droppable = useDroppable({
    id: "designer-drop-area",
    data: {
      isDesignerDropArea: true,
    },
  });

  useDndMonitor({
    onDragEnd: ({ active, over }) => {
      if (!active || !over) return;

      const isDroppingOverDesignerElementTopHalf =
        !!over.data?.current?.isTopHalfDesignerElement;
      const isDroppingOverDesignerElementBottomHalf =
        !!over.data?.current?.isBottomHalfDesignerElement;
      const isDroppingOverDesignerElement =
        isDroppingOverDesignerElementTopHalf ||
        isDroppingOverDesignerElementBottomHalf;

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
    <div
      ref={droppable.setNodeRef}
      className={cn("flex h-full w-full py-xl", className)}
    >
      <div
        className="relative h-full w-full transition-all"
        onClick={(e) => {
          e.stopPropagation();
          if (selectedElement) setSelectedElement(null);
        }}
      >
        <div
          className={cn(
            "m-auto flex h-auto max-w-[620px] flex-col items-center overflow-y-auto rounded-xl bg-background p-4",
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
                  <>
                    <DesignerElementWrapper
                      key={element.id}
                      element={element}
                    />
                    {selectedElement === element && (
                      <div className="flex w-full justify-center">
                        <DesignerControls droppable={droppable} />
                      </div>
                    )}
                  </>
                );
              })}
            </div>
          )}
          {!selectedElement && <DesignerControls droppable={droppable} />}
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
  const { selectedElement, setSelectedElement, removeElement } = useDesigner(
    (state) => ({
      selectedElement: state.selectedElement,
      setSelectedElement: state.setSelectedElement,
      removeElement: state.removeElement,
    }),
  );

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
            isSelectedElement && "my-2 h-7",
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
          <Button
            variant={"ghost"}
            className="p-2 transition-all hover:scale-110 hover:text-destructive"
            onClick={() => {
              removeElement(element.id);
              setSelectedElement(null);
            }}
          >
            <HiTrash className="h-6 w-6" />
          </Button>
          {!!selectedElement && (
            <FormElementInspector element={selectedElement} />
          )}
        </div>
        <div className="w-full">
          <DesignerElement element={element} />
        </div>
      </div>
    </div>
  );
};

export default Designer;
