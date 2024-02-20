import "@/app/globals.css";

import { Roboto, Quicksand } from "next/font/google";
// import { Analytics } from "@vercel/analytics/react";
import Providers from "@/components/providers/providers";
import Header from "@/components/ui/header";
import { TailwindIndicator } from "@/components/dev/TailwindIndicator";
import Footer from "@/components/ui/footer";
import { Toaster } from "@/components/ui/toaster";
import NextTopLoader from "nextjs-toploader";

const roboto = Roboto({
  subsets: ["latin"],
  variable: "--font-family-body",
  fallback: ["Arial", "sans-serif"],
  weight: ["400", "500"],
});

const quicksand = Quicksand({
  subsets: ["latin"],
  variable: "--font-family-headline",
  fallback: ["Arial", "sans-serif"],
  weight: ["600", "500"],
});

export const metadata = {
  title: "Phocus Form Builder",
  description: "An online form builder",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head></head>
      <body
        className={`font-sans ${roboto.className} ${quicksand.variable} relative h-full min-h-screen overflow-x-hidden`}
      >
        <NextTopLoader />
        <Providers>
          <div className="relative flex min-h-screen flex-col">
            <Header />
            {children}
            <Toaster />
            {/* <Footer /> */}
          </div>
        </Providers>
        {/* TODO: enable analytics */}
        {/* <Analytics /> */}
        <TailwindIndicator />
      </body>
    </html>
  );
}
