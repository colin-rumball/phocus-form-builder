"use client";

import { Button } from "@/components/ui/button";
import Headline from "@/components/ui/headline";
import { Link } from "@/components/ui/link";
import Page from "@/components/ui/page";
import Section from "@/components/ui/section";
import { useEffect } from "react";

export default function BuilderErrorPage({ error }: { error: Error }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Page className="">
      <Section className="my-xl flex flex-col items-center justify-center gap-xl">
        <Headline as="h2" className="text-destructive">
          Something went wrong
        </Headline>
        <Button asChild>
          <Link href={"/dashboard"}>Return to dashboard</Link>
        </Button>
      </Section>
    </Page>
  );
}
