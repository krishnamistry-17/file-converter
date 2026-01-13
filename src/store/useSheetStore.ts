import axios from "axios";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface Files {
  id: string;
  title: string;
  brand: string;
  category: string;
  price: number;
  rating: number;
  images: string[];
}

interface FileExtensions {
  csv: string;
  xlsx: string;
  xls: string;
  json: string;
  pdf: string;
  docx: string;
  doc: string;
  pptx: string;
  ppt: string;
}

interface FilesStore {
  files: Files[];
  loading: boolean;
  error: string | null;
  setError: (error: string | null) => void;
  setFiles: (files: Files[]) => void;
  fetchFiles: () => Promise<void>;
  selectedFile: File | null;
  setSelectedFile: (file: any) => void;
  clearSelectedFile: () => void;
  fileExtension: FileExtensions;

  previewFile: string | null;
  setPreviewFile: (file: string | null) => void;

  downloadFileUrl: string | null;
  setDownloadFileUrl: (file: string | null) => void;
  clearDownloadFileUrl: () => void;

  downloadFilePreview: string | null;
  setDownloadFilePreview: (file: string | null) => void;
  clearDownloadFilePreview: () => void;

  mergeFile1: File | null;
  mergeFile2: File | null;
  setMergeFile1: (file: File | null) => void;
  setMergeFile2: (file: File | null) => void;
  clearMergeFile1: () => void;
  clearMergeFile2: () => void;

  mergedPdfPreview: string | null;
  setMergedPdfPreview: (preview: string | null) => void;

  uploadModalOpen: boolean;
  setUploadModalOpen: (open: boolean) => void;
  clearUploadModalOpen: () => void;
}

const useFilesStore = create<FilesStore>()(
  persist(
    (set) => {
      return {
        files: [],
        loading: false,
        error: null,
        setError: (error) => set({ error }),
        setFiles: (files) => set({ files }),
        fetchFiles: async () => {
          try {
            set({ loading: true, error: null });
            const res = await axios.get("https://dummyjson.com/products");
            const data = res.data.products.sort(
              (a: any, b: any) => a.id - b.id
            );
            set({ files: data, loading: false });
          } catch (err) {
            set({ error: "Failed to fetch data", loading: false });
          }
        },

        selectedFile: null,
        setSelectedFile: (file: any) => set({ selectedFile: file }),
        clearSelectedFile: () => set({ selectedFile: null }),
        fileExtension: {
          csv: ".csv",
          xlsx: ".xlsx",
          xls: ".xls",
          json: ".json",
          pdf: ".pdf",
          docx: ".docx",
          doc: ".doc",
          pptx: ".pptx",
          ppt: ".ppt",
        },

        previewFile: null,
        setPreviewFile: (file: string | null) => set({ previewFile: file }),

        downloadFilePreview: null,
        setDownloadFilePreview: (file: string | null) =>
          set({ downloadFilePreview: file }),
        clearDownloadFilePreview: () => set({ downloadFilePreview: null }),

        downloadFileUrl: null,
        setDownloadFileUrl: (file: string | null) => set({ downloadFileUrl: file }),
        clearDownloadFileUrl: () => set({ downloadFileUrl: null }),

        mergeFile1: null,
        mergeFile2: null,
        setMergeFile1: (file: File | null) => set({ mergeFile1: file }),
        setMergeFile2: (file: File | null) => set({ mergeFile2: file }),
        clearMergeFile1: () => set({ mergeFile1: null }),
        clearMergeFile2: () => set({ mergeFile2: null }),
        mergedPdfPreview: null,
        setMergedPdfPreview: (preview: string | null) =>
          set({ mergedPdfPreview: preview }),

        uploadModalOpen: false,
        setUploadModalOpen: (open: boolean) => set({ uploadModalOpen: open }),
        clearUploadModalOpen: () => set({ uploadModalOpen: false }),
      };
    },
    {
      name: "files",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useFilesStore;
