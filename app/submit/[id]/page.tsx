import { type FormElementInstance } from "@/components/form-elements";
import Page from "@/components/ui/page";
import UserSubmitForm from "@/components/user-submit-form";
import { api } from "@/convex/_generated/api";
import { type Id } from "@/convex/_generated/dataModel";
import { getAuthToken } from "@/lib/auth";
import { cn } from "@/lib/utils";
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
    <Page>
      <UserSubmitForm formId={params.id} content={formContent} />
      <div
        className={cn(
          "fixed inset-x-0 bottom-0 top-0 -z-50 transition-all",
          "bg-accent bg-[url(/svgs/subtle-prism.svg)] dark:bg-[url(/svgs/subtle-prism.svg)]",
        )}
      />
    </Page>
  );
}
