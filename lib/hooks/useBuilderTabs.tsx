import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

type Tab = "GENERATE" | "DESIGN" | "PREVIEW" | "PUBLISH";

interface TabState {
  currentTab: Tab;
  setCurrentTab: (_newTab: Tab) => void;
}

const useBuilderTabs = create<TabState>()(
  devtools(
    persist(
      (set) => ({
        currentTab: "GENERATE",
        setCurrentTab: (_newTab) => set(() => ({ currentTab: _newTab })),
      }),
      {
        name: "builder-tabs-storage",
      },
    ),
  ),
);

export default useBuilderTabs;
