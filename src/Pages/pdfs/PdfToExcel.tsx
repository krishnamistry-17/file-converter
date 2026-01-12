import PdfFile from "../../components/layout/PdfFile";
import useUploadData from "../../hooks/useUploadData";
import useFilesStore from "../../store/useSheetStore";

import { useState } from "react";

const PdftoExcel = () => {
  const setSelectedFile = useFilesStore((state) => state.setSelectedFile);
  const setPreviewFile = useFilesStore((state) => state.setPreviewFile);
  const clearSelectedFile = useFilesStore((state) => state.clearSelectedFile);
  const { ConvertPdfToExcel } = useUploadData();
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
    await ConvertPdfToExcel();
    clearSelectedFile();
  };

  return (
    <>
      <PdfFile
        heading="Convert PDF to Excel"
        para="Convert a PDF file to a Excel file. This tool will convert a PDF file to a Excel file."
        onFileUpload={handleFileUpload}
        fileSelected={fileSelected}
        handleConvert={handleConvert}
        PreviewFileType="xlsx"
        accept=".pdf"
        label="Select a file"
        btnText="Download Excel"
      />
    </>
  );
};

export default PdftoExcel;
