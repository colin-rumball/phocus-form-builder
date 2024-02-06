import { api } from "@/convex/_generated/api";
import { Doc, type Id } from "@/convex/_generated/dataModel";
import useDesigner from "@/lib/hooks/useDesigner";
import { cn } from "@/lib/utils";
import { useMutation } from "convex/react";
import { useState, useTransition } from "react";
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
import SimpleLoadingSpinner from "./loading-icons";
import { Skeleton } from "./ui/skeleton";

const PublishFormBtn = ({ form }: { form?: Doc<"forms"> | null }) => {
  const { elements } = useDesigner((state) => ({
    elements: state.elements,
  }));
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, startTransition] = useTransition();
  const updateForm = useMutation(api.forms.update);

  const publishForm = async () => {
    try {
      if (!form) return;
      await updateForm({
        id: form._id,
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
    <>
      {!form && <Skeleton className="h-8 w-28" />}
      {!!form && (
        <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <AlertDialogTrigger asChild>
            <Button
              disabled={elements.length === 0 || loading}
              className={cn(
                "w-full gap-2 bg-gradient-to-r from-indigo-500 to-cyan-500 text-white",
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
                  By publishing this form you will make it available to the
                  public and you will be able to collect submissions.
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
                Proceed {loading && <SimpleLoadingSpinner className="" />}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
};

export default PublishFormBtn;
