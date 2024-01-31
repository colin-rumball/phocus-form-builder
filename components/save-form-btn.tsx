"use client";

import { api } from "@/convex/_generated/api";
import { type Id } from "@/convex/_generated/dataModel";
import { useDesigner } from "@/lib/hooks/useDesigner";
import { cn } from "@/lib/utils";
import { useMutation } from "convex/react";
import { useTransition } from "react";
import { FaSpinner } from "react-icons/fa";
import { HiSaveAs } from "react-icons/hi";
import { toast } from "./ui/use-toast";
import { Button } from "./ui/button";

const SaveFormBtn = ({ formId }: { formId: string }) => {
  const { elements } = useDesigner();
  const [loading, startTransition] = useTransition();
  const updateForm = useMutation(api.forms.update);

  const updateFormContent = async () => {
    try {
      const JsonElements = JSON.stringify(elements);
      await updateForm({
        id: formId as Id<"forms">,
        data: {
          content: JsonElements,
        },
      });
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
    <Button
      className={cn("gap-2")}
      disabled={loading}
      onClick={() => {
        startTransition(updateFormContent);
      }}
    >
      <HiSaveAs className="h-4 w-4" />
      <span>Save</span>
      {loading && <FaSpinner className="animate-spin" />}
    </Button>
  );
};

export default SaveFormBtn;
