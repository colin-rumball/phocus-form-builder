import { Button } from "@/components/ui/button";
import Headline from "@/components/ui/headline";
import Page from "@/components/ui/page";
import Section from "@/components/ui/section";
import Image from "next/image";
import backgroundImg from "../public/images/bg.png";
import { Link } from "@/components/ui/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import clsx from "clsx";
import { Check } from "lucide-react";

export default async function HomePage() {
  return (
    <>
      <section className="relative mt-[-70px] flex h-full w-full flex-col items-center justify-center md:pt-44 ">
        {/* grid */}

        <div className="absolute bottom-0 left-0 right-0 top-0 -z-10 bg-[linear-gradient(to_right,#161616_1px,transparent_1px),linear-gradient(to_bottom,#161616_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

        <p className="text-center">
          Build Beautiful Forms Easily and Efficiently using AI
        </p>
        <div className="relative bg-gradient-to-r from-primary to-secondary-foreground bg-clip-text text-transparent">
          <h1 className="text-9xl text-center font-bold md:text-[300px]">
            Phocus
          </h1>
        </div>
        <div className="relative flex items-center justify-center md:mt-[-70px]">
          <Image
            src={"/images/preview.png"}
            alt="banner image"
            height={1200}
            width={1200}
            className="rounded-tl-2xl rounded-tr-2xl border-2 border-muted"
          />
          <div className="absolute bottom-0 left-0 right-0 top-[50%] z-10 bg-gradient-to-t dark:from-background"></div>
        </div>
      </section>
      <section className="mt-[-60px] flex flex-col items-center justify-center gap-4 md:!mt-20">
        <h2 className="text-4xl text-center">
          Streamline your data collection process with our intuitive online form
          builder. Create, customize, and share forms in minutes.
        </h2>
        <div className="mb-12">
          <Button asChild>
            <Link href="/dashboard" className="opacity-100">
              Get Started
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
