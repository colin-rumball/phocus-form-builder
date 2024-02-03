import FormBuilder from "@/components/form-builder";
import Page from "@/components/ui/page";
import { type Id } from "@/convex/_generated/dataModel";

export default async function BuilderPage({
  params,
}: {
  params: { formId: string };
}) {
  return (
    <Page className="mt-[80px] h-full w-full">
      <FormBuilder formId={params.formId as Id<"forms">} />
    </Page>
  );
}
