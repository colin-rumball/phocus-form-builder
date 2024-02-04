import { cn } from "@/lib/utils";
import { DragOverlay, useDndMonitor, type Active } from "@dnd-kit/core";
import { useState } from "react";
import { SidebarBtnElementDragOverlay } from "./designer-sidebar";
import { type ElementsType, FormElements } from "./form-elements";
import useDesigner from "@/lib/hooks/useDesigner";

const DragOverlayWrapper = () => {
  const { elements } = useDesigner((state) => ({
    elements: state.elements,
  }));
  const [draggedItem, setDraggedItem] = useState<Active | null>(null);

  useDndMonitor({
    onDragStart: (event) => {
      setDraggedItem(event.active);
    },
    onDragCancel: () => {
      setDraggedItem(null);
    },
    onDragEnd: () => {
      setDraggedItem(null);
    },
  });

  if (!draggedItem) return null;

  let node = <div>No drag overlay</div>;
  const isSidebarBtnElement = draggedItem.data.current
    ?.isDesignerBtnElement as boolean;

  if (isSidebarBtnElement) {
    const type = draggedItem.data.current?.type as ElementsType;
    node = <SidebarBtnElementDragOverlay formElement={FormElements[type]} />;
  }

  const isDesignerElement = draggedItem.data.current
    ?.isDesignerElement as boolean;
  if (isDesignerElement) {
    const elementId = draggedItem.data.current?.elementId as string;
    const element = elements.find((e) => e.id === elementId);
    if (!element) {
      node = <div>Element not found</div>;
    } else {
      const DesignerElementComponent =
        FormElements[element.type].designerComponent;
      node = (
        <div className="pointer-events-none flex h-[140px] w-[260px] overflow-y-hidden rounded-md border bg-accent px-4 py-2 opacity-80">
          <DesignerElementComponent element={element} />
        </div>
      );
    }
  }

  return <DragOverlay>{node}</DragOverlay>;
};

export default DragOverlayWrapper;
