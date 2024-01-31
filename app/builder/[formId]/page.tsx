import { redirect } from "next/navigation";

export default function FormIdPage({ params }: { params: { formId: string } }) {
  redirect(`/builder/${params.formId}/generate`);
}
