import { create } from "zustand";

interface SplitResults {
  name: string;
  url: string;
  blob: Blob;
  pages: number;
}

interface SplitStore {
  results: SplitResults[];
  setResults: (results: SplitResults[]) => void;
  clearResults: () => void;
}

const useSplitStore = create<SplitStore>()((set) => {
  return {
    results: [],
    setResults: (results) => set({ results }),
    clearResults: () => set({ results: [] }),
  };
});

export default useSplitStore;
