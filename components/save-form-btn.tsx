"use client";

import { api } from "@/convex/_generated/api";
import { Doc, type Id } from "@/convex/_generated/dataModel";
import useDesigner from "@/lib/hooks/useDesigner";
import { cn } from "@/lib/utils";
import { useMutation } from "convex/react";
import { useCallback, useEffect, useState, useTransition } from "react";
import { HiCheck, HiSaveAs } from "react-icons/hi";
import { toast } from "./ui/use-toast";
import { Button } from "./ui/button";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "./ui/tooltip";
import { formatDistance } from "date-fns";
import SimpleLoadingSpinner from "./loading-icons";
import { Skeleton } from "./ui/skeleton";
import { FaRegSave } from "react-icons/fa";
import useThrottle from "@/lib/hooks/useThrottle";

const SaveFormBtn = ({ form }: { form?: Doc<"forms"> | null }) => {
  const { elements, unsavedChanges, setUnsavedChanges, savedAt, setSavedAt } =
    useDesigner((state) => ({
      elements: state.elements,
      unsavedChanges: state.unsavedChanges,
      setUnsavedChanges: state.setUnsavedChanges,
      savedAt: state.savedAt,
      setSavedAt: state.setSavedAt,
    }));
  const { clear } = useDesigner.temporal.getState();
  const [loading, startTransition] = useTransition();
  const [delayedSave, setDelayedSave] = useState(false);
  const updateForm = useMutation(api.forms.update);

  const postFormContent = useCallback(async () => {
    try {
      if (!form) return;
      const JsonElements = JSON.stringify(elements);
      await updateForm({
        id: form._id,
        data: {
          content: JsonElements,
        },
      });
      if (unsavedChanges) setUnsavedChanges(false);
      setSavedAt(new Date());
      // clear();
      // toast({
      //   title: "Success",
      //   description: "Your form has been saved",
      // });
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong while saving. Please try again.",
        variant: "destructive",
      });
      console.error(error);
    }
    setDelayedSave(false);
  }, [form, elements]);

  const throttledSave = useThrottle(postFormContent, 500);

  useEffect(() => {
    if (unsavedChanges) {
      setDelayedSave(true);
      startTransition(throttledSave);
    }
  }, [unsavedChanges]);

  const saving = loading || delayedSave;
  const labelText = unsavedChanges && saving ? "SAVING" : "SAVED";

  return (
    <>
      {!form && <Skeleton className="h-9 w-24" />}
      {!!form && (
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center justify-center gap-1 rounded-md border border-primary-foreground px-3 py-1">
                <span className="select-none">{labelText}</span>
                {saving && <SimpleLoadingSpinner className="" />}
                {!unsavedChanges && !saving && <HiCheck />}
              </div>
              {/* <Button
                className={cn(
                  "gap-2 opacity-100 transition-all",
                  !unsavedChanges && "bg-green-600 hover:bg-green-300",
                )}
                variant={"secondary"}
                disabled={saving}
                onClick={() => {
                  startTransition(postFormContent);
                }}
              >
                {!unsavedChanges && !saving && <HiCheck />}
                {unsavedChanges && !saving && <FaRegSave />}
                {saving && <SimpleLoadingSpinner className="" />}
              </Button> */}
            </TooltipTrigger>
            {savedAt !== null && (
              <TooltipContent side="bottom" className="mx-2">
                <p>
                  Form last saved{" "}
                  {formatDistance(savedAt, Date.now(), { addSuffix: true })}
                </p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      )}
    </>
  );
};

export default SaveFormBtn;
