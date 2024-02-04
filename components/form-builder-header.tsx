"use client";

import { type Id } from "@/convex/_generated/dataModel";
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
import { ImSpinner2 } from "react-icons/im";

const FormBuilderHeader = () => {
  const params = useParams();
  const form = useQuery(api.forms.get, { id: params.formId as Id<"forms"> });

  return (
    <div
      className={cn(
        "relative flex h-[80px] w-full items-center justify-between gap-3 border-b-2 bg-background transition-transform",
      )}
    >
      <Link
        href={"/dashboard"}
        className="mx-lg flex items-center space-x-2 text-lg text-foreground"
      >
        <MdOutlineKeyboardDoubleArrowLeft />
        <span>Dashboard</span>
      </Link>
      {form && !form.published && (
        <>
          <BuilderTabs />
          <div className="mr-lg flex h-full items-center gap-2">
            <SaveFormBtn formId={form._id} />
            <PublishFormBtn formId={form._id} />
          </div>
        </>
      )}
      {!form && (
        <div className="absolute inset-x-0 flex w-full justify-center">
          <ImSpinner2 className="h-12 w-12 animate-spin text-foreground" />
        </div>
      )}
    </div>
  );
};

export default FormBuilderHeader;

const BuilderTabs = () => {
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
    <div className="absolute inset-y-0 left-1/2 flex h-full -translate-x-1/2 items-center px-xl text-foreground">
      <button
        className={cn(
          "flex h-full w-[130px] items-center justify-center px-lg text-center uppercase opacity-60 transition-all duration-500",
          "font-bold hover:opacity-90",
          currentTab === "DESIGN" && "text-primary opacity-100",
        )}
        onClick={() => setTabWrapper("DESIGN")}
      >
        Design
      </button>
      <button
        className={cn(
          "flex h-full w-[130px] items-center justify-center px-lg text-center uppercase opacity-60 transition-all duration-500",
          "font-bold hover:opacity-90",
          currentTab === "PREVIEW" && "text-primary opacity-100",
          elements.length === 0 && "pointer-events-none select-none opacity-20",
        )}
        onClick={() => setTabWrapper("PREVIEW")}
        disabled={elements.length === 0}
      >
        Preview
      </button>
    </div>
  );
};
