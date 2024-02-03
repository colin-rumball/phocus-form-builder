"use client";

import { api } from "@/convex/_generated/api";
import { type Id } from "@/convex/_generated/dataModel";
import useDesigner from "@/lib/hooks/useDesigner";
import { cn } from "@/lib/utils";
import { useMutation } from "convex/react";
import { useTransition } from "react";
import { FaSpinner } from "react-icons/fa";
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

const SaveFormBtn = ({ formId }: { formId: string }) => {
  const { elements, unsavedChanges, setUnsavedChanges, savedAt, setSavedAt } =
    useDesigner((state) => ({
      elements: state.elements,
      unsavedChanges: state.unsavedChanges,
      setUnsavedChanges: state.setUnsavedChanges,
      savedAt: state.savedAt,
      setSavedAt: state.setSavedAt,
    }));
  const [loading, startTransition] = useTransition();
  const updateForm = useMutation(api.forms.update);

  const postFormContent = async () => {
    try {
      const JsonElements = JSON.stringify(elements);
      await updateForm({
        id: formId as Id<"forms">,
        data: {
          content: JsonElements,
        },
      });
      setUnsavedChanges(false);
      setSavedAt(new Date());
      toast({
        title: "Success",
        description: "Your form has been saved",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      });
      console.error(error);
    }
  };

  const btnText = unsavedChanges ? "Save" : "Saved";

  return (
    <div
      className={cn(
        "flex h-full items-center gap px-2 transition-all duration-1000",
      )}
    >
      {unsavedChanges && (
        <div className="flex flex-col font-bold leading-tight text-destructive opacity-100">
          <span>UNSAVED</span>
          <span>CHANGES</span>
        </div>
      )}
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className={cn(
                "gap-2 opacity-100 transition-all",
                !unsavedChanges && "bg-green-700 hover:bg-green-500",
              )}
              variant={"secondary"}
              disabled={loading}
              onClick={() => {
                startTransition(postFormContent);
              }}
            >
              {!unsavedChanges && <HiCheck className="h-4 w-4" />}
              {unsavedChanges && !loading && <HiSaveAs className="h-4 w-4" />}
              <span>{btnText}</span>
              {loading && <FaSpinner className="animate-spin" />}
            </Button>
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
    </div>
  );
};

export default SaveFormBtn;
