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
import { usePathname } from "next/navigation";
import { Button } from "./button";
import { IoCloseOutline } from "react-icons/io5";
import { SignInButton, UserButton } from "@clerk/nextjs";
import ThemeSwitcher from "../theme-switcher";
import { useConvexAuth } from "convex/react";

type HeaderProps = ComponentPropsWithRef<"header">;

const Header = forwardRef<HTMLDivElement, HeaderProps>(({ className }, ref) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let prevScrollPos = window.scrollY;
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;

      if (currentScrollPos < prevScrollPos) {
        setVisible(true);
        prevScrollPos = currentScrollPos;
      } else if (
        currentScrollPos > 120 &&
        currentScrollPos > prevScrollPos + 120
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
          "fixed z-header flex h-header w-svw justify-center bg-primary text-primary-foreground transition-transform",
          visible
            ? "duration-300"
            : "pointer-events-none -translate-y-full duration-500",
          className,
        )}
      >
        <HeaderContent />
      </header>
      <div className={cn("h-header")}></div>
    </>
  );
});

export default Header;

type HeaderContentProps = ComponentPropsWithRef<"div">;

const HeaderContent = forwardRef<HTMLDivElement, HeaderContentProps>(
  ({ className }, ref) => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const { isAuthenticated, isLoading } = useConvexAuth();

    const toggleDrawer = () => {
      setDrawerOpen((prev) => !prev);
      document.body.style.overflow = drawerOpen ? "auto" : "hidden";
    };

    return (
      <div
        ref={ref}
        className={cn(
          "container relative flex items-center justify-center lg:justify-start",
          className,
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

        {/* LOGO */}
        <Link variant={"image"} href={"/"}>
          <Image
            src={HeaderLogoImg}
            alt="Formulate Logo"
            className="mx-auto h-[50px] w-auto sm:h-[70px] lg:mx-8"
            priority
          />
        </Link>

        {/* NAV */}
        <Nav />

        <div className="flex items-center space-x-lg">
          <ThemeSwitcher />
          {isLoading ? (
            <>checking</>
          ) : isAuthenticated ? (
            <UserButton afterSignOutUrl="/" />
          ) : (
            <SignInButton>Login</SignInButton>
          )}
        </div>
      </div>
    );
  },
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
