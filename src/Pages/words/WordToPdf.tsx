import useFilesStore from "../../store/useSheetStore";
import useUploadData from "../../hooks/useUploadData";
import { useState } from "react";
import PdfFile from "../../components/layout/PdfFile";

const WordToPdf = () => {
  const setSelectedFile = useFilesStore((state) => state.setSelectedFile);
  const setPreviewFile = useFilesStore((state) => state.setPreviewFile);
  const clearSelectedFile = useFilesStore((state) => state.clearSelectedFile);
  const { ConvertWordToPdf } = useUploadData();

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
    await ConvertWordToPdf();
    clearSelectedFile();
  };

  return (
    <>
      <PdfFile
        heading="Convert Word to Pdf"
        para="Convert a Word file to a Pdf file. This tool will convert a Word file to a Pdf file."
        onFileUpload={handleFileUpload}
        fileSelected={fileSelected}
        handleConvert={handleConvert}
        PreviewFileType="pdf"
        accept=".docx"
        label="Select a file"
        btnText="Download Pdf"
      />
    </>
  );
};

export default WordToPdf;
