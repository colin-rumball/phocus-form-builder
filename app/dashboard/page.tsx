import FormCardList from "@/components/form-card-list";
import FormStats from "@/components/form-stats";
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
      <Section>
        <FormStats />
      </Section>
      <Section>
        <Separator className="my-6" />
        <Headline as="h2">Your forms</Headline>
        <Separator className="my-6" />
        <FormCardList />
      </Section>
    </Page>
  );
}
