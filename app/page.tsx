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
            <Headline as="h1">
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
      <div className="absolute left-0 top-0 -z-10 h-full w-full">
        <Image
          src={backgroundImg}
          alt="background image"
          fill
          quality={100}
          sizes="100vw"
          className="object-cover brightness-[0.8]"
        />
      </div>
    </Page>
  );
}
