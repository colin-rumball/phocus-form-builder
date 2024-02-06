import FormBuilder from "@/components/form-builder";
import Page from "@/components/ui/page";
import { api } from "@/convex/_generated/api";
import { type Id } from "@/convex/_generated/dataModel";
import { getAuthToken } from "@/lib/auth";
import { preloadQuery } from "convex/nextjs";

export default async function BuilderPage({
  params,
}: {
  params: { formId: string };
}) {
  const token = await getAuthToken();
  const preloadedForm = await preloadQuery(
    api.forms.get,
    {
      id: params.formId as Id<"forms">,
    },
    { token },
  );

  if (preloadedForm === null) {
    throw new Error("Form not found");
  }
  return (
    <Page>
      <FormBuilder preloadedForm={preloadedForm} />
    </Page>
  );
}
