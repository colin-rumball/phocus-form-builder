"use client";

import { type Doc, type Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import SaveFormBtn from "./save-form-btn";
import { Link } from "./ui/link";
import { MdOutlineKeyboardDoubleArrowLeft } from "react-icons/md";
import useBuilderTabs, { type BuilderTab } from "@/lib/hooks/useBuilderTabs";
import useDesigner from "@/lib/hooks/useDesigner";
import PublishFormBtn from "./publish-form-btn";
import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import DeleteAllBtn from "./delete-all-btn";
import UndoBtn from "./undo-btn";

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
        <Link
          href={"/dashboard"}
          className="mx-lg flex items-center space-x-2 text-lg"
        >
          <MdOutlineKeyboardDoubleArrowLeft />
          <span>Dashboard</span>
        </Link>
        <BuilderTabs form={form} />
        <div className="mr-lg flex h-full items-center gap-2">
          <UndoBtn form={form} />
          <DeleteAllBtn form={form} />
          <SaveFormBtn form={form} />
          <PublishFormBtn form={form} />
        </div>
      </div>
    </div>
  );
};

export default FormBuilderHeader;

const BuilderTabs = ({ form }: { form?: Doc<"forms"> | null }) => {
  const { elements } = useDesigner((state) => ({
    elements: state.elements,
  }));
  const { currentTab, setCurrentTab } = useBuilderTabs((state) => ({
    currentTab: state.currentTab,
    setCurrentTab: state.setCurrentTab,
  }));

  const setTabWrapper = (newTab: BuilderTab) => {
    setCurrentTab(newTab);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="track absolute inset-y-0 left-1/2 flex h-full -translate-x-1/2 items-center px-xl">
      <button
        disabled={!form}
        className={cn(
          "flex h-full w-[160px] items-center justify-center px-lg text-center uppercase tracking-headline opacity-40 transition-all duration-300",
          "font-bold hover:opacity-80",
          currentTab === "DESIGN" && "font-bold opacity-100",
        )}
        onClick={() => setTabWrapper("DESIGN")}
      >
        Design
      </button>
      <button
        disabled={!form || elements.length === 0}
        className={cn(
          "flex h-full w-[160px] items-center justify-center px-lg text-center uppercase tracking-headline opacity-40 transition-all duration-300",
          "font-bold hover:opacity-80",
          currentTab === "PREVIEW" && "font-bold opacity-100",
          elements.length === 0 && "pointer-events-none select-none opacity-20",
        )}
        onClick={() => setTabWrapper("PREVIEW")}
      >
        Preview
      </button>
    </div>
  );
};
