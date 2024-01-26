"use client";

import { cn } from "@/lib/utils";
import { useState, type ComponentPropsWithoutRef } from "react";
import DesignerSidebar from "./designer-sidebar";
import { useDndMonitor, useDraggable, useDroppable } from "@dnd-kit/core";
import {
  type ElementsType,
  FormElementInstance,
  FormElements,
} from "./form-elements";
import { useDesigner } from "@/lib/hooks/useDesigner";
import short from "short-uuid";
import { BiSolidTrash } from "react-icons/bi";
import { Button } from "./ui/button";

type DesignerProps = ComponentPropsWithoutRef<"div">;

const Designer = ({ className }: DesignerProps) => {
  const { elements, addElement, selectedElement, setSelectedElement } =
    useDesigner();

  const droppable = useDroppable({
    id: "designer-drop-area",
    data: {
      isDesignerDropArea: true,
    },
  });

  useDndMonitor({
    onDragEnd: ({ active, over }) => {
      if (!active || !over) return;

      if (active.data.current?.isDesignerBtnElement) {
        const type = active.data.current?.type as ElementsType;
        addElement(0, FormElements[type].construct(short.generate()));
      }
    },
  });

  return (
    <div className={cn("flex h-full w-full", className)}>
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
            droppable.isOver && "ring-2 ring-primary/60",
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
            <div className="flex w-full flex-col gap-1">
              {elements.map((element: FormElementInstance) => {
                return (
                  <DesignerElementWrapper key={element.id} element={element} />
                );
              })}
            </div>
          )}
        </div>
      </div>
      <DesignerSidebar />
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
        "relative flex h-[120px] flex-col rounded-md text-foreground ring-1 ring-inset ring-accent hover:cursor-pointer",
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
