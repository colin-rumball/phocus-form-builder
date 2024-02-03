import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface DrawerState {
  visible: boolean;
  setVisible: (_visible: boolean) => void;
}

const useDrawer = create<DrawerState>()(
  devtools(
    persist(
      (set) => ({
        visible: true,
        setVisible: (_visible) => set(() => ({ visible: _visible })),
      }),
      {
        name: "drawer-storage",
      },
    ),
  ),
);

export default useDrawer;
