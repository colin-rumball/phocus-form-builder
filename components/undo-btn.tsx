"use client";

import { type Doc } from "@/convex/_generated/dataModel";
import useDesigner from "@/lib/hooks/useDesigner";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "./ui/tooltip";
import { Skeleton } from "./ui/skeleton";
import { RxReset } from "react-icons/rx";

const UndoBtn = ({ form }: { form?: Doc<"forms"> | null }) => {
  const { setUnsavedChanges, savedAt, setSelectedElement } = useDesigner(
    (state) => ({
      setUnsavedChanges: state.setUnsavedChanges,
      savedAt: state.savedAt,
      setSelectedElement: state.setSelectedElement,
    }),
  );
  const { undo, pastStates } = useDesigner.temporal.getState();

  return (
    <>
      {!form && <Skeleton className="h-10 w-12" />}
      {!!form && (
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className={cn("gap-2 opacity-100 transition-all")}
                variant={"secondary"}
                disabled={pastStates.length === 0}
                onClick={() => {
                  undo();
                  setUnsavedChanges(true);
                  setSelectedElement(null);
                }}
              >
                <RxReset />
              </Button>
            </TooltipTrigger>
            {savedAt !== null && (
              <TooltipContent side="bottom" className="mx-2">
                <p>Undo</p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      )}
    </>
  );
};

export default UndoBtn;
