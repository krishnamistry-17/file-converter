import useFilesStore from "../../store/useSheetStore";
import useUploadData from "../../hooks/useUploadData";
import { useState } from "react";
import PdfFile from "../../components/layout/PdfFile";

const PdfToJson = () => {
  const setSelectedFile = useFilesStore((state) => state.setSelectedFile);
  const setPreviewFile = useFilesStore((state) => state.setPreviewFile);
  const selectedFile = useFilesStore((state) => state.selectedFile);
  const clearSelectedFile = useFilesStore((state) => state.clearSelectedFile);
  const { convertPdfToJson } = useUploadData();
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

  const handleConvert = async () => {
    const json = await convertPdfToJson(selectedFile as File);

    const blob = new Blob([JSON.stringify(json, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);

    window.open(url);
    clearSelectedFile();
  };

  return (
    <>
      <PdfFile
        heading="Convert PDF to JSON"
        para="Convert a PDF file to a JSON file. This tool will convert a PDF file to a JSON file."
        onFileUpload={handleFileUpload}
        fileSelected={fileSelected}
        handleConvert={handleConvert}
        PreviewFileType="json"
        accept=".pdf"
        label="Select a file"
        btnText="Download JSON"
      />
    </>
  );
};

export default PdfToJson;
