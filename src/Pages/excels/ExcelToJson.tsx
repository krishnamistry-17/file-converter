import InputField from "../../components/InputField";
import PreviewFile from "../../components/PreviewFile";
import SelectFile from "../../components/SelectFile";
import useUploadData from "../../hooks/useUploadData";
import useFilesStore from "../../store/useSheetStore";

import { useState } from "react";

const ExcelToJson = () => {
  const setSelectedFile = useFilesStore((state) => state.setSelectedFile);
  const setPreviewFile = useFilesStore((state) => state.setPreviewFile);
  const { ConvertExcelToJson } = useUploadData();
  const [fileSelected, setFileSelected] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

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
        heading="Convert Excel to Json"
        description="Convert a Excel file to a Json file. This tool will convert a Excel file to a Json file."
      />
      <div className="w-full flex items-center justify-center">
        <InputField
          handleFileUpload={handleFileUpload}
          accept=".xlsx"
          label="Select a file"
        />
      </div>
      <PreviewFile type=".json" />

      {fileSelected && (
        <div className="my-4">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
            onClick={() => ConvertExcelToJson()}
          >
            Download Json
          </button>
        </div>
      )}
    </div>
  );
};

export default ExcelToJson;
