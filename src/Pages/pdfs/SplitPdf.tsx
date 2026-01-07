import SelectFile from "../../components/SelectFile";
import InputField from "../../components/InputField";
import useUploadData from "../../hooks/useUploadData";
import useFilesStore from "../../store/useSheetStore";
import { useState } from "react";

const SplitPdf = () => {
  const setSelectedFile = useFilesStore((state) => state.setSelectedFile);
  const setPreviewFile = useFilesStore((state) => state.setPreviewFile);
  const { SplitPdf } = useUploadData();
  const [fileSelected, setFileSelected] = useState(false);
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file as any);
    setPreviewFile(URL.createObjectURL(file as File));
    e.target.value = "";
    setFileSelected(true);
  };
  return (
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
    </div>
  );
};

export default SplitPdf;
