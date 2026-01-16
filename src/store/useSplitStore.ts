import { create } from "zustand";

type SplitRange = { from: string; to: string };

interface SplitStore {
  splitRangeType: "Range" | "Pages" | "Size";
  results: any[];
  activeMode: "custome" | "fixed";
  activeRange: SplitRange[];
  pageRange: string;
  setActiveMode: (mode: "custome" | "fixed") => void;
  setActiveRange: (ranges: SplitRange[]) => void;
  setPageRange: (value: string) => void;
  setResults: (results: any[]) => void;
  clearResults: () => void;
  sizeUnit: "KB" | "MB";
  setSizeUnit: (unit: "KB" | "MB") => void;
  clearSizeUnit: () => void;
  totalPages: number;
  setTotalPages: (pages: number) => void;
  clearTotalPages: () => void;
  clearSelectedRange: () => void;
  setSplitRangeType: (type: "Range" | "Pages" | "Size") => void;
  pageExtractMode: "extractAll" | "selectPages";
  setPageExtractMode: (mode: "extractAll" | "selectPages") => void;
  clearPageExtractMode: () => void;
}

const useSplitStore = create<SplitStore>((set) => ({
  splitRangeType: "Range",
  results: [],
  activeMode: "custome",
  activeRange: [{ from: "1", to: "10" }],
  pageRange: "",
  setActiveMode: (mode) => set({ activeMode: mode }),
  setActiveRange: (ranges) => set({ activeRange: ranges }),
  setPageRange: (value) => set({ pageRange: value }),
  setResults: (results) => set({ results }),
  clearResults: () => set({ results: [] }),
  clearSelectedRange: () =>
    set({ activeRange: [{ from: "1", to: "10" }], pageRange: "" }),
  sizeUnit: "MB",
  setSizeUnit: (unit) => set({ sizeUnit: unit }),
  clearSizeUnit: () => set({ sizeUnit: "MB" }),
  setSplitRangeType: (type) => set({ splitRangeType: type }),
  pageExtractMode: "extractAll",
  setPageExtractMode: (mode) => set({ pageExtractMode: mode }),
  clearPageExtractMode: () => set({ pageExtractMode: "extractAll" }),

  totalPages: 0,
  setTotalPages: (pages) => set({ totalPages: pages }),
  clearTotalPages: () => set({ totalPages: 0 }),
}));

export default useSplitStore;
