"use client";

import { type Id } from "@/convex/_generated/dataModel";
import { useEffect } from "react";
import Headline from "./ui/headline";
import { Button } from "./ui/button";
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
import { type FormElementInstance } from "./form-elements";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "./ui/use-toast";
import Section from "./ui/section";
import { ImSpinner2 } from "react-icons/im";
import { Input } from "./ui/input";
import { Link } from "./ui/link";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import GenerateFormBtn from "./generate-form-btn";
import PreviewDialogBtn from "./preview-dialog-btn";
import PublishFormBtn from "./publish-form-btn";
import SaveFormBtn from "./save-form-btn";

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
        <nav className="fixed inset-x-0 top-0 z-30 flex h-[80px] items-center justify-between gap-3 border-b-2 bg-background p-4">
          <Link href={"/dashboard"} className="flex items-center space-x-2">
            <BsArrowLeft />
            <span>Dashboard</span>
          </Link>
          <Headline as="h3" className="flex-grow truncate font-medium">
            {form.name}
          </Headline>
          <div className="flex items-center gap-2">
            <PreviewDialogBtn />
            {!form.published && (
              <>
                <GenerateFormBtn />
                <SaveFormBtn formId={form._id} />
                <PublishFormBtn formId={form._id} />
              </>
            )}
          </div>
        </nav>
        <div className="relative mt-[80px] flex w-full flex-grow items-center justify-center overflow-y-auto bg-accent bg-[url(/svg/graph-paper.svg)] dark:bg-[url(/svg/graph-paper-dark.svg)]">
          <Designer />
        </div>
      </div>
      <DragOverlayWrapper />
    </DndContext>
  );
};

export default FormBuilder;
