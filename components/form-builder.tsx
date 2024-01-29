"use client";

import { type Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { useEffect, useTransition } from "react";
import Headline from "./ui/headline";
import { Button } from "./ui/button";
import { MdOutlinePublish, MdPreview } from "react-icons/md";
import { HiSaveAs } from "react-icons/hi";
import Designer from "./designer";
import {
  DndContext,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import DragOverlayWrapper from "./drag-overlay-wrapper";
import { useDesigner } from "@/lib/hooks/useDesigner";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { type FormElementInstance, FormElements } from "./form-elements";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "./ui/use-toast";
import { FaSpinner } from "react-icons/fa";
import Section from "./ui/section";
import { ImSpinner2 } from "react-icons/im";
import {
  AlertDialog,
  AlertDialogTitle,
  AlertDialogContent,
  AlertDialogTrigger,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogCancel,
  AlertDialogAction,
} from "./ui/alert-dialog";
import { Input } from "./ui/input";
import { Link } from "./ui/link";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";

const FormBuilder = ({ formId }: { formId: Id<"forms"> }) => {
  const form = useQuery(api.forms.get, { id: formId });
  const { setElements, setSelectedElement } = useDesigner();

  useEffect(() => {
    if (form) {
      if (form.content !== "") {
        // TODO: handle parsing errors
        const JsonElements = JSON.parse(form.content) as FormElementInstance[];
        setElements(JsonElements);
        setSelectedElement(null);
      } else {
        setElements([]);
      }
    }
  }, [form, setSelectedElement, setElements]);

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 10,
    },
  });

  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 300,
      tolerance: 5,
    },
  });

  const sensors = useSensors(mouseSensor, touchSensor);

  if (!form) {
    return (
      <Section className="my-xl flex justify-center">
        <ImSpinner2 className="h-12 w-12 animate-spin" />
      </Section>
    );
  }

  if (form.published) {
    return (
      <div className="container flex h-full w-full flex-col items-center justify-center">
        <Headline as="h1">Form Published</Headline>
        <Headline as="h2">Share this form</Headline>
        <Headline as="h3">
          Anyone with the link can view and submit the form
        </Headline>

        <div className="w-full max-w-screen-sm">
          <div className="my-4 flex w-full flex-col items-center gap-2 border-b pb-4">
            <Input
              className="w-full"
              readOnly
              value={`${window.location.origin}/submit/${form._id}`}
            />
            <Button
              className="mt-2 w-full"
              onClick={async () => {
                await navigator.clipboard.writeText(
                  `${window.location.origin}/submit/${form._id}`,
                );
                toast({
                  title: "Copied",
                  description: "Link copied to clipboard",
                });
              }}
            >
              Copy to clipboard
            </Button>
          </div>
          <div className="flex w-full justify-between">
            <Button variant={"link"} asChild>
              <Link href={"/dashboard"} className="gap-2">
                <BsArrowLeft />
                Return to dashboard
              </Link>
            </Button>
            <Button variant={"link"} asChild>
              <Link href={`/form/${form._id}}`} className="gap-2">
                Form details
                <BsArrowRight />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <DndContext sensors={sensors}>
      <div className="flex h-full w-full flex-col">
        <nav className="flex items-center justify-between gap-3 border-b-2 p-4">
          <Headline as="h3" className="truncate font-medium">
            <span className="mr-2 text-muted-foreground">Form:</span>
            {form.name}
          </Headline>
          <div className="flex items-center gap-2">
            <PreviewDialogBtn />
            {!form.published && (
              <>
                <SaveFormBtn formId={form._id} />
                <PublishFormBtn formId={form._id} />
              </>
            )}
          </div>
        </nav>
        <div className="relative flex w-full flex-grow items-center justify-center overflow-y-auto bg-accent bg-[url(/svg/graph-paper.svg)] dark:bg-[url(/svg/graph-paper-dark.svg)]">
          <Designer />
        </div>
      </div>
      <DragOverlayWrapper />
    </DndContext>
  );
};

export default FormBuilder;

const PreviewDialogBtn = () => {
  const { elements } = useDesigner();
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"outline"} className={cn("gap-2")}>
          <MdPreview className="h-6 w-6" />
          Preview
        </Button>
      </DialogTrigger>
      <DialogContent className="flex h-screen max-h-screen w-screen max-w-full flex-grow flex-col gap-0 p-0">
        <div className="border-b px-4 py-2">
          <p className="text-lg font-bold text-muted-foreground">
            Form Preview
          </p>
          <p className="text-muted-foreground">
            This is how your form will look to users
          </p>
        </div>
        <div className="flex flex-grow flex-col items-center justify-center overflow-y-auto bg-accent bg-[url(/svg/graph-paper.svg)] p-4 dark:bg-[url(/svg/graph-paper-dark.svg)]">
          <div className="flex h-full w-full max-w-[620px] flex-grow flex-col gap-4 overflow-y-auto rounded-2xl bg-background p-8">
            {elements.map((element) => {
              const FormComponent = FormElements[element.type].formComponent;
              return <FormComponent key={element.id} element={element} />;
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
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

const PublishFormBtn = ({ formId }: { formId: Id<"forms"> }) => {
  const { elements } = useDesigner();
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
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          className={cn(
            "gap-2 bg-gradient-to-r from-indigo-400 to-cyan-400 text-white",
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
            Proceed {loading && <FaSpinner />}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
