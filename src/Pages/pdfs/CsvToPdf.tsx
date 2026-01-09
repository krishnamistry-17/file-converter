import useFilesStore from "../../store/useSheetStore";
import useUploadData from "../../hooks/useUploadData";
import { useState } from "react";
import PdfFile from "../../components/layout/PdfFile";

const CsvToPdf = () => {
  const setSelectedFile = useFilesStore((state) => state.setSelectedFile);
  const setPreviewFile = useFilesStore((state) => state.setPreviewFile);
  const { convertCsvToPdf } = useUploadData();
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
    await convertCsvToPdf(selectedFile as File);
  };

  return (
    <>
      <PdfFile
        heading="Convert Csv to PDF"
        para="Convert a Csv file to a PDF file. This tool will convert a Csv file to a PDF file."
        onFileUpload={handleFileUpload}
        fileSelected={fileSelected}
        handleConvert={handleConvert}
        PreviewFileType="pdf"
        accept=".csv"
        label="Select a file"
        btnText="Download PDF"
      />
    </>
  );
};

export default CsvToPdf;
