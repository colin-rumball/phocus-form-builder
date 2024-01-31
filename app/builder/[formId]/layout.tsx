import FormBuilderHeader from "@/components/form-builder-header";
import { api } from "@/convex/_generated/api";
import { type Id } from "@/convex/_generated/dataModel";
import { getAuthToken } from "@/lib/auth";
import { fetchQuery } from "convex/nextjs";

export default async function BuilderLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { formId: string };
}) {
  const token = await getAuthToken();
  const form = await fetchQuery(
    api.forms.get,
    {
      id: params.formId as Id<"forms">,
    },
    { token },
  );

  if (form === null) {
    throw new Error("Form not found");
  }

  return (
    <>
      <FormBuilderHeader form={form} />
      <div className="mt-[80px]">{children}</div>
    </>
  );
}
