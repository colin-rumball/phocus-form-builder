"use client";

import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { useEffect, useState, type ComponentPropsWithoutRef } from "react";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { RiComputerFill, RiMoonFill, RiSunFill } from "react-icons/ri";
import { Skeleton } from "./ui/skeleton";

type ThemeSwitcherProps = ComponentPropsWithoutRef<"div">;

const ThemeSwitcher = ({ className }: ThemeSwitcherProps) => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return <Skeleton className="h-[40px] w-[128px]" />;

  return (
    <div className={cn("", className)}>
      <Tabs defaultValue={theme}>
        <TabsList>
          <TabsTrigger value="light" onClick={() => setTheme("light")}>
            <RiSunFill />
          </TabsTrigger>
          <TabsTrigger value="dark" onClick={() => setTheme("dark")}>
            <RiMoonFill />
          </TabsTrigger>
          <TabsTrigger value="system" onClick={() => setTheme("system")}>
            <RiComputerFill />
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

export default ThemeSwitcher;
