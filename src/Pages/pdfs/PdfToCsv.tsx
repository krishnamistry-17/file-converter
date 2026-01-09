import useFilesStore from "../../store/useSheetStore";
import useUploadData from "../../hooks/useUploadData";
import { useState } from "react";
import PdfFile from "../../components/layout/PdfFile";

const PdfToCsv = () => {
  const setSelectedFile = useFilesStore((state) => state.setSelectedFile);
  const setPreviewFile = useFilesStore((state) => state.setPreviewFile);
  const { convertPdfToCsv } = useUploadData();
  const selectedFile = useFilesStore((state) => state.selectedFile);
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
    await convertPdfToCsv(selectedFile as File);
  };

  return (
    <>
      <PdfFile
        heading="Convert PDF to Csv"
        para="Convert a PDF file to a Csv file. This tool will convert a PDF file to a Csv file."
        onFileUpload={handleFileUpload}
        fileSelected={fileSelected}
        handleConvert={handleConvert}
        PreviewFileType="csv"
        accept=".pdf"
        label="Select a file"
        btnText="Download Csv"
      />
    </>
  );
};

export default PdfToCsv;
