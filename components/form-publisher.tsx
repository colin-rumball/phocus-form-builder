import { cn } from "@/lib/utils";
import { type ComponentPropsWithoutRef } from "react";
import PublishFormBtn from "./publish-form-btn";
import { type Id } from "@/convex/_generated/dataModel";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Textarea } from "./ui/textarea";

type FormPublisherProps = ComponentPropsWithoutRef<"div"> & {
  formId: Id<"forms">;
};

const FormPublisher = ({ className, formId }: FormPublisherProps) => {
  return (
    <div
      className={cn(
        "mt-2xl flex h-full w-full flex-col items-center justify-center",
        className,
      )}
    >
      <Card>
        <CardHeader>
          <CardTitle>Publish your form to the public</CardTitle>
          <CardDescription>This is the final step.</CardDescription>
        </CardHeader>
        <CardContent>
          Once you publish your form, it will be available to the public. <br />
          <strong>Warning:</strong> You can't unpublish a form once it's
          published.
        </CardContent>
        <CardFooter className="w-full">
          <PublishFormBtn formId={formId} />
        </CardFooter>
      </Card>
    </div>
  );
};

export default FormPublisher;
