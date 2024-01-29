import { cn } from "@/lib/utils";
import { type ComponentPropsWithRef, forwardRef } from "react";
import { Link } from "./link";
import Headline from "./headline";

type Props = ComponentPropsWithRef<"footer">;

const Footer = forwardRef<HTMLDivElement, Props>(({ className }, ref) => {
  return (
    <footer ref={ref} className={cn("relative bg-muted pt-xl", className)}>
      <div className={cn("container flex flex-col items-center gap")}>
        <Headline as="h4">Quick links</Headline>
        <ul className="text-sm flex flex-wrap justify-center gap-x-lg gap-y">
          {navLinks.map(([label, href], i) => (
            <li key={i}>
              <Link href={href ?? "/"} className="">
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="border-tan relative mt-xl w-full border py-lg text-center opacity-60">
        <small className="">© 2024, FORMULATE</small>
      </div>
    </footer>
  );
});

export default Footer;

const navLinks = [
  ["Home Page", "/"],
  ["Dashboard", "/dashboard"],
  // ["Our Story", "/our-story"],
  // ["Contact Us", "/contact-us"],
  // ["Terms of Service", "/policies/terms-of-service"],
  // ["Privacy Policy", "/policies/privacy-policy"],
  // ["Refund Policy", "/policies/refund-policy"],
];
