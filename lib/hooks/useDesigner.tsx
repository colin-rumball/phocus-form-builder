"use client";

import { type FormElementInstance } from "@/components/form-elements";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { temporal } from "zundo";
import { shallow } from "zustand/shallow";

export type DesignerState = {
  elements: FormElementInstance[];
  setElements: (_elements: FormElementInstance[], setUnsaved?: boolean) => void;
  addElement: (
    index: number,
    element: FormElementInstance,
    setUnsaved?: boolean,
  ) => void;
  removeElement: (id: string) => void;
  removeAllElements: () => void;
  moveElement: (id: string, newIndex: number, setUnsaved?: boolean) => void;

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

type PartialDesignerState = Pick<DesignerState, "elements" | "unsavedChanges">;

const useDesigner = create<DesignerState>()(
  temporal(
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
      removeAllElements: () => {
        set(() => ({ unsavedChanges: true, elements: [] }));
      },
      moveElement: (id, newIndex, setUnsaved = true) => {
        set((state) => {
          const newElements = [...state.elements];
          const index = newElements.findIndex((e) => e.id === id);
          if (index !== -1) {
            const [removed] = newElements.splice(index, 1);
            if (index < newIndex) newIndex--;
            if (removed) {
              newElements.splice(newIndex, 0, removed);
            }
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
            if (
              shallow(
                newElements[index]?.extraAttributes,
                element.extraAttributes,
              )
            ) {
              return state;
            }
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
      equality: (
        pastState: PartialDesignerState,
        currentState: PartialDesignerState,
      ) => shallow(pastState, currentState),
      partialize: (state) => {
        const { elements, unsavedChanges } = state;
        return { elements, unsavedChanges };
      },
    },
  ),
);

export default useDesigner;
