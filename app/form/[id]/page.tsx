import FormBuilder from "@/components/form-builder";
import Headline from "@/components/ui/headline";
import Page from "@/components/ui/page";
import VisitBtn from "@/components/visit-btn";
import { type Id } from "@/convex/_generated/dataModel";

export default async function FormPage({ params }: { params: { id: string } }) {
  return (
    <Page className="h-main gap-xl">
      <div className="border-y border-muted py-10">
        <div className="container flex justify-between">
          <Headline as="h1">Form NAME</Headline>
          <VisitBtn formId={params.id} />
        </div>
      </div>
    </Page>
  );
}
