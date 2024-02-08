"use client";

import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { toast } from "./ui/use-toast";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { BsFileEarmarkPlus } from "react-icons/bs";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import SimpleLoadingSpinner from "./loading-icons";

const CreateFormButton = () => {
  const router = useRouter();
  const createForm = useMutation(api.forms.create);
  const [creating, startTransition] = useTransition();

  return (
    <Button
      variant={"outline"}
      className={cn(
        "group flex h-[190px] flex-col items-center justify-center gap-4 border border-dashed border-primary/20",
        "hover:cursor-pointer hover:border-primary",
      )}
      disabled={creating}
      onClick={() => {
        try {
          startTransition(async () => {
            const res = await createForm({ name: "Untitled Form" });
            router.push(`/builder/${res}`);
          });
        } catch (e) {
          toast({
            title: "Error",
            description: "Something went wrong",
            variant: "destructive",
          });
        }
      }}
    >
      {creating && (
        <SimpleLoadingSpinner className="h-8 w-8 text-muted-foreground" />
      )}
      {!creating && (
        <>
          <BsFileEarmarkPlus className="h-8 w-8 text-muted-foreground group-hover:text-primary" />
          <p className="text-xl font-bold text-muted-foreground group-hover:text-primary">
            Create new form
          </p>
        </>
      )}
    </Button>
  );
};

export default CreateFormButton;
