import FormBuilder from "@/components/form-builder";
import Page from "@/components/ui/page";
import Section from "@/components/ui/section";
import { api } from "@/convex/_generated/api";
import { type Id } from "@/convex/_generated/dataModel";
import { getAuthToken } from "@/lib/auth";
import { fetchQuery } from "convex/nextjs";

export default async function BuilderPage({
  params,
}: {
  params: { id: string };
}) {
  const token = await getAuthToken();
  const form = await fetchQuery(
    api.forms.get,
    {
      id: params.id as Id<"forms">,
    },
    { token },
  );

  if (!form) {
    throw new Error("Form not found");
  }
  return (
    <Page className="h-main gap-xl">
      <FormBuilder form={form} />
    </Page>
  );
}
