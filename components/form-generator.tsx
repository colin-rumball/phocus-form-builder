import { cn } from "@/lib/utils";
import { useState, useTransition, type ComponentPropsWithoutRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { api } from "@/convex/_generated/api";
import { useDesigner } from "@/lib/hooks/useDesigner";
import { useAction } from "convex/react";
import { type FormElementInstance } from "./form-elements";
import { Button } from "./ui/button";
import { FaSpinner } from "react-icons/fa";
import { Textarea } from "./ui/textarea";
import short from "short-uuid";
import useBuilderTabs from "@/lib/hooks/useBuilderTabs";

type FormGeneratorProps = ComponentPropsWithoutRef<"div">;

const FormGenerator = ({ className }: FormGeneratorProps) => {
  const setCurrentTab = useBuilderTabs((state) => state.setCurrentTab);
  const [generating, startTransition] = useTransition();
  const [userInput, setUserInput] = useState("");
  const generate = useAction(api.openai.generate);
  const { setElements } = useDesigner();

  const generateForm = async () => {
    const rawResponse = await generate({
      messageBody: userInput,
    });

    setUserInput("");

    if (rawResponse === null) {
      console.log("No response");
      return;
    }

    try {
      const jsonResponse = JSON.parse(rawResponse) as {
        elements: FormElementInstance[];
      };
      const newElements = jsonResponse.elements;

      newElements.forEach((element) => {
        element.id = short.generate();
      });

      setElements(newElements);
      setCurrentTab("DESIGN");
    } catch (e) {
      console.log("Error parsing openai response", rawResponse);

      console.error(e);
      return;
    }
  };
  return (
    <div
      className={cn(
        "mt-2xl flex h-full w-full flex-col items-center justify-center",
        className,
      )}
    >
      <Card>
        <CardHeader>
          <CardTitle>Generate a new form using AI</CardTitle>
          <CardDescription>
            Describe the form you're trying to make and we'll generate it for
            you.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            rows={5}
            onChange={(e) => setUserInput(e.target.value)}
            value={userInput}
          />
        </CardContent>
        <CardFooter>
          <Button
            className="w-full gap-2"
            disabled={generating}
            onClick={(e) => {
              e.preventDefault();
              startTransition(generateForm);
            }}
          >
            Generate {generating && <FaSpinner className="animate-spin" />}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default FormGenerator;
