"use client";

import { cn } from "@/lib/utils";
import {
  useState,
  type ComponentPropsWithoutRef,
  useTransition,
  useRef,
} from "react";
import DesignerSidebar from "./designer-sidebar";
import { useDndMonitor, useDraggable, useDroppable } from "@dnd-kit/core";
import {
  type ElementsType,
  type FormElementInstance,
  FormElements,
} from "./form-elements";
import useDesigner from "@/lib/hooks/useDesigner";
import short from "short-uuid";
import { BiSolidTrash } from "react-icons/bi";
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
import { FaPlus, FaSpinner } from "react-icons/fa";
import { Textarea } from "./ui/textarea";
import { api } from "@/convex/_generated/api";
import { useAction } from "convex/react";
import FormGenerator from "./form-generator";
import { CiSquarePlus } from "react-icons/ci";
import { SiOpenai } from "react-icons/si";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";
import { IoCloseSharp } from "react-icons/io5";
import DesignerDrawer from "./designer-drawer";
import useDrawer from "@/lib/hooks/useDrawer";

type DesignerProps = ComponentPropsWithoutRef<"div">;

const Designer = ({ className }: DesignerProps) => {
  const {
    elements,
    removeElement,
    addElement,
    selectedElement,
    setSelectedElement,
  } = useDesigner();

  const [generating, startTransition] = useTransition();
  const [openAIUserInput, setOpenAIUserInput] = useState("");
  const selectedIndex = useRef(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const generate = useAction(api.openai.generate);

  const { drawerVisible, setDrawerVisible } = useDrawer((state) => ({
    drawerVisible: state.visible,
    setDrawerVisible: state.setVisible,
  }));

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
        element.id = short.generate();
        addElement(selectedIndex.current + index, element);
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
          if (type !== "OpenAIField") {
            addElement(elements.length, newElement);
            return;
          } else {
            setDialogOpen(true);
            selectedIndex.current = elements.length;
            return;
          }
        } else {
          // add in place of another element
          if (isDroppingOverDesignerElement) {
            let newElementIndex = elements.findIndex(
              (e) => e.id === over.data.current?.elementId,
            );
            if (newElementIndex === -1) throw new Error("Element not found");
            if (isDroppingOverDesignerElementBottomHalf) newElementIndex += 1;
            if (type !== "OpenAIField") {
              addElement(newElementIndex, newElement);
            } else {
              setDialogOpen(true);
              selectedIndex.current = newElementIndex;
            }
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
            "m-auto flex h-full max-w-[920px] flex-col items-center overflow-y-auto rounded-xl bg-background",
          )}
        >
          {elements.length === 0 && <FormGenerator />}
          {!droppable.isOver && elements.length === 0 && (
            <p className="flex flex-grow items-center text-xl font-bold text-muted-foreground">
              Or add form fields manually
            </p>
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
          <div className="my-6 flex items-center space-x-4">
            <Drawer open={drawerVisible} onOpenChange={setDrawerVisible}>
              <DrawerTrigger asChild>
                <Button
                  variant={"secondary"}
                  className="h-auto rounded-full p-3"
                >
                  <FaPlus className="h-7 w-7" />
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerClose>
                    <IoCloseSharp className="absolute right-4 top-4 h-7 w-7" />
                  </DrawerClose>
                </DrawerHeader>
                <DesignerDrawer />
                <DrawerFooter></DrawerFooter>
              </DrawerContent>
            </Drawer>

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
                      {generating && <FaSpinner className="animate-spin" />}
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
  const { removeElement, selectedElement, setSelectedElement } = useDesigner(
    (state) => ({
      removeElement: state.removeElement,
      selectedElement: state.selectedElement,
      setSelectedElement: state.setSelectedElement,
    }),
  );
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
        "relative m-2 flex h-[120px] cursor-grab flex-col rounded-md text-foreground ring-1 ring-inset ring-accent active:cursor-grabbing",
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
