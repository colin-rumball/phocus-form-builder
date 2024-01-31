import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface HeaderState {
  visible: boolean;
  setVisible: (_visible: boolean) => void;
}

const useHeader = create<HeaderState>()(
  devtools(
    persist(
      (set) => ({
        visible: true,
        setVisible: (_visible) => set(() => ({ visible: _visible })),
      }),
      {
        name: "header-storage",
      },
    ),
  ),
);

export default useHeader;
