import { create } from "zustand";

type JournalEntry = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
};

type JournalState = {
  entries: JournalEntry[];
  addEntry: (title: string, content: string) => void;
  removeEntry: (id: string) => void;
  clear: () => void;
};

export const useJournalStore = create<JournalState>((set) => ({
  entries: [],
  addEntry: (title, content) =>
    set((state) => ({
      entries: [
        ...state.entries,
        {
          id: crypto.randomUUID(),
          title,
          content,
          createdAt: new Date().toISOString(),
        },
      ],
    })),
  removeEntry: (id) =>
    set((state) => ({ entries: state.entries.filter((e) => e.id !== id) })),
  clear: () => set({ entries: [] }),
}));
