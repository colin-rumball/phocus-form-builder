"use client";

import { api } from "@/convex/_generated/api";
import { Doc, type Id } from "@/convex/_generated/dataModel";
import useDesigner from "@/lib/hooks/useDesigner";
import { cn } from "@/lib/utils";
import { useMutation } from "convex/react";
import { useTransition } from "react";
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
  const updateForm = useMutation(api.forms.update);

  const postFormContent = async () => {
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
      clear();
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

  return (
    <>
      {!form && <Skeleton className="h-10 w-12" />}
      {!!form && (
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className={cn(
                  "gap-2 opacity-100 transition-all",
                  !unsavedChanges && "bg-green-600 hover:bg-green-300",
                )}
                variant={"secondary"}
                disabled={loading}
                onClick={() => {
                  startTransition(postFormContent);
                }}
              >
                {!unsavedChanges && !loading && <HiCheck />}
                {unsavedChanges && !loading && <FaRegSave />}
                {loading && <SimpleLoadingSpinner className="" />}
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
      )}
    </>
  );
};

export default SaveFormBtn;
