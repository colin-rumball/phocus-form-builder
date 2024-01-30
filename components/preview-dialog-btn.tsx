import { useDesigner } from "@/lib/hooks/useDesigner";
import { cn } from "@/lib/utils";
import { MdPreview } from "react-icons/md";
import { FormElements } from "./form-elements";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";

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

export default PreviewDialogBtn;
