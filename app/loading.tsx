import SimpleLoadingSpinner from "@/components/loading-icons";
import Page from "@/components/ui/page";
import Section from "@/components/ui/section";

export default function BaseLoadingPage() {
  return (
    <Page className="flex h-full items-center justify-center">
      <Section className="my-xl flex justify-center">
        <SimpleLoadingSpinner className="h-12 w-12 animate-spin" />
      </Section>
    </Page>
  );
}
