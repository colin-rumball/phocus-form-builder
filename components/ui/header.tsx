"use client";

import { cn } from "@/lib/utils";
import {
  type ComponentPropsWithRef,
  forwardRef,
  useState,
  useEffect,
} from "react";
import Image from "next/image";
import HeaderLogoImg from "@/public/images/header-logo.png";
import { RxHamburgerMenu } from "react-icons/rx";
import { Link } from "../ui/link";
import { useParams, usePathname } from "next/navigation";
import { Button } from "./button";
import { IoCloseOutline } from "react-icons/io5";
import { SignInButton, UserButton } from "@clerk/nextjs";
import ThemeSwitcher from "../theme-switcher";
import { useConvexAuth, useQuery } from "convex/react";
import { FaRegUser, FaSpinner } from "react-icons/fa";
import { type Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import Headline from "./headline";
import useHeader from "@/lib/hooks/useHeader";
import useDesigner from "@/lib/hooks/useDesigner";
import { formatDistance } from "date-fns";
import { Badge } from "./badge";

type HeaderProps = ComponentPropsWithRef<"header">;

const Header = forwardRef<HTMLDivElement, HeaderProps>(({ className }, ref) => {
  const pathname = usePathname();
  const { visible, setVisible } = useHeader((state) => ({
    visible: state.visible,
    setVisible: state.setVisible,
  }));

  useEffect(() => {
    let prevScrollPos = window.scrollY;
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;

      if (currentScrollPos < prevScrollPos) {
        setVisible(true);
        prevScrollPos = currentScrollPos;
      } else if (
        currentScrollPos > 70 &&
        currentScrollPos > prevScrollPos + 60
      ) {
        setVisible(false);
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
          "fixed z-header flex h-header w-full justify-center bg-primary px-lg text-primary-foreground transition-transform",
          visible
            ? "duration-300"
            : "pointer-events-none -translate-y-full duration-500",
          className,
        )}
      >
        {!pathname.includes("/builder") && <SiteHeaderContent />}
        {pathname.includes("/builder") && <BuilderHeaderContent />}
      </header>
      <div className={cn("h-header")} />
    </>
  );
});

export default Header;

const BuilderHeaderContent = () => {
  return (
    <div className="relative flex w-full items-center justify-between">
      <Logo />
      <div className="flex flex-grow justify-center">
        <FormHeaderInfo />
      </div>
      <UserOptions />
    </div>
  );
};

const FormHeaderInfo = () => {
  const { savedAt, unsavedChanges } = useDesigner((state) => ({
    savedAt: state.savedAt,
    unsavedChanges: state.unsavedChanges,
  }));
  const params = useParams();
  const form = useQuery(api.forms.get, { id: params.formId as Id<"forms"> });

  const badgeText = unsavedChanges
    ? `Form unsaved`
    : ` Form saved ${formatDistance(savedAt, Date.now(), { addSuffix: true })}`;

  return (
    <div className="absolute inset-y-0 left-1/2 flex -translate-x-1/2 flex-col items-center justify-evenly">
      {!form && <FaSpinner className="h-5 w-7 animate-spin" />}
      {!!form && (
        <div className={cn("text-center")}>
          <Headline as="h3">{form?.name}</Headline>
          <Badge
            variant={"destructive"}
            className={cn(
              unsavedChanges ? "text-destructive-foreground" : "text-green-700",
            )}
          >
            {badgeText}
          </Badge>
        </div>
      )}
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
  <Link variant={"image"} href={"/"}>
    <Image
      src={HeaderLogoImg}
      alt="Formulate Logo"
      className="h-[50px] w-auto py-2 sm:h-[70px]"
      priority
    />
  </Link>
);

const Nav = ({ sideMenu = false }) => {
  const pathName = usePathname();
  return (
    <nav
      className={cn(
        "h-full flex-1 space-x-8 text-lg opacity-80",
        sideMenu
          ? "flex flex-col text-xl lg:hidden"
          : "hidden items-center lg:flex",
      )}
    >
      {[["Dashboard", "/dashboard"]].map(([label, href]) => {
        return (
          href && (
            <Link
              key={href}
              href={href}
              variant={pathName === href ? "active" : "default"}
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
  const { isAuthenticated, isLoading } = useConvexAuth();
  return (
    <div className="flex items-center space-x-lg">
      <ThemeSwitcher />
      <div className="min-w-8">
        {isLoading && <FaSpinner className="h-5 w-7 animate-spin" />}
        {!isLoading && isAuthenticated && <UserButton afterSignOutUrl="/" />}
        {!isLoading && !isAuthenticated && (
          <SignInButton>
            <FaRegUser className="h-5 w-7 cursor-pointer" />
          </SignInButton>
        )}
      </div>
    </div>
  );
};
