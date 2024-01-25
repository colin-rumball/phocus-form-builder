import { cn } from "@/lib/utils";
import { type ComponentPropsWithRef, forwardRef } from "react";
import { Link } from "./link";
import Headline from "./headline";

type Props = ComponentPropsWithRef<"footer">;

const Footer = forwardRef<HTMLDivElement, Props>(({ className }, ref) => {
  return (
    <footer
      ref={ref}
      className={cn("bg-light-green pt-xl relative", className)}
    >
      <div className={cn("gap container flex flex-col items-center")}>
        <Headline as="h4">Quick links</Headline>
        <ul className="gap-x-lg gap-y flex flex-wrap justify-center text-sm">
          {navLinks.map(([label, href], i) => (
            <li key={i}>
              <Link href={href ?? "/"} className="">
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-xl border-tan py-lg relative w-full border text-center opacity-60">
        <small className="">© 2024, BOILERPLATE</small>
        {/* <div className="absolute bottom-1/2 right-lg translate-y-1/2 text-black">
          <SocialLinks className="p-0" />
        </div> */}
      </div>
    </footer>
  );
});

export default Footer;

const navLinks = [
  ["Home Page", "/"],
  ["FAQs", "/faqs"],
  ["Our Story", "/our-story"],
  ["Contact Us", "/contact-us"],
  ["Terms of Service", "/policies/terms-of-service"],
  ["Privacy Policy", "/policies/privacy-policy"],
  ["Refund Policy", "/policies/refund-policy"],
];
