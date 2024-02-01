import FormCardList from "@/components/form-card-list";
import Headline from "@/components/ui/headline";
import Page from "@/components/ui/page";
import Section from "@/components/ui/section";
import { Separator } from "@/components/ui/separator";

export default function DashboardPage() {
  return (
    <Page className="gap-xl">
      <Section bleed className="bg-accent py-xl">
        <div className="container">
          <Headline as="h1">Dashboard</Headline>
        </div>
      </Section>
      <FormCardList />
    </Page>
  );
}
