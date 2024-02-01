"use client";

import { type FormElementInstance } from "@/components/form-elements";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export type DesignerState = {
  elements: FormElementInstance[];
  setElements: (_elements: FormElementInstance[], setUnsaved?: boolean) => void;
  addElement: (
    index: number,
    element: FormElementInstance,
    setUnsaved?: boolean,
  ) => void;
  removeElement: (id: string) => void;

  selectedElement: FormElementInstance | null;
  setSelectedElement: (
    elements: FormElementInstance | null,
    setUnsaved?: boolean,
  ) => void;

  updateElement: (
    id: string,
    element: FormElementInstance,
    setUnsaved?: boolean,
  ) => void;

  savedAt: Date | null;
  setSavedAt: (date: Date | null) => void;

  unsavedChanges: boolean;
  setUnsavedChanges: (unsavedChanges: boolean) => void;
};

const useDesigner = create<DesignerState>()(
  devtools(
    persist(
      (set) => ({
        elements: [],
        setElements: (_elements, setUnsaved = true) => {
          set(() => {
            return { unsavedChanges: setUnsaved, elements: _elements };
          });
        },
        addElement: (index, element, setUnsaved = true) => {
          set((state) => {
            const newElements = [...state.elements];
            newElements.splice(index, 0, element);
            return { unsavedChanges: setUnsaved, elements: newElements };
          });
        },
        removeElement: (id, setUnsaved = true) => {
          set((state) => {
            const newElements = [...state.elements];
            const index = newElements.findIndex((e) => e.id === id);
            if (index !== -1) {
              newElements.splice(index, 1);
            }
            return { unsavedChanges: setUnsaved, elements: newElements };
          });
        },
        selectedElement: null,
        setSelectedElement: (element) =>
          set(() => ({ selectedElement: element })),
        updateElement: (id, element, setUnsaved = true) => {
          set((state) => {
            const newElements = [...state.elements];
            const index = newElements.findIndex((e) => e.id === id);
            if (index !== -1) {
              newElements[index] = element;
            }
            return { unsavedChanges: setUnsaved, elements: newElements };
          });
        },
        savedAt: null,
        setSavedAt: (date) => set(() => ({ savedAt: date })),
        unsavedChanges: false,
        setUnsavedChanges: (unsavedChanges) => set(() => ({ unsavedChanges })),
      }),
      {
        name: "designer-storage",
      },
    ),
  ),
);

export default useDesigner;
