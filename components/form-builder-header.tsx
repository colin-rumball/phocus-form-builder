"use client";

import { type Doc } from "@/convex/_generated/dataModel";
import useHeader from "@/lib/hooks/useHeader";
import { cn } from "@/lib/utils";
import SaveFormBtn from "./save-form-btn";
import { Link } from "./ui/link";
import { MdOutlineKeyboardDoubleArrowLeft } from "react-icons/md";
import useBuilderTabs, { type BuilderTab } from "@/lib/hooks/useBuilderTabs";
import useDesigner from "@/lib/hooks/useDesigner";
import PublishFormBtn from "./publish-form-btn";

const FormBuilderHeader = ({ form }: { form: Doc<"forms"> }) => {
  const { visible } = useHeader((state) => ({
    visible: state.visible,
  }));
  return (
    <nav
      className={cn(
        "fixed inset-x-0 top-header z-30 flex h-[80px] items-center justify-between gap-3 border-b-2 bg-background transition-transform",
        visible && "duration-300",
        !visible && "-translate-y-header duration-500",
      )}
    >
      <Link
        href={"/dashboard"}
        className="mx-lg flex items-center space-x-2 text-lg"
      >
        <MdOutlineKeyboardDoubleArrowLeft />
        <span>Dashboard</span>
      </Link>
      <BuilderTabs formId={form._id} />
      <div className="mr-lg flex h-full items-center gap-2">
        <SaveFormBtn formId={form._id} />
        <PublishFormBtn formId={form._id} />
      </div>
    </nav>
  );
};

export default FormBuilderHeader;

const BuilderTabs = ({ formId }: { formId: string }) => {
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
    <div className="absolute inset-y-0 left-1/2 flex h-full -translate-x-1/2 items-center">
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
          elements.length === 0 && "cursor-not-allowed",
        )}
        onClick={() => setTabWrapper("PREVIEW")}
        disabled={elements.length === 0}
      >
        Preview
      </button>
    </div>
  );
};
