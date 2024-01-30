import FormBuilder from "@/components/form-builder";
import Page from "@/components/ui/page";
import { type Id } from "@/convex/_generated/dataModel";

export default async function BuilderPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <Page className="h-full">
      <FormBuilder formId={params.id as Id<"forms">} />
    </Page>
  );
}
