import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export type BuilderTab = "DESIGN" | "PREVIEW";
export const tabMap: Record<BuilderTab, number> = {
  DESIGN: 0,
  PREVIEW: 1,
};

interface TabState {
  currentTab: BuilderTab;
  setCurrentTab: (_newTab: BuilderTab) => void;
}

const useBuilderTabs = create<TabState>()(
  devtools(
    persist(
      (set) => ({
        currentTab: "DESIGN",
        setCurrentTab: (_newTab) => set(() => ({ currentTab: _newTab })),
      }),
      {
        name: "builder-tabs-storage",
      },
    ),
  ),
);

export default useBuilderTabs;
