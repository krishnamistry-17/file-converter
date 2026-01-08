import { create } from "zustand";
interface SplitResults {
  name: string;
  url: string;
  blob: Blob;
  pages: string;
}

interface PageRange {
  from: number;
  to: number;
}

interface SplitStore {
  results: SplitResults[];
  setResults: (results: SplitResults[]) => void;
  clearResults: () => void;

  selectedPages: number[];
  setSelectedPages: (pages: number[]) => void;
  clearSelectedPages: () => void;

  selectedRange: PageRange[];
  setSelectedRange: (ranges: PageRange[]) => void;
  addSelectedRange: (range: PageRange) => void;
  clearSelectedRange: () => void;

  splitRangeType: "Range" | "Pages" | "Size";
  setSplitRangeType: (type: "Range" | "Pages" | "Size") => void;
  clearSplitRangeType: () => void;

  pageExtractMode: "extractAll" | "selectPages";
  setPageExtractMode: (mode: "extractAll" | "selectPages") => void;
  clearPageExtractMode: () => void;

  totalPages: number;
  setTotalPages: (pages: number) => void;
}

const useSplitStore = create<SplitStore>((set) => ({
  // results
  results: [],
  setResults: (results) => set({ results }),
  clearResults: () => set({ results: [] }),

  // pages
  selectedPages: [],
  setSelectedPages: (pages) => set({ selectedPages: pages }),
  clearSelectedPages: () => set({ selectedPages: [] }),

  // ranges
  selectedRange: [],
  setSelectedRange: (ranges) => set({ selectedRange: ranges }),
  addSelectedRange: (range) =>
    set((state) => ({
      selectedRange: [...state.selectedRange, range],
    })),
  clearSelectedRange: () => set({ selectedRange: [] }),

  // split range type
  splitRangeType: "Range",
  setSplitRangeType: (type) => set({ splitRangeType: type }),
  clearSplitRangeType: () => set({ splitRangeType: "Range" }),

  totalPages: 0,
  setTotalPages: (pages) => set({ totalPages: pages }),
  clearTotalPages: () => set({ totalPages: 0 }),

  pageExtractMode: "extractAll",
  setPageExtractMode: (mode) => set({ pageExtractMode: mode }),
  clearPageExtractMode: () => set({ pageExtractMode: "extractAll" }),
}));

export default useSplitStore;
