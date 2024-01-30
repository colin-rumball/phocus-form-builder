import { FormElementInstance } from "@/components/form-elements";
import Page from "@/components/ui/page";
import UserSubmitForm from "@/components/user-submit-form";
import { api } from "@/convex/_generated/api";
import { type Id } from "@/convex/_generated/dataModel";
import { getAuthToken } from "@/lib/auth";
import { fetchMutation, fetchQuery } from "convex/nextjs";

export default async function SubmitPage({
  params,
}: {
  params: { id: string };
}) {
  const token = await getAuthToken();
  const rawFormContent = await fetchQuery(
    api.forms.getPublicContent,
    {
      id: params.id as Id<"forms">,
    },
    { token },
  );

  await fetchMutation(api.forms.incrementViews, {
    id: params.id as Id<"forms">,
  });

  if (!rawFormContent) {
    throw new Error("Form not found");
  }

  const formContent = JSON.parse(rawFormContent) as FormElementInstance[];

  return (
    <Page className="gap-xl">
      <UserSubmitForm formId={params.id} content={formContent} />
    </Page>
  );
}
