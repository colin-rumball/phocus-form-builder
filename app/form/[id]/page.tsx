import FormShareButton from "@/components/form-share-btn";
import FormStatsCards from "@/components/form-stats-cards";
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
      <div className="border-b border-muted py-4">
        <div className="container flex items-center justify-between gap-2">
          <FormShareButton formId={params.id} />
        </div>
      </div>
      <FormStatsCards formId={params.id as Id<"forms">} />

      {/* TODO: SUBMISSION TABLE */}
    </Page>
  );
}
