import { useState } from "react";

import PreviewFile from "../PreviewFile";
import useFilesStore from "../../store/useSheetStore";
import UploadModal from "../UploadModal";
import { IoMdClose } from "react-icons/io";

interface PdfFileProps {
  heading: string;
  para: string;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fileSelected: boolean;
  handleConvert: () => void;
  PreviewFileType:
    | "pdf"
    | "json"
    | "csv"
    | "xlsx"
    | "pptx"
    | "doc"
    | "docx"
    | "html";
  accept: string;
  label: string;
  btnText: string;
}
const PdfFile = ({
  heading,
  para,
  onFileUpload,
  fileSelected,
  handleConvert,
  PreviewFileType,
  accept,
  label,
  btnText,
}: PdfFileProps) => {
  const [modalOpen, setModalOpen] = useState(false);

  const setSelectedFile = useFilesStore((state) => state.setSelectedFile);
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
      <div className="max-w-3xl w-full bg-white shadow-md rounded-xl p-8 flex flex-col gap-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{heading}</h1>
          <p className="text-gray-600">{para}</p>
        </div>

        {/* File Upload */}
        <button
          onClick={(e) => {
            e.preventDefault();
            setModalOpen(true);
            setSelectedFile(null);
          }}
          className=" cursor-pointer w-full max-w-sm mx-auto
         bg-gray-50 border border-gray-300 rounded-lg p-3 text-center hover:bg-gray-100 transition"
        >
          {label}
        </button>

        {/* Modal */}
        {modalOpen && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 ">
            <div className="bg-white p-8 rounded-lg w-full max-w-xl relative">
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                onClick={() => setModalOpen(false)}
              >
                <IoMdClose size={24} />
              </button>
              <UploadModal
                handleFileUpload={(e) => {
                  onFileUpload(e);
                  setModalOpen(false);
                }}
                accept={accept}
                label={label}
              />
            </div>
          </div>
        )}

        {/* File Preview */}
        <div className="flex justify-center">
          <PreviewFile type={PreviewFileType} />
        </div>

        {/* Download Button */}
        {fileSelected && (
          <div className="flex justify-center">
            <button
              className="bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 transition shadow-md"
              onClick={handleConvert}
            >
              {btnText}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PdfFile;
