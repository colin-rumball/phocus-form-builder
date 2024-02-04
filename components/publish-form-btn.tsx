import { api } from "@/convex/_generated/api";
import { type Id } from "@/convex/_generated/dataModel";
import useDesigner from "@/lib/hooks/useDesigner";
import { cn } from "@/lib/utils";
import { useMutation } from "convex/react";
import { useState, useTransition } from "react";
import { FaSpinner } from "react-icons/fa";
import { MdOutlinePublish } from "react-icons/md";
import {
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTrigger,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { toast } from "./ui/use-toast";
import { Button } from "./ui/button";

const PublishFormBtn = ({ formId }: { formId: Id<"forms"> }) => {
  const { elements } = useDesigner((state) => ({
    elements: state.elements,
  }));
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, startTransition] = useTransition();
  const updateForm = useMutation(api.forms.update);

  const publishForm = async () => {
    try {
      await updateForm({
        id: formId,
        data: {
          content: JSON.stringify(elements),
          published: true,
        },
      });
      setDialogOpen(false);
      toast({
        title: "Success",
        description: "Your form has been published!",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      });
    }
  };

  return (
    <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <AlertDialogTrigger asChild>
        <Button
          disabled={elements.length === 0 || loading}
          className={cn(
            "w-full gap-2 bg-gradient-to-r from-indigo-400 to-secondary text-white",
          )}
        >
          <MdOutlinePublish className="h-4 w-4" /> Publish
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to publish this form?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone.
            <br />
            Once published, you will not be able to edit this form.
            <br />
            <br />
            <span className="">
              By publishing this form you will make it available to the public
              and you will be able to collect submissions.
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={loading}
            onClick={(e) => {
              e.preventDefault();
              startTransition(publishForm);
            }}
          >
            Proceed {loading && <FaSpinner className="animate-spin" />}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default PublishFormBtn;
