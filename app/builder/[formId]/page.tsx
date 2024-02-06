import FormBuilder from "@/components/form-builder";
import Page from "@/components/ui/page";
import { type Id } from "@/convex/_generated/dataModel";

export default async function BuilderPage({
  params,
}: {
  params: { formId: string };
}) {
  return (
    <Page>
      <FormBuilder formId={params.formId as Id<"forms">} />
    </Page>
  );
}
