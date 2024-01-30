import { cn } from "@/lib/utils";
import { type ComponentPropsWithoutRef } from "react";
import { type FormElement, FormElements } from "./form-elements";
import { Button } from "./ui/button";
import { useDraggable } from "@dnd-kit/core";
import { useDesigner } from "@/lib/hooks/useDesigner";
import FormElementInspector from "./form-element-inspector";
import Headline from "./ui/headline";

type DesignerSidebarProps = ComponentPropsWithoutRef<"div">;

const DesignerSidebar = ({ className }: DesignerSidebarProps) => {
  const { selectedElement } = useDesigner();
  return (
    <aside
      className={cn(
        "left-0 flex w-[400px] flex-col overflow-y-auto bg-background",
        className,
      )}
    >
      {!selectedElement && (
        <div className="flex flex-col">
          <Headline as="h3">Layout Elements</Headline>
          <div className="grid grid-cols-1 place-items-center gap-2 md:grid-cols-2">
            <SidebarBtnElement formElement={FormElements.TitleField} />
            <SidebarBtnElement formElement={FormElements.SubtitleField} />
            <SidebarBtnElement formElement={FormElements.ParagraphField} />
            <SidebarBtnElement formElement={FormElements.SeparatorField} />
            <SidebarBtnElement formElement={FormElements.SpacerField} />
          </div>
          <div className="grid grid-cols-1 place-items-center gap-2 md:grid-cols-2">
            <SidebarBtnElement formElement={FormElements.TextField} />
            <SidebarBtnElement formElement={FormElements.TextAreaField} />
            <SidebarBtnElement formElement={FormElements.NumberField} />
            <SidebarBtnElement formElement={FormElements.DateField} />
            <SidebarBtnElement formElement={FormElements.SelectField} />
            <SidebarBtnElement formElement={FormElements.CheckboxField} />
            <SidebarBtnElement formElement={FormElements.OpenAIField} />
          </div>
        </div>
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
