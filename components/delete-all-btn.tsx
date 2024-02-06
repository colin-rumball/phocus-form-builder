import { type Doc } from "@/convex/_generated/dataModel";
import useDesigner from "@/lib/hooks/useDesigner";
import { cn } from "@/lib/utils";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { Skeleton } from "./ui/skeleton";
import { toast } from "./ui/use-toast";
import { Button } from "./ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { HiTrash } from "react-icons/hi2";

const DeleteAllBtn = ({ form }: { form?: Doc<"forms"> | null }) => {
  const { elements, removeAllElements } = useDesigner((state) => ({
    removeAllElements: state.removeAllElements,
    elements: state.elements,
  }));

  return (
    <>
      {!form && <Skeleton className="h-10 w-12" />}
      {!!form && (
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                disabled={elements.length === 0}
                variant={"destructive"}
                className={cn("w-full gap-2 text-white")}
                onClick={(e) => {
                  e.preventDefault();
                  removeAllElements();
                  toast({
                    title: "All Elements Deleted!",
                    description: "Click undo if this was an accident.",
                  });
                }}
              >
                <HiTrash />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Delete All Elements</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </>
  );
};

export default DeleteAllBtn;
