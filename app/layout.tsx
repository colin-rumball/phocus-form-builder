import "@/app/globals.css";

import { Catamaran } from "next/font/google";
// import { Analytics } from "@vercel/analytics/react";
import Providers from "@/components/providers/providers";
import Header from "@/components/ui/header";
import { TailwindIndicator } from "@/components/dev/TailwindIndicator";
import Footer from "@/components/ui/footer";
import { Toaster } from "@/components/ui/toaster";
import NextTopLoader from "nextjs-toploader";

const catamaran = Catamaran({
  subsets: ["latin"],
  variable: "--font-body",
  fallback: ["Arial", "sans-serif"],
  weight: ["400", "500"],
});

export const metadata = {
  title: "Formulate",
  description: "An online form builder",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head></head>
      <body
        className={`font-sans ${catamaran.variable} relative h-full min-h-screen overflow-x-hidden`}
      >
        <NextTopLoader />
        <Providers>
          <div className="relative flex min-h-screen flex-col">
            <Header />
            {children}
            <Toaster />
            <Footer />
          </div>
        </Providers>
        {/* TODO: enable analytics */}
        {/* <Analytics /> */}
        <TailwindIndicator />
      </body>
    </html>
  );
}
