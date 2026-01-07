import InputField from "../../components/InputField";
import PreviewFile from "../../components/PreviewFile";
import SelectFile from "../../components/SelectFile";
import useFilesStore from "../../store/useSheetStore";
import useUploadData from "../../hooks/useUploadData";
import { useState } from "react";
import { compressPdfOptions } from "../../constance/ConvertOptions";
import { IoMdClose } from "react-icons/io";

const CompressPdf = () => {
  const setSelectedFile = useFilesStore((state) => state.setSelectedFile);
  const setPreviewFile = useFilesStore((state) => state.setPreviewFile);
  const { compressPdf } = useUploadData();

  const [fileSelected, setFileSelected] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string>("50%");

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file as any);
    setPreviewFile(URL.createObjectURL(file as File));
    e.target.value = "";
    setFileSelected(true);
  };

  return (
    <div className="relative flex min-h-screen ">
      <div
        className={`flex-1 transition-all duration-300 ${
          fileSelected ? "md:mr-[320px]" : ""
        }`}
      >
        <div className="flex flex-col items-center w-full">
          <SelectFile
            heading="Compress PDF"
            description="Compress a PDF file to reduce its size."
          />

          <div className="w-full flex justify-center">
            <InputField
              handleFileUpload={handleFileUpload}
              accept=".pdf"
              label="Select a file"
            />
          </div>

          <PreviewFile type="compress"/>
        </div>
      </div>

      <aside
        className={`
          fixed top-[11%] right-0 h-full w-full md:w-[320px] z-50
          bg-white  shadow-lg border-l border-gray-200
          transform transition-transform duration-300
          ${fileSelected ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <div className="p-6">
          <button className="absolute top-5 right-5">
            <IoMdClose onClick={() => setFileSelected(false)} />
          </button>
          <h2 className="text-lg font-semibold mb-4">Compression Level</h2>

          <div className="space-y-2">
            {compressPdfOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setSelectedSize(option.value)}
                className={`
                  w-full text-left px-4 py-2 rounded-md border
                  transition
                  ${
                    selectedSize === option.value
                      ? " bg-blue-400 text-white"
                      : "border-gray-200 hover:bg-gray-50"
                  }
                `}
              >
                <div>
                  <h3
                    className={`text-sm  font-semibold ${
                      selectedSize === option.value
                        ? "text-white"
                        : "text-black"
                    }`}
                  >
                    {option.label}
                  </h3>
                  {selectedSize === option.value && (
                    <p className="text-xs text-white">{option.description}</p>
                  )}
                </div>
              </button>
            ))}
          </div>

          <button
            onClick={compressPdf}
            className="mt-6 w-full bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 transition"
          >
            Download Compressed PDF
          </button>
        </div>
      </aside>
    </div>
  );
};

export default CompressPdf;
