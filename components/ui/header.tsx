"use client";

import { cn } from "@/lib/utils";
import {
  type ComponentPropsWithRef,
  forwardRef,
  useState,
  useEffect,
} from "react";
import Image from "next/image";
import LogoLightImg from "@/public/images/logo-light.png";
import LogoDarkImg from "@/public/images/logo-dark.png";
import { RxHamburgerMenu } from "react-icons/rx";
import { Link } from "../ui/link";
import { useParams, usePathname } from "next/navigation";
import { Button } from "./button";
import { IoCloseOutline } from "react-icons/io5";
import { SignInButton, UserButton, useAuth } from "@clerk/nextjs";
import ThemeSwitcher from "../theme-switcher";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { FaRegUser } from "react-icons/fa";
import { type Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import useHeader from "@/lib/hooks/useHeader";
import { Input } from "./input";
import FormBuilderHeader from "../form-builder-header";
import { Skeleton } from "./skeleton";
import Headline from "./headline";

type HeaderProps = ComponentPropsWithRef<"header">;

const Header = forwardRef<HTMLDivElement, HeaderProps>(({ className }, ref) => {
  const pathname = usePathname();
  const { headerVisible, setHeaderVisible } = useHeader((state) => ({
    headerVisible: state.visible,
    setHeaderVisible: state.setVisible,
  }));

  useEffect(() => {
    let prevScrollPos = window.scrollY;
    const handleScroll = () => {
      if (window.innerWidth > 768) {
        setHeaderVisible(true);
        return;
      }
      const currentScrollPos = window.scrollY;

      if (currentScrollPos < prevScrollPos) {
        setHeaderVisible(true);
        prevScrollPos = currentScrollPos;
      } else if (
        currentScrollPos > 70 &&
        currentScrollPos > prevScrollPos + 60
      ) {
        setHeaderVisible(false);
        prevScrollPos = currentScrollPos;
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        ref={ref}
        className={cn(
          "sticky top-0 z-header flex w-lvw bg-secondary text-foreground transition-transform",
          headerVisible ? "duration-300" : "-translate-y-header duration-500",
          className,
        )}
      >
        <div className="flex w-full flex-col">
          <div className="flex h-header justify-center px-xl">
            <ConditionalContent />
          </div>
          {pathname.includes("/builder") && <FormBuilderHeader />}
        </div>
      </header>
    </>
  );
});

export default Header;

const ConditionalContent = () => {
  const pathname = usePathname();

  if (pathname.includes("/submit")) {
    return <SubmitHeaderContent />;
  }

  return <SiteHeaderContent />;
};

const SubmitHeaderContent = () => {
  return (
    <div className="container flex h-full w-full items-center justify-end">
      <div className="absolute inset-y-0 left-1/2 flex -translate-x-1/2 items-center justify-center">
        <Logo />
      </div>
      <ThemeSwitcher />
    </div>
  );
};

const SiteHeaderContent = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setDrawerOpen((prev) => !prev);
    document.body.style.overflow = drawerOpen ? "auto" : "hidden";
  };

  return (
    <div
      className={cn(
        "container relative flex items-center justify-center lg:justify-start",
      )}
    >
      <div className="absolute left-0 flex h-header text-heading lg:hidden">
        <div className="absolute left-lg flex h-full items-center sm:left-8 md:left-12">
          <Button size={"icon"} onClick={toggleDrawer}>
            {drawerOpen ? <IoCloseOutline /> : <RxHamburgerMenu />}
          </Button>
        </div>

        <div
          className={cn(
            "absolute top-header h-main w-lvw",
            !drawerOpen && "pointer-events-none select-none",
          )}
        >
          <div
            onClick={toggleDrawer}
            className={cn(
              "absolute h-full w-full bg-black transition-opacity duration-300",
              drawerOpen
                ? "pointer-events-auto select-auto bg-opacity-30"
                : "pointer-events-none select-none bg-opacity-0",
            )}
          />

          <div
            className={cn(
              "border-light-green bg-green absolute left-0 h-full w-[calc(90lvw)] border-y border-r p-xl transition-transform duration-300 md:w-[calc(60lvw)]",
              drawerOpen ? "translate-x-0" : "-translate-x-full",
            )}
          >
            <Nav sideMenu />
          </div>
        </div>
      </div>
      <Logo />
      <Nav />
      <UserOptions />
    </div>
  );
};

const Logo = () => (
  <Link variant={"image"} href={"/"} className="flex items-center gap-5">
    <Image
      src={LogoLightImg}
      alt="PHOCUS Logo"
      className="hidden h-[70px] w-auto py-3 dark:block"
      priority
    />
    <Image
      src={LogoDarkImg}
      alt="PHOCUS Logo"
      className="block h-[70px] w-auto py-3 dark:hidden"
      priority
    />
    <span className="text-xl uppercase tracking-headline">Phocus</span>
  </Link>
);

const Nav = ({ sideMenu = false }) => {
  const pathName = usePathname();
  return (
    <nav
      className={cn(
        "mx-xl flex h-full flex-1 items-center justify-end space-x-8 text-lg",
        sideMenu
          ? "flex flex-col text-xl lg:hidden"
          : "hidden items-center lg:flex",
      )}
    >
      {[
        ["Home", "/"],
        ["Dashboard", "/dashboard"],
      ].map(([label, href]) => {
        return (
          href && (
            <Link
              key={href}
              href={href}
              variant={pathName === href ? "active" : "default"}
              className={cn(
                "rounded-md px-3 py-1 text-lg transition-colors duration-300 hover:bg-secondary hover:text-primary-foreground hover:shadow-md lg:rounded-lg lg:transition-colors lg:duration-300 lg:hover:bg-secondary lg:hover:text-primary-foreground lg:hover:shadow-lg",
              )}
            >
              {label}
            </Link>
          )
        );
      })}
    </nav>
  );
};

const UserOptions = () => {
  return (
    <div className="flex items-center space-x-lg">
      <ThemeSwitcher />
      <UserIcon />
    </div>
  );
};

const UserIcon = () => {
  const { isSignedIn } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return <Skeleton className="h-9 w-10" />;

  return (
    <div className="min-w-8">
      {isSignedIn && <UserButton afterSignOutUrl="/" />}
      {!isSignedIn && (
        <SignInButton>
          <FaRegUser className="h-5 w-7 cursor-pointer" />
        </SignInButton>
      )}
    </div>
  );
};
