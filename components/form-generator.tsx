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
import useDesigner from "@/lib/hooks/useDesigner";
import { useAction } from "convex/react";
import { type FormElementInstance } from "./form-elements";
import { Button } from "./ui/button";
import { FaSpinner } from "react-icons/fa";
import { Textarea } from "./ui/textarea";
import short from "short-uuid";
import useBuilderTabs from "@/lib/hooks/useBuilderTabs";
import { FiAlertCircle } from "react-icons/fi";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";

type FormGeneratorProps = ComponentPropsWithoutRef<"div">;

const FormGenerator = ({ className }: FormGeneratorProps) => {
  const setCurrentTab = useBuilderTabs((state) => state.setCurrentTab);
  const [generating, startTransition] = useTransition();
  const [userInput, setUserInput] = useState("");
  const generate = useAction(api.openai.generate);
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
        {elements.length !== 0 && (
          <div className="flex w-full flex-col items-center justify-center gap-2 bg-destructive p-4 text-destructive-foreground">
            <FiAlertCircle className="h-6 w-6" />
            <p>
              Generating a new form will erase all of the form fields you've
              already added.
            </p>
          </div>
        )}
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
            placeholder="Minimum 20 characters, maximum 300 characters."
            className="placeholder:text-foreground/60"
            onChange={(e) => setUserInput(e.target.value)}
            value={userInput}
            disabled={generating}
          />
        </CardContent>
        <CardFooter>
          {elements.length !== 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  className="w-full gap-2"
                  variant={"destructive"}
                  disabled={
                    generating ||
                    userInput.length < 20 ||
                    userInput.length > 300
                  }
                >
                  Generate{" "}
                  {generating && <FaSpinner className="animate-spin" />}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Generating a new form will erase all of the form fields
                    you've already added.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-destructive text-destructive-foreground"
                    onClick={(e) => {
                      e.preventDefault();
                      startTransition(generateForm);
                    }}
                  >
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          {elements.length === 0 && (
            <Button
              className="w-full gap-2"
              disabled={
                generating || userInput.length < 20 || userInput.length > 300
              }
              onClick={(e) => {
                e.preventDefault();
                startTransition(generateForm);
              }}
            >
              Generate {generating && <FaSpinner className="animate-spin" />}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default FormGenerator;
