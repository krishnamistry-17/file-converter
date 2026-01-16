import { create } from "zustand";

interface FileSessionStore {
  selectedFile: File | null;
  previewUrl: string | null;
  setSelectedFile: (file: File) => void;
  clearSelectedFile: () => void;
}

export const useFileSessionStore = create<FileSessionStore>((set) => ({
  selectedFile: null,
  previewUrl: null,

  setSelectedFile: (file) => {
    console.log(file, "file--------");
    set({
      selectedFile: file,
      previewUrl: URL.createObjectURL(file),
    });
  },

  clearSelectedFile: () =>
    set({
      selectedFile: null,
      previewUrl: null,
    }),
}));
