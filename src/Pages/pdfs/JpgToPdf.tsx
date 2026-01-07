import InputField from "../../components/InputField";
import PreviewFile from "../../components/PreviewFile";
import SelectFile from "../../components/SelectFile";
import useFilesStore from "../../store/useSheetStore";
import useUploadData from "../../hooks/useUploadData";
import { useState } from "react";

const JpgToPdf = () => {
  const setSelectedFile = useFilesStore((state) => state.setSelectedFile);
  const setPreviewFile = useFilesStore((state) => state.setPreviewFile);
  const { ConvertJpgToPdf } = useUploadData();
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
        heading="Convert Jpg to Pdf"
        description="Convert a Jpg file to a Pdf file. This tool will convert a Jpg file to a Pdf file."
      />
      <div className="w-full flex items-center justify-center">
        <InputField
          handleFileUpload={handleFileUpload}
          accept=".jpg,.jpeg,.png"
          label="Select a file"
        />
      </div>
      <PreviewFile />

      {fileSelected && (
        <div className="my-4">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
            onClick={ConvertJpgToPdf}
          >
            Download Pdf
          </button>
        </div>
      )}
    </div>
  );
};

export default JpgToPdf;
