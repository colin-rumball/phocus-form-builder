import FormBuilder from "@/components/form-builder";
import Page from "@/components/ui/page";
import { type Id } from "@/convex/_generated/dataModel";

export default async function DesignPage({
  params,
}: {
  params: { formId: string };
}) {
  return (
    <Page className="h-full">
      <FormBuilder formId={params.formId as Id<"forms">} />
    </Page>
  );
}
