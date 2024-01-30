import { api } from "@/convex/_generated/api";
import { useDesigner } from "@/lib/hooks/useDesigner";
import { cn } from "@/lib/utils";
import { useAction } from "convex/react";
import { useTransition, useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { SiOpenai } from "react-icons/si";
import { type FormElementInstance } from "./form-elements";
import {
  DialogHeader,
  DialogFooter,
  DialogTrigger,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "./ui/dialog";
import { Textarea } from "./ui/textarea";
import short from "short-uuid";
import { Button } from "./ui/button";

const GenerateFormBtn = () => {
  const [generating, startTransition] = useTransition();
  const [userInput, setUserInput] = useState("");
  const generate = useAction(api.openai.generate);
  const { setElements } = useDesigner();

  const generateForm = async () => {
    const rawResponse = await generate({
      messageBody: userInput,
    });
    if (rawResponse === null) {
      console.log("No response");
      return;
    }
    console.log("🚀 ~ ", rawResponse);

    const jsonResponse = JSON.parse(rawResponse) as {
      elements: FormElementInstance[];
    };

    const newElements = jsonResponse.elements;

    newElements.forEach((element) => {
      element.id = short.generate();
    });

    setElements(newElements);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className={cn("gap-2 bg-gradient-to-r from-yellow-500 to-orange-500")}
        >
          <SiOpenai className="h-6 w-6" />
          Generate
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col gap-3 p-4">
        <DialogHeader>
          <DialogTitle>Generate Form Using AI</DialogTitle>
          <DialogDescription>
            Describe the form you're trying to make and we'll generate it for
            you.
          </DialogDescription>
        </DialogHeader>
        <Textarea
          rows={5}
          onChange={(e) => setUserInput(e.target.value)}
          value={userInput}
        />
        <DialogFooter>
          <Button
            className="gap-2"
            disabled={generating}
            onClick={(e) => {
              e.preventDefault();
              startTransition(generateForm);
            }}
          >
            Generate {generating && <FaSpinner className="animate-spin" />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GenerateFormBtn;
