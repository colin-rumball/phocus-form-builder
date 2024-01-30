"use client";

import { cn } from "@/lib/utils";
import { useState, type ComponentPropsWithoutRef } from "react";
import DesignerSidebar from "./designer-sidebar";
import { useDndMonitor, useDraggable, useDroppable } from "@dnd-kit/core";
import {
  type ElementsType,
  type FormElementInstance,
  FormElements,
} from "./form-elements";
import { useDesigner } from "@/lib/hooks/useDesigner";
import short from "short-uuid";
import { BiSolidTrash } from "react-icons/bi";
import { Button } from "./ui/button";

type DesignerProps = ComponentPropsWithoutRef<"div">;

const Designer = ({ className }: DesignerProps) => {
  const {
    elements,
    removeElement,
    addElement,
    selectedElement,
    setSelectedElement,
  } = useDesigner();

  const droppable = useDroppable({
    id: "designer-drop-area",
    data: {
      isDesignerDropArea: true,
    },
  });

  useDndMonitor({
    onDragEnd: ({ active, over }) => {
      if (!active || !over) return;

      const isDesignerBtnElement = !!active.data?.current?.isDesignerBtnElement;
      const isDroppingOverDesignerDropArea =
        !!over.data?.current?.isDesignerDropArea;
      const isDroppingOverDesignerElementTopHalf =
        !!over.data?.current?.isTopHalfDesignerElement;
      const isDroppingOverDesignerElementBottomHalf =
        !!over.data?.current?.isBottomHalfDesignerElement;
      const isDroppingOverDesignerElement =
        isDroppingOverDesignerElementTopHalf ||
        isDroppingOverDesignerElementBottomHalf;

      if (isDesignerBtnElement) {
        // New element from sidebar
        const type = active.data.current?.type as ElementsType;
        const newElement = FormElements[type].construct(short.generate());
        if (isDroppingOverDesignerDropArea) {
          // add to the bottom
          addElement(elements.length, newElement);
          return;
        } else {
          // add in place of another element
          if (isDroppingOverDesignerElement) {
            const index = elements.findIndex(
              (e) => e.id === over.data.current?.elementId,
            );
            if (index === -1) throw new Error("Element not found");
            let newElementIndex = index;
            if (isDroppingOverDesignerElementBottomHalf) newElementIndex += 1;
            addElement(newElementIndex, newElement);
            return;
          }
        }
      }

      const isDesignerElement = !!active.data?.current?.isDesignerElement;

      if (isDesignerElement) {
        const activeId = active.data.current?.elementId as string;
        const activeElementIndex = elements.findIndex((e) => e.id === activeId);

        if (activeElementIndex === -1)
          throw new Error("Active element index not found");

        const activeElement = elements[activeElementIndex];
        if (!activeElement) throw new Error("Active element not found");

        removeElement(activeElement.id);

        if (isDroppingOverDesignerElement) {
          const overId = over.data.current?.elementId as string;
          const overElementIndex = elements.findIndex((e) => e.id === overId);

          if (overElementIndex === -1)
            throw new Error("Over element not found");

          let newElementIndex = overElementIndex;
          if (isDroppingOverDesignerElementBottomHalf) newElementIndex += 1;
          addElement(newElementIndex, activeElement);
        } else {
          addElement(elements.length, activeElement);
        }
      }
    },
  });

  return (
    <div className={cn("flex h-full w-full", className)}>
      <DesignerSidebar />
      <div
        className="w-full p-4"
        onClick={(e) => {
          e.stopPropagation();
          if (selectedElement) setSelectedElement(null);
        }}
      >
        <div
          ref={droppable.setNodeRef}
          className={cn(
            "m-auto flex h-full max-w-[920px] flex-1 flex-grow flex-col items-center justify-start overflow-y-auto rounded-xl bg-background",
            droppable.isOver && "ring-4 ring-primary/70",
          )}
        >
          {!droppable.isOver && elements.length === 0 && (
            <p className="flex flex-grow items-center text-xl font-bold text-muted-foreground">
              Drop here
            </p>
          )}
          {droppable.isOver && elements.length === 0 && (
            <div className="w-full p-4">
              <div className="h-[120px] rounded-md bg-primary/20"></div>
            </div>
          )}
          {elements.length > 0 && (
            <div className="flex w-full flex-col gap-1 p-1">
              {elements.map((element: FormElementInstance) => {
                return (
                  <DesignerElementWrapper key={element.id} element={element} />
                );
              })}
            </div>
          )}
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
  const { removeElement, selectedElement, setSelectedElement } = useDesigner();
  const [mouseOver, setMouseOver] = useState(false);

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

  if (draggable.isDragging) return null;

  const DesignerElement = FormElements[element.type].designerComponent;
  return (
    <div
      ref={draggable.setNodeRef}
      {...draggable.attributes}
      {...draggable.listeners}
      onMouseEnter={() => {
        setMouseOver(true);
      }}
      onMouseLeave={() => {
        setMouseOver(false);
      }}
      onClick={(e) => {
        e.stopPropagation();
        setSelectedElement(element);
      }}
      className={cn(
        "relative flex h-[120px] cursor-grab flex-col rounded-md text-foreground ring-1 ring-inset ring-accent active:cursor-grabbing",
      )}
    >
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
      <div
        className={cn(
          "pointer-events-none flex h-[120px] w-full items-center rounded-md bg-accent/40 px-4 py-2 opacity-100 transition-opacity",
          selectedElement === element && "ring-1 ring-primary",
          mouseOver && "opacity-30",
        )}
      >
        <DesignerElement element={element} />
      </div>
      {bottomHalf.isOver && (
        <div className="absolute bottom-0 h-[7px] w-full rounded-md rounded-t-none bg-primary" />
      )}
      {mouseOver && (
        <>
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-center text-muted-foreground">
              Click for properties or drag to move
            </p>
          </div>
          <div className="absolute right-0 h-full">
            <Button
              variant={"outline"}
              className="flex h-full justify-center rounded-md rounded-l-none border bg-destructive text-destructive-foreground"
              onClick={(e) => {
                e.stopPropagation();
                removeElement(element.id);
              }}
            >
              <BiSolidTrash className="h-6 w-6" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default Designer;
