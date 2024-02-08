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
import { RxEyeOpen, RxEyeClosed } from "react-icons/rx";

const PreviewBtn = ({ form }: { form?: Doc<"forms"> | null }) => {
  const { elements, setSelectedElement } = useDesigner((state) => ({
    elements: state.elements,
    setSelectedElement: state.setSelectedElement,
  }));

  return (
    <>
      {!form && <Skeleton className="h-10 w-12" />}
      {!!form && (
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              {/* <Switch
              id="preview-toggle"
              className="data-[state=checked]:bg-foreground"
            />
            <Label htmlFor="preview-togglee">Preview</Label> */}
              <Button
                className={cn("gap-2 opacity-100 transition-all")}
                variant={"secondary"}
                disabled={elements.length === 0}
                onClick={() => {
                  setSelectedElement(null);
                  console.log("Preview");
                }}
              >
                <RxEyeOpen />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="mx-2">
              <p>Preview form</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </>
  );
};

export default PreviewBtn;
