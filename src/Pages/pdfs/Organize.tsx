import { useEffect, useState } from "react";
import SelectFile from "../../components/SelectFile";
import InputField from "../../components/InputField";
import { useFileSessionStore } from "../../store/useFileSessionStore";
import { useOrganizeStore } from "../../store/useOrganizeStore";
import OrganizePreviewGrid from "../../components/organize/OrganizePreviewGrid";
import {
  IoMdAdd,
  IoMdArrowForward,
  IoMdClose,
  IoMdTrash,
} from "react-icons/io";
import { FaSortNumericUpAlt } from "react-icons/fa";
import { FaSortNumericUp } from "react-icons/fa";
import useUploadData from "../../hooks/useUploadData";
import useFilesStore from "../../store/useSheetStore";

const Organize = () => {
  const { selectedFile, setSelectedFile, clearSelectedFile } =
    useFileSessionStore();

  const setLoading = useFilesStore((state) => state.setLoading);
  const { results, setResults, clearResults, setSortedResults } =
    useOrganizeStore();

  const { extractAllPages, organizePdf } = useUploadData();

  const [isMobile, setIsMobile] = useState(false);
  const [isSorted, setIsSorted] = useState(false);
  const [_sortedText, setSortedText] = useState<
    "Sort Ascending" | "Sort Descending"
  >("Sort Ascending");

  const [newSelectedFiles, setNewSelectedFiles] = useState<File[]>([]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);

    const pages = await extractAllPages(file);
    setResults(
      pages.map((page, index) => ({
        ...page,
        rotation: 0,
        pages: index + 1,
      }))
    );
  };

  const handleAddMoreFiles = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".pdf";

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      const newPages = await extractAllPages(file);

      const startIndex = results.length;

      setResults([
        ...results,
        ...newPages.map((page, index) => ({
          ...page,
          rotation: 0,
          pages: startIndex + index + 1,
        })),
      ]);

      setNewSelectedFiles([...newSelectedFiles, file]);
    };

    input.click();
  };

  const handleOrganizePdf = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 100));
    try {
      organizePdf(results, "organized.pdf");
    } catch (error) {
      console.error(error);
      alert("Organize failed!");
    } finally {
      setLoading(false);
    }
  };

  const handleSortFiles = () => {
    if (isSorted) {
      setSortedResults([...results].sort((a, b) => b.pages - a.pages));
    } else {
      const sorted = [...results].sort((a, b) => a.pages - b.pages);
      setSortedResults(sorted);
    }
    setIsSorted(!isSorted);
  };

  const handleReset = () => {
    clearSelectedFile();
    clearResults();
    setNewSelectedFiles([]);
  };

  const mergeDisplayFiles = () => {
    return (
      <div className="flex flex-col gap-2 my-4">
        <div className="flex flex-col gap-2">
          <div
            className="flex items-center justify-between  bg-gray-50 hover:bg-gray-100 transition cursor-pointer
              border border-gray-200 rounded-md p-3 "
          >
            {selectedFile?.name}
            <button
              className="text-blue-500 cursor-pointer underline text-md"
              onClick={() => {
                clearSelectedFile();
                clearResults();
              }}
            >
              <IoMdTrash />
            </button>
          </div>
          {newSelectedFiles?.map((file: any) => (
            <div
              key={file.name}
              className="flex items-center justify-between  bg-gray-50 hover:bg-gray-100 transition cursor-pointer
              border border-gray-200 rounded-md p-3 "
            >
              {file.name}
              <button
                className="text-blue-500 cursor-pointer underline text-md"
                onClick={() => {
                  setNewSelectedFiles(
                    newSelectedFiles.filter((f) => f.name !== file.name)
                  );
                }}
              >
                <IoMdTrash />
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="relative flex min-h-screen bg-linear-to-b from-gray-50 to-white px-4 py-12">
      <div
        className={`flex-1 bg-white rounded-2xl shadow-lg border
           border-gray-100 transition-all duration-300 sm:p-10
        ${!isMobile && selectedFile ? "lg:mr-[380px]" : ""}
      `}
      >
        <div className="flex flex-col items-center px-4 sm:px-10">
          <div className="max-w-lg">
            <SelectFile
              heading="Organize PDF"
              description="Sort, add, delete, reorder, rotate pages and more."
            />
          </div>

          <div className="w-full flex justify-center">
            <InputField
              handleFileUpload={handleFileUpload}
              accept=".pdf"
              label="Select a file"
            />
          </div>

          {!selectedFile && (
            <p className="text-gray-500 mt-8">Upload a PDF to start</p>
          )}

          {selectedFile && <OrganizePreviewGrid />}
        </div>
      </div>

      {!isMobile && selectedFile && (
        <aside className="fixed top-0 right-0 h-full w-[380px] bg-white border-l shadow-lg z-50">
          <div className="p-6">
            <button className="absolute top-5 right-5" onClick={handleReset}>
              <IoMdClose />
            </button>

            <h2 className="text-xl font-semibold border-b pb-4">
              Organize PDF
            </h2>

            <div className="flex justify-between mt-6">
              <p className="font-semibold">Files</p>
              <button onClick={handleReset} className="text-blue-500 underline">
                Reset All
              </button>
            </div>

            {/* File list */}
            {mergeDisplayFiles()}

            <button
              className="bg-blue-500 text-white w-full py-2 rounded-md flex justify-center items-center"
              onClick={handleOrganizePdf}
            >
              Organize <IoMdArrowForward className="ml-2" />
            </button>
          </div>

          <div className="absolute top-1/3 -left-6 flex flex-col gap-3">
            <button
              onClick={handleAddMoreFiles}
              className="bg-blue-500 text-white w-10 h-10 rounded-full flex items-center justify-center shadow"
            >
              <IoMdAdd />
            </button>

            <button
              onClick={handleSortFiles}
              className="bg-blue-500 text-white w-10 h-10 rounded-full flex items-center justify-center shadow"
            >
              {isSorted ? (
                <FaSortNumericUp
                  onMouseEnter={() => setSortedText("Sort Descending")}
                />
              ) : (
                <FaSortNumericUpAlt
                  onMouseEnter={() => setSortedText("Sort Ascending")}
                />
              )}
            </button>
          </div>
        </aside>
      )}

      {isMobile && selectedFile && (
        <>
          <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-3">
            <button
              onClick={handleAddMoreFiles}
              className="bg-blue-500 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
            >
              <IoMdAdd />
            </button>

            <button
              onClick={handleSortFiles}
              className="bg-blue-500 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
            >
              {isSorted ? (
                <FaSortNumericUp
                  onMouseEnter={() => setSortedText("Sort Descending")}
                />
              ) : (
                <FaSortNumericUpAlt
                  onMouseEnter={() => setSortedText("Sort Ascending")}
                />
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Organize;
