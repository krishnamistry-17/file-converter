import InputField from "../../components/InputField";
import PreviewFile from "../../components/PreviewFile";
import SelectFile from "../../components/SelectFile";
import useUploadData from "../../hooks/useUploadData";
import useFilesStore from "../../store/useSheetStore";

import { useState } from "react";

const ExcelToCsv = () => {
  const setSelectedFile = useFilesStore((state) => state.setSelectedFile);
  const setPreviewFile = useFilesStore((state) => state.setPreviewFile);
  const { ConvertExcelToCsv } = useUploadData();
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
        heading="Convert Excel to Csv"
        description="Convert a Excel file to a Csv file. This tool will convert a Excel file to a Csv file."
      />
      <div className="w-full flex items-center justify-center">
        <InputField
          handleFileUpload={handleFileUpload}
          accept=".xlsx"
          label="Select a file"
        />
      </div>
      <PreviewFile type=".csv" />

      {fileSelected && (
        <div className="my-4">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
            onClick={() => ConvertExcelToCsv()}
          >
            Download Csv
          </button>
        </div>
      )}
    </div>
  );
};

export default ExcelToCsv;
