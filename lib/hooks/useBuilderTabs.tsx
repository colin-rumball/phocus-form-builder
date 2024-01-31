import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export type BuilderTab = "GENERATE" | "DESIGN" | "PREVIEW" | "PUBLISH";
export const tabMap: Record<BuilderTab, number> = {
  GENERATE: 0,
  DESIGN: 1,
  PREVIEW: 2,
  PUBLISH: 3,
};

interface TabState {
  currentTab: BuilderTab;
  setCurrentTab: (_newTab: BuilderTab) => void;
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
