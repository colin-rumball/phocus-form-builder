"use client";

import { cn } from "@/lib/utils";
import { type ComponentPropsWithoutRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { type z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel } from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { toast } from "./ui/use-toast";
import {
  type FormSchemaType,
  formSchemaObject,
} from "@/convex/zodSchemas/form";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { BsFileEarmarkPlus } from "react-icons/bs";
import { useRouter } from "next/navigation";

type CreateFormButtonProps = ComponentPropsWithoutRef<"div">;

const CreateFormButton = ({ className, children }: CreateFormButtonProps) => {
  const router = useRouter();
  const createForm = useMutation(api.forms.create);

  const form = useForm<z.infer<FormSchemaType>>({
    resolver: zodResolver(formSchemaObject),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const onSubmit = async (data: z.infer<FormSchemaType>) => {
    try {
      const res = await createForm(data);
      toast({
        title: data.name,
        description: "Form created",
      });
      router.push(`/builder/${res}`);
    } catch (e) {
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "border-primary/20 group flex h-[190px] flex-col items-center justify-center gap-4 border border-dashed",
            "hover:cursor-pointer hover:border-primary",
          )}
        >
          <BsFileEarmarkPlus className="h-8 w-8 text-muted-foreground group-hover:text-primary" />
          <p className="text-xl font-bold text-muted-foreground group-hover:text-primary">
            Create new form
          </p>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create form</DialogTitle>
          <DialogDescription>Create a new form</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Form name" />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      rows={5}
                      placeholder="Form description"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <Button
            disabled={form.formState.isSubmitting}
            onClick={form.handleSubmit(onSubmit)}
          >
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateFormButton;
