"use client";

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
import useDesigner from "@/lib/hooks/useDesigner";
import { type FormElementInstance } from "./form-elements";
import { usePreloadedQuery, type Preloaded } from "convex/react";
import { type api } from "@/convex/_generated/api";
import { toast } from "./ui/use-toast";
import { Input } from "./ui/input";
import { Link } from "./ui/link";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import FormPreviewer from "./form-previewer";
import SimpleLoadingSpinner from "./loading-icons";

const FormBuilder = ({
  preloadedForm,
}: {
  preloadedForm: Preloaded<typeof api.forms.get>;
}) => {
  const form = usePreloadedQuery(preloadedForm);
  const {
    elements,
    setElements,
    setSelectedElement,
    setSavedAt,
    previewing,
    setPreviewing,
  } = useDesigner((state) => ({
    elements: state.elements,
    setElements: state.setElements,
    setSelectedElement: state.setSelectedElement,
    setSavedAt: state.setSavedAt,
    previewing: state.previewing,
    setPreviewing: state.setPreviewing,
  }));
  const { pause, resume, clear } = useDesigner.temporal.getState();

  useEffect(() => {
    clear();
    setSelectedElement(null);
    window.scrollTo({ top: 0 });
    setPreviewing(false);
  }, []);

  useEffect(() => {
    if (form) {
      pause();
      if (form.content !== "") {
        // TODO: handle parsing errors
        const JsonElements = JSON.parse(form.content) as FormElementInstance[];
        setElements(JsonElements, false);
      } else {
        setElements([], false);
      }
      setSavedAt(form.updatedAt ? new Date(form.updatedAt) : null);
      resume();
    }
  }, [preloadedForm, form, setSelectedElement, setElements]);

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
      <div className="flex h-full w-full flex-grow items-center justify-center">
        <SimpleLoadingSpinner className="h-12 w-12" />
      </div>
    );
  }

  // TODO: just redirect to the form page?
  if (form.published) {
    return (
      <div className="my-xl flex h-full w-full flex-col items-center justify-center gap-xl">
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
      <div className={cn("relative flex h-full w-full flex-grow flex-col")}>
        {!previewing && <Designer form={form} />}
        {previewing && <FormPreviewer />}
        {/* <AnimatedTab myTab="DESIGN"> */}
        {/* {currentTab === "DESIGN" && <Designer form={form} />} */}
        {/* </AnimatedTab> */}

        {/* <AnimatedTab myTab="PREVIEW"> */}
        {/* {currentTab === "PREVIEW" && <FormPreviewer />} */}
        {/* </AnimatedTab> */}
      </div>
      <div
        className={cn(
          "fixed inset-x-0 bottom-0 top-0 -z-50 transition-all",
          "bg-accent bg-[url(/svg/subtle-prism.svg)] dark:bg-[url(/svg/subtle-prism.svg)]",
        )}
      />
      <DragOverlayWrapper />
    </DndContext>
  );
};

export default FormBuilder;

const variants = {
  enter: (direction: number) => {
    return {
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0,
    };
  },
  center: {
    x: "0%",
    y: "0%",
    opacity: 1,
  },
  exit: (direction: number) => {
    return {
      x: direction > 0 ? "-100%" : "100%",
      opacity: 0,
    };
  },
};

// const AnimatedTab = ({
//   children,
//   myTab,
// }: {
//   children: ReactNode;
//   myTab: BuilderTab;
// }) => {
//   const currentTab = useBuilderTabs((state) => state.currentTab);
//   const prevTab = useRef(currentTab);
//   useEffect(() => {
//     prevTab.current = currentTab;
//   }, [currentTab]);
//   const [animating, setAnimating] = useState(false);
//   const direction = tabMap[currentTab] > tabMap[prevTab.current] ? 1 : -1;
//   return (
//     <AnimatePresence initial={false} custom={direction}>
//       {currentTab === myTab && (
//         <motion.div
//           className={cn(
//             "absolute inset-0",
//             animating && "pointer-events-none select-none overflow-hidden",
//           )}
//           key={`${myTab}-TAB`}
//           custom={direction}
//           variants={variants}
//           initial="enter"
//           animate="center"
//           exit={"exit"}
//           transition={{ ease: "backInOut", duration: 0.4 }}
//           onAnimationStart={() => {
//             setAnimating(true);
//           }}
//           onAnimationComplete={() => {
//             setAnimating(false);
//           }}
//         >
//           {children}
//         </motion.div>
//       )}
//     </AnimatePresence>
//   );
// };
