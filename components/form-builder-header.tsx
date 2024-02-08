"use client";

import { type Doc, type Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import SaveFormBtn from "./save-form-btn";
import { Link } from "./ui/link";
import { MdOutlineKeyboardDoubleArrowLeft } from "react-icons/md";
import useDesigner from "@/lib/hooks/useDesigner";
import PublishFormBtn from "./publish-form-btn";
import { useParams } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import DeleteAllBtn from "./delete-all-btn";
import UndoBtn from "./undo-btn";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { RxEyeClosed, RxEyeOpen } from "react-icons/rx";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";
import { Skeleton } from "./ui/skeleton";
import { Input } from "./ui/input";
import PreviewBtn from "./preview-btn";

const FormBuilderHeader = () => {
  const params = useParams();
  const form = useQuery(api.forms.get, { id: params.formId as Id<"forms"> });

  if (form?.published) return null;

  return (
    <div
      className={cn(
        "relative h-[80px] w-full gap-3 border-b-2 bg-primary text-primary-foreground transition-transform",
      )}
    >
      <div className="container flex h-full items-center justify-between">
        <div className="flex h-full items-center gap-2">
          <SaveFormBtn form={form} />
          <div className="flex flex-col items-center justify-center space-x-2">
            <PreviewBtn form={form} />
          </div>
        </div>

        <FormName />

        <div className="flex h-full items-center gap-2">
          <UndoBtn form={form} />
          <DeleteAllBtn form={form} />
          <PublishFormBtn form={form} />
        </div>
      </div>
    </div>
  );
};

export default FormBuilderHeader;

// const BuilderTabs = ({ form }: { form?: Doc<"forms"> | null }) => {
//   const { elements } = useDesigner((state) => ({
//     elements: state.elements,
//   }));
//   const { currentTab, setCurrentTab } = useBuilderTabs((state) => ({
//     currentTab: state.currentTab,
//     setCurrentTab: state.setCurrentTab,
//   }));

//   const setTabWrapper = (newTab: BuilderTab) => {
//     setCurrentTab(newTab);
//     window.scrollTo({
//       top: 0,
//       behavior: "smooth",
//     });
//   };

//   return (
//     <div className="track absolute inset-y-0 left-1/2 flex h-full -translate-x-1/2 items-center px-xl">
//       <button
//         disabled={!form}
//         className={cn(
//           "flex h-full w-[160px] items-center justify-center px-lg text-center uppercase tracking-headline opacity-40 transition-all duration-300",
//           "font-bold hover:opacity-80",
//           currentTab === "DESIGN" && "font-bold opacity-100",
//         )}
//         onClick={() => setTabWrapper("DESIGN")}
//       >
//         Design
//       </button>
//       <button
//         disabled={!form || elements.length === 0}
//         className={cn(
//           "flex h-full w-[160px] items-center justify-center px-lg text-center uppercase tracking-headline opacity-40 transition-all duration-300",
//           "font-bold hover:opacity-80",
//           currentTab === "PREVIEW" && "font-bold opacity-100",
//           elements.length === 0 && "pointer-events-none select-none opacity-20",
//         )}
//         onClick={() => setTabWrapper("PREVIEW")}
//       >
//         Preview
//       </button>
//     </div>
//   );
// };

const FormName = () => {
  const params = useParams();
  const form = useQuery(api.forms.get, { id: params.formId as Id<"forms"> });
  const [nameInput, setNameInput] = useState("");
  const updateForm = useMutation(api.forms.update);

  useEffect(() => {
    if (!form) return;
    setNameInput(form.name);
  }, [form]);

  const onNameChanged = async (newName?: string) => {
    if (!form) return;
    if (newName === "") setNameInput(form.name);
    if (newName === form.name) return;

    await updateForm({
      id: form._id as Id<"forms">,
      data: { name: newName },
    });
  };

  return (
    <div className="pointer-events-none absolute inset-y-0 left-1/2 flex w-full -translate-x-1/2 flex-col items-center justify-evenly">
      {!form && <Skeleton className="h-10 w-56" />}
      {!!form && (
        <div
          className={cn(
            "pointer-events-auto hidden w-full max-w-[300px] text-center md:block lg:max-w-[460px] xl:max-w-[700px] 2xl:max-w-[900px]",
          )}
        >
          <Input
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            onBlur={() => onNameChanged(nameInput)}
            className={cn(
              "mx-0 ml-0 h-full w-full truncate rounded-none border-none bg-transparent px-0 py-0 text-center font-headline text-background focus-visible:border-0 focus-visible:bg-background focus-visible:text-foreground focus-visible:ring-0 focus-visible:ring-offset-0",
              "text-heading leading-heading",
            )}
          />
        </div>
      )}
    </div>
  );
};
