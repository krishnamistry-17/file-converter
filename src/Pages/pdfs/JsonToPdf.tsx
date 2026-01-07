import InputField from "../../components/InputField";
import PreviewFile from "../../components/PreviewFile";
import SelectFile from "../../components/SelectFile";
import useFilesStore from "../../store/useSheetStore";
import useUploadData from "../../hooks/useUploadData";
import { useState } from "react";

const JsonToPdf = () => {
  const setSelectedFile = useFilesStore((state) => state.setSelectedFile);
  const setPreviewFile = useFilesStore((state) => state.setPreviewFile);
  const { ConvertJsonToPdf } = useUploadData();
  const [fileSelected, setFileSelected] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    console.log(file, "file");
    if (!file) {
      alert("Please select a file");
      return;
    }
    setSelectedFile(file as any);
    setPreviewFile(URL.createObjectURL(file as File) as string);
    e.target.value = "";
    setFileSelected(true);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <SelectFile
        heading="Convert JSON to PDF"
        description="Convert a JSON file to a PDF file. This tool will convert a JSON file to a PDF file."
      />
      <div className="w-full flex items-center justify-center">
        <InputField
          handleFileUpload={handleFileUpload}
          accept=".json"
          label="Select a file"
        />
      </div>
      <PreviewFile />

      {fileSelected && (
        <div className="my-4">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
            onClick={ConvertJsonToPdf}
          >
            Download PDF
          </button>
        </div>
      )}
    </div>
  );
};

export default JsonToPdf;
