import InputField from "../InputField";
import PreviewFile from "../PreviewFile";

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
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
      <div className="max-w-3xl w-full bg-white shadow-md rounded-xl p-8 flex flex-col gap-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{heading}</h1>
          <p className="text-gray-600">{para}</p>
        </div>

        {/* File Upload */}
        <div className="flex justify-center">
          <InputField
            handleFileUpload={onFileUpload}
            accept={accept}
            label={label}
          />
        </div>

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
