import { create } from "zustand";

interface pageResult {
  name: string;
  blob: Blob;
  url: string;
  pages: number;
  rotation: number;
}

interface OrganizeStore {
  results: pageResult[];
  setResults: (results: pageResult[]) => void;
  clearResults: () => void;

  totalPages: number;
  setTotalPages: (pages: number) => void;
  clearTotalPages: () => void;

  sortedResults: pageResult[];
  setSortedResults: (results: pageResult[]) => void;
  clearSortedResults: () => void;

  rotatePdfIndexes: number[];
  setRotatePdfIndexes: (index: number[]) => void;
  clearRotatePdf: () => void;
}

export const useOrganizeStore = create<OrganizeStore>((set) => ({
  results: [],
  setResults: (results: pageResult[]) => set({ results }),
  clearResults: () => set({ results: [] }),

  totalPages: 0,
  setTotalPages: (pages: number) => set({ totalPages: pages }),
  clearTotalPages: () => set({ totalPages: 0 }),

  sortedResults: [],
  setSortedResults: (results: pageResult[]) => set({ sortedResults: results }),
  clearSortedResults: () => set({ sortedResults: [] }),

  rotatePdfIndexes: [],
  setRotatePdfIndexes: (index: number[]) => set({ rotatePdfIndexes: index }),
  clearRotatePdf: () => set({ rotatePdfIndexes: [] }),
}));
