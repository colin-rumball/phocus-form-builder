import { cn } from "@/lib/utils";
import { type ComponentPropsWithoutRef } from "react";
import { type FormElement, FormElements } from "./form-elements";
import { Button } from "./ui/button";
import { useDraggable } from "@dnd-kit/core";
import { useDesigner } from "@/lib/hooks/useDesigner";
import FormElementInspector from "./form-element-inspector";

type DesignerSidebarProps = ComponentPropsWithoutRef<"div">;

const DesignerSidebar = ({ className }: DesignerSidebarProps) => {
  const { selectedElement } = useDesigner();
  return (
    <aside
      className={cn(
        "flex h-full w-[400px] max-w-[400px] flex-grow flex-col overflow-y-auto border-l-2 border-muted bg-background p-4",
        className,
      )}
    >
      {!selectedElement && (
        <SidebarBtnElement formElement={FormElements.TextField} />
      )}
      {selectedElement && <FormElementInspector element={selectedElement} />}
    </aside>
  );
};

export default DesignerSidebar;

const SidebarBtnElement = ({ formElement }: { formElement: FormElement }) => {
  const { icon: Icon, label } = formElement.designerButton;
  const draggable = useDraggable({
    id: `designer-btn-${formElement.type}`,
    data: {
      type: formElement.type,
      isDesignerBtnElement: true,
    },
  });
  return (
    <Button
      ref={draggable.setNodeRef}
      variant={"outline"}
      className={cn(
        "flex h-[120px] w-[120px] cursor-grab flex-col gap-2",
        draggable.isDragging && "ring-2 ring-primary",
      )}
      {...draggable.listeners}
      {...draggable.attributes}
    >
      <Icon className="h-8 w-8 cursor-grab text-primary" />
      <p className="">{label}</p>
    </Button>
  );
};

export const SidebarBtnElementDragOverlay = ({
  formElement,
}: {
  formElement: FormElement;
}) => {
  const { icon: Icon, label } = formElement.designerButton;
  return (
    <Button
      variant={"outline"}
      className={cn("flex h-[120px] w-[120px] cursor-grab flex-col gap-2")}
    >
      <Icon className="h-8 w-8 cursor-grab text-primary" />
      <p className="">{label}</p>
    </Button>
  );
};