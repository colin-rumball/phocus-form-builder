"use client";

import { type Doc } from "@/convex/_generated/dataModel";
import useHeader from "@/lib/hooks/useHeader";
import { cn } from "@/lib/utils";
import SaveFormBtn from "./save-form-btn";
import { Link } from "./ui/link";
import { MdOutlineKeyboardDoubleArrowLeft } from "react-icons/md";
import { usePathname } from "next/navigation";

const FormBuilderHeader = ({ form }: { form: Doc<"forms"> }) => {
  const { visible } = useHeader((state) => ({
    visible: state.visible,
  }));
  return (
    <nav
      className={cn(
        "fixed inset-x-0 top-header z-30 flex h-[80px] items-center justify-between gap-3 border-b-2 bg-background p-4 transition-transform",
        visible && "duration-300",
        !visible && "-translate-y-header duration-500",
      )}
    >
      <Link href={"/dashboard"} className="flex items-center space-x-2 text-lg">
        <MdOutlineKeyboardDoubleArrowLeft />
        <span>Dashboard</span>
      </Link>
      <BuilderTabs formId={form._id} />
      <div className="flex items-center gap-2">
        {!form.published && <SaveFormBtn formId={form._id} />}
      </div>
    </nav>
  );
};

export default FormBuilderHeader;

const BuilderTabs = ({ formId }: { formId: string }) => {
  const pathname = usePathname();

  return (
    <div className="flex h-full items-center">
      <Link
        className={cn(
          "flex h-full w-[130px] items-center justify-center px-lg text-center uppercase opacity-60 transition-all duration-500",
          "font-bold hover:opacity-90",
          pathname.includes("/generate") && "text-primary opacity-100",
        )}
        href={`/builder/${formId}/generate`}
      >
        Generate
      </Link>
      <Link
        className={cn(
          "flex h-full w-[130px] items-center justify-center px-lg text-center uppercase opacity-60 transition-all duration-500",
          "font-bold hover:opacity-90",
          pathname.includes("/design") && "text-primary opacity-100",
        )}
        href={`/builder/${formId}/design`}
      >
        Design
      </Link>
      <Link
        className={cn(
          "flex h-full w-[130px] items-center justify-center px-lg text-center uppercase opacity-60 transition-all duration-500",
          "font-bold hover:opacity-90",
          pathname.includes("/preview") && "text-primary opacity-100",
        )}
        href={`/builder/${formId}/preview`}
      >
        Preview
      </Link>
      <Link
        className={cn(
          "flex h-full w-[130px] items-center justify-center px-lg text-center uppercase opacity-60 transition-all duration-500",
          "font-bold hover:opacity-90",
          pathname.includes("/publish") && "text-primary opacity-100",
        )}
        href={`/builder/${formId}/publish`}
      >
        Publish
      </Link>
    </div>
  );
};
