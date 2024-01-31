import Page from "@/components/ui/page";
import Section from "@/components/ui/section";
import { ImSpinner2 } from "react-icons/im";

export default function BuilderLoadingPage() {
  return (
    <Page className="flex h-full items-center justify-center">
      <Section className="my-xl flex justify-center">
        LOADING PAGE
        <ImSpinner2 className="h-12 w-12 animate-spin" />
      </Section>
    </Page>
  );
}
