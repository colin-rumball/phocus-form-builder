import { cn, generateId } from "@/lib/utils";
import { useState, useTransition } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { api } from "@/convex/_generated/api";
import useDesigner from "@/lib/hooks/useDesigner";
import { useAction, useMutation } from "convex/react";
import { type FormElementInstance } from "./form-elements";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import useBuilderTabs from "@/lib/hooks/useBuilderTabs";
import SimpleLoadingSpinner from "./loading-icons";
import { type Doc } from "@/convex/_generated/dataModel";

const FormGenerator = ({
  className,
  form,
}: {
  className: string;
  form: Doc<"forms">;
}) => {
  const [error, setError] = useState(false);
  const setCurrentTab = useBuilderTabs((state) => state.setCurrentTab);
  const [generating, startTransition] = useTransition();
  const [userInput, setUserInput] = useState("");
  const generate = useAction(api.openai.generate);
  const updateForm = useMutation(api.forms.update);
  const { elements, setElements } = useDesigner((state) => ({
    elements: state.elements,
    setElements: state.setElements,
  }));

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
        formName: string;
        elements: FormElementInstance[];
      };
      const { formName, elements: newElements } = jsonResponse;

      await updateForm({
        id: form._id,
        data: {
          name: formName ?? "Untitled Form",
          content: JSON.stringify(newElements),
        },
      });

      newElements.forEach((element) => {
        element.id = generateId();
      });

      setElements(newElements);
      setCurrentTab("DESIGN");
    } catch (e) {
      // TODO: look at all errors and handle them
      console.log("Error parsing openai response", rawResponse);

      console.error(e);
      return;
    }
  };

  return (
    <div className={cn("my-lg flex w-full flex-col items-center", className)}>
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Generate a new form using AI</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            rows={3}
            placeholder="Minimum 20 characters, maximum 300 characters."
            className={cn(
              "placeholder:text-foreground/60",
              error && "border-destructive placeholder:text-destructive/60",
            )}
            onChange={(e) => setUserInput(e.target.value)}
            onFocus={() => setError(false)}
            value={userInput}
            disabled={generating}
          />
        </CardContent>
        <CardFooter>
          {elements.length === 0 && (
            <Button
              className="w-full gap-2"
              disabled={generating}
              onClick={(e) => {
                e.preventDefault();
                if (userInput.length < 20 || userInput.length > 300) {
                  setError(true);
                  return;
                }
                startTransition(generateForm);
              }}
            >
              {!generating && <>Generate form using AI </>}
              {generating && <>Generating </>}
              {generating && <SimpleLoadingSpinner className="" />}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default FormGenerator;
