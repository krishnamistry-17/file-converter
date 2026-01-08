import SelectFile from "../../components/SelectFile";
import InputField from "../../components/InputField";
import useFilesStore from "../../store/useSheetStore";
import { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import Range from "../../components/split/Range";
import useSplitStore from "../../store/useSplitStore";
import PreviewFile from "../../components/PreviewFile";
import SplitPreviewGrid from "../../components/split/SplitPreviewGrid";
import Pages from "../../components/split/Pages";
import Size from "../../components/split/Size";
import { PDFDocument } from "pdf-lib";

const SplitPdf = () => {
  const selectedFile = useFilesStore((state) => state.selectedFile);
  const setSelectedFile = useFilesStore((state) => state.setSelectedFile);
  const clearResults = useSplitStore((state) => state.clearResults);
  const setPreviewFile = useFilesStore((state) => state.setPreviewFile);
  const results = useSplitStore((state) => state.results);
  const [fileSelected, setFileSelected] = useState(false);
  const splitRangeType = useSplitStore((state) => state.splitRangeType);
  const setTotalPages = useSplitStore((s) => s.setTotalPages);

  const setSplitRangeType = useSplitStore((state) => state.setSplitRangeType);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const buffer = await file.arrayBuffer();
    const pdf = await PDFDocument.load(buffer);

    setSelectedFile(file);
    setPreviewFile(URL.createObjectURL(file));
    setTotalPages(pdf.getPageCount());
    setFileSelected(true);
  };

  useEffect(() => {
    if (!selectedFile) {
      clearResults();
      setFileSelected(false);
    }
  }, [selectedFile, clearResults]);

  return (
    <div className=" relative flex">
      <div
        className={` flex-1 transition-all duration-300
        ${fileSelected ? "md:mr-[320px]" : ""}
        `}
      >
        <div className="flex flex-col items-center justify-center w-full">
          <SelectFile
            heading="Split PDF"
            description="Split a PDF file into multiple pages."
          />
          <div className="w-full flex items-center justify-center">
            <InputField
              handleFileUpload={handleFileUpload}
              accept=".pdf"
              label="Select a file"
            />
          </div>

          {!selectedFile && (
            <p className="text-gray-500 mt-8">Upload a PDF to start</p>
          )}

          {selectedFile && results.length === 0 && <PreviewFile type="split" />}

          {selectedFile && results.length > 0 && <SplitPreviewGrid />}
        </div>
      </div>

      <aside
        className={` fixed top-[11%]  right-0 h-full w-full md:w-[380px] z-50
          bg-white  shadow-lg border-l border-gray-200
          transform transition-transform duration-300
          ${fileSelected ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <div className="p-6">
          <button
            className="absolute top-5 right-5"
            onClick={() => setFileSelected(false)}
          >
            <IoMdClose onClick={() => setFileSelected(false)} />
          </button>
          <h2 className="text-lg font-semibold mb-4">Split PDF</h2>
          <div className=" space-y-2">
            <div className="flex items-center justify-between">
              <>
                {["Range", "Pages", "Size"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => {
                      setSplitRangeType(tab as "Range" | "Pages" | "Size");
                      clearResults();
                    }}
                    className={`
                      ${
                        splitRangeType === tab
                          ? "bg-black text-white"
                          : "bg-gray-200 text-gray-800"
                      }
                      px-6 py-2 rounded-md
                    `}
                  >
                    {tab}
                  </button>
                ))}
              </>
            </div>

            {splitRangeType === "Range" && <Range />}
            {splitRangeType === "Pages" && <Pages />}
            {splitRangeType === "Size" && <Size />}
          </div>
        </div>
      </aside>
    </div>
  );
};

export default SplitPdf;
