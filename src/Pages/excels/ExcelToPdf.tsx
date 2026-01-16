import useFilesStore from "../../store/useSheetStore";
import { useState } from "react";
import PdfFile from "../../components/layout/PdfFile";
import api from "../../utils/axios";
import { API_ROUTES } from "../../constance/apiConstance";

const ExcelToPdf = () => {
  const setSelectedFile = useFilesStore((state) => state.setSelectedFile);
  const setPreviewFile = useFilesStore((state) => state.setPreviewFile);
  const clearSelectedFile = useFilesStore((state) => state.clearSelectedFile);
  const [file, setFile] = useState<File | null>(null);
  const [fileSelected, setFileSelected] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      alert("Please select a file");
      return;
    }
    setSelectedFile(file as any);
    setPreviewFile(URL.createObjectURL(file as File) as string);
    setFile(file as any);
    e.target.value = "";
    setFileSelected(true);
  };

  const handleUpload = async () => {
    if (!file) return alert("Select a Excel file first");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await api.post(API_ROUTES.EXCEL.EXCEL_TO_PDF, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const pdfUrl = response.data.url;
      const link = document.createElement("a");
      link.href = pdfUrl;
      link.download = "converted.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      console.log("Download triggered successfully!");
    } catch (error) {
      console.error(error);
      alert("Conversion failed!");
    }
  };

  const handleConvert = async () => {
    await handleUpload();
    clearSelectedFile();
  };

  return (
    <>
      <PdfFile
        heading="Convert Excel to Pdf"
        para="Convert a Excel file to a Pdf file. This tool will convert a Excel file to a Pdf file."
        onFileUpload={handleFileUpload}
        fileSelected={fileSelected}
        handleConvert={handleConvert}
        PreviewFileType="pdf"
        accept=".xlsx"
        label="Select a file"
        btnText="Download Pdf"
      />
    </>
  );
};

export default ExcelToPdf;
