"use client";

import { cn } from "@/lib/utils";
import {
  type ComponentPropsWithRef,
  forwardRef,
  useState,
  useEffect,
} from "react";
import Image from "next/image";
import HeaderLogoImg from "@/public/images/logo-header.png";
import { RxHamburgerMenu } from "react-icons/rx";
import { Link } from "../ui/link";
import { useParams, usePathname } from "next/navigation";
import { Button } from "./button";
import { IoCloseOutline } from "react-icons/io5";
import { SignInButton, UserButton } from "@clerk/nextjs";
import ThemeSwitcher from "../theme-switcher";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { FaRegUser, FaSpinner } from "react-icons/fa";
import { type Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import Headline from "./headline";
import useHeader from "@/lib/hooks/useHeader";
import { Input } from "./input";
import useDrawer from "@/lib/hooks/useDrawer";

type HeaderProps = ComponentPropsWithRef<"header">;

const Header = forwardRef<HTMLDivElement, HeaderProps>(({ className }, ref) => {
  const pathname = usePathname();
  const { headerVisible, setHeaderVisible } = useHeader((state) => ({
    headerVisible: state.visible,
    setHeaderVisible: state.setVisible,
  }));
  const { drawerVisible } = useDrawer((state) => ({
    drawerVisible: state.visible,
  }));

  useEffect(() => {
    let prevScrollPos = window.scrollY;
    const handleScroll = () => {
      if (drawerVisible) return;
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
          "fixed z-header flex h-header w-lvw justify-center bg-primary px-lg text-primary-foreground transition-transform",
          headerVisible
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
  const params = useParams();
  const form = useQuery(api.forms.get, { id: params.formId as Id<"forms"> });
  const [nameInput, setNameInput] = useState("");
  const updateForm = useMutation(api.forms.update);

  useEffect(() => {
    if (!form) return;
    setNameInput(form.name);
  }, [form]);

  const onNameChanged = async (newName?: string) => {
    if (!form) return;
    if (newName === "") setNameInput(form.name);
    if (newName === form.name) return;

    await updateForm({
      id: form._id as Id<"forms">,
      data: { name: newName },
    });
  };

  return (
    <div className="absolute inset-y-0 left-1/2 flex w-full -translate-x-1/2 flex-col items-center justify-evenly">
      {!form && <FaSpinner className="h-5 w-7 animate-spin" />}
      {!!form && (
        <div
          className={cn(
            "hidden w-full max-w-[300px] text-center md:block lg:max-w-[460px] xl:max-w-[700px] 2xl:max-w-[900px]",
          )}
        >
          <Input
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            onBlur={() => onNameChanged(nameInput)}
            className={cn(
              "mx-0 ml-0 h-full w-full truncate rounded-none border-none bg-transparent px-0 py-0 text-center text-background focus-visible:border-0 focus-visible:ring-0 focus-visible:ring-offset-0",
              "text-heading font-medium leading-heading",
            )}
          />
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
  <Link variant={"image"} href={"/"} className="flex items-center">
    <Image
      src={HeaderLogoImg}
      alt="Formulate Logo"
      className="h-[50px] w-auto py-2 sm:h-[70px]"
      priority
    />
    <Headline as="h2" className="">
      Formulate
    </Headline>
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
      {[["Dashboard", "/dashboard"]].map(([label, href]) => {
        return (
          href && (
            <Link
              key={href}
              href={href}
              variant={pathName === href ? "active" : "default"}
              className="rounded-md px-3 py-1 text-lg no-underline transition-colors duration-300 hover:bg-secondary hover:text-primary-foreground hover:shadow-md lg:rounded-lg lg:transition-colors lg:duration-300 lg:hover:bg-secondary lg:hover:text-primary-foreground lg:hover:shadow-lg"
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
