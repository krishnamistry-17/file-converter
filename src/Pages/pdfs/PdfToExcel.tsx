import PdfFile from "../../components/layout/PdfFile";
import useFilesStore from "../../store/useSheetStore";

import { useState } from "react";
import api from "../../utils/axios";
import { API_ROUTES } from "../../constance/apiConstance";

const PdftoExcel = () => {
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
    setFile(file as any);
    setPreviewFile(URL.createObjectURL(file as File) as string);
    e.target.value = "";
    setFileSelected(true);
  };

  const handleUpload = async () => {
    if (!file) return alert("Select a PDF file first");

    const formData = new FormData();
    formData.append("pdf", file);

    try {
      const response = await api.post(API_ROUTES.PDFS.PDF_TO_EXCEL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(response.data);

      const excelUrl = response.data.url;
      console.log(excelUrl);
      window.open(excelUrl, "_blank");

      alert(" Conversion successful!");
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
