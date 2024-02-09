"use client";

import { type Doc } from "@/convex/_generated/dataModel";
import useDesigner from "@/lib/hooks/useDesigner";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "./ui/tooltip";
import { Skeleton } from "./ui/skeleton";
import { Switch } from "./ui/switch";

const PreviewBtn = ({ form }: { form?: Doc<"forms"> | null }) => {
  const { elements, setSelectedElement, previewing, setPreviewing } =
    useDesigner((state) => ({
      elements: state.elements,
      setSelectedElement: state.setSelectedElement,
      previewing: state.previewing,
      setPreviewing: state.setPreviewing,
    }));

  return (
    <>
      {!form && <Skeleton className="h-10 w-12" />}
      {!!form && (
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex flex-col items-center justify-center">
                <Switch
                  id="preview-toggle"
                  disabled={elements.length === 0}
                  onCheckedChange={(checked) => {
                    setPreviewing(checked);
                  }}
                  className="data-[state=checked]:bg-primary-foreground"
                />
                {/* <Label htmlFor="preview-toggle">Preview</Label> */}
              </div>
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
