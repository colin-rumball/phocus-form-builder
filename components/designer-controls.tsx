import { cn, generateId } from "@/lib/utils";
import { useTransition, useState } from "react";
import DesignerDrawer from "./designer-drawer";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { SiOpenai } from "react-icons/si";
import SimpleLoadingSpinner from "./loading-icons";
import { Textarea } from "./ui/textarea";
import useDesigner from "@/lib/hooks/useDesigner";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { type FormElementInstance } from "./form-elements";
import { type useDroppable } from "@dnd-kit/core";

const DesignerControls = ({
  droppable,
}: {
  droppable: ReturnType<typeof useDroppable>;
}) => {
  const { selectedElement, elements, addElement } = useDesigner((state) => ({
    elements: state.elements,
    selectedElement: state.selectedElement,
    addElement: state.addElement,
  }));

  const [generating, startTransition] = useTransition();
  const [openAIUserInput, setOpenAIUserInput] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const generate = useAction(api.openai.generate);

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

      const selectedIndex = selectedElement
        ? elements.findIndex((ele) => ele.id === selectedElement.id) + 1
        : elements.length;

      newElements.forEach((element, index) => {
        element.id = generateId();
        addElement(selectedIndex + index, element);
      });
    } catch (e) {
      console.log("Error parsing openai response", rawResponse);

      console.error(e);
      return;
    }
  };

  return (
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
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <SiOpenai className="h-7 w-7" />
              <span>Add using AI</span>
            </Button>
          </DialogTrigger>
          <DialogContent
            className="flex flex-col gap-3 p-4"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <DialogHeader>
              <DialogTitle>Generate Elements Using AI</DialogTitle>
              <DialogDescription>
                Describe the elements you're trying to add and we'll generate it
                for you.
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
                Generate {generating && <SimpleLoadingSpinner className="" />}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default DesignerControls;
