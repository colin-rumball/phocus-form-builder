import { Button } from "@/components/ui/button";
import Headline from "@/components/ui/headline";
import Page from "@/components/ui/page";
import Section from "@/components/ui/section";
import Image from "next/image";
import backgroundImg from "../public/images/bg.png";
import { Link } from "@/components/ui/link";

export default async function HomePage() {
  return (
    <Page>
      <Section className="flex h-full flex-grow flex-col justify-center">
        <div className="flex h-full max-w-[58ch] flex-col justify-center gap-xl py-xl">
          <div className="">
            <Headline as="h1" className="font-bold">
              Build Beautiful Forms Easily and Efficiently using AI
            </Headline>
          </div>
          <p className="">
            Streamline your data collection process with our intuitive online
            form builder. Create, customize, and share forms in minutes.
          </p>
          <div className="">
            <Button asChild>
              <Link href="/dashboard" className="opacity-100">
                Get Started
              </Link>
            </Button>
          </div>
        </div>
      </Section>
      <div className="absolute inset-0 -z-10 bg-[url(/svgs/dot-grid-light.svg)] text-white dark:bg-[url(/svgs/dot-grid-dark.svg)]">
        <div className="bg-gradient-radial -z-20 h-full w-full from-transparent to-background to-80%" />
      </div>
    </Page>
  );
}
