import useFilesStore from "../../store/useSheetStore";
import { useState } from "react";
import PdfFile from "../../components/layout/PdfFile";
import api from "../../utils/axios";
import { API_ROUTES } from "../../constance/apiConstance";

const ExcelToPdf = () => {
  const setSelectedFile = useFilesStore((state) => state.setSelectedFile);
  const setDownloadFilePreview = useFilesStore((state) => state.setDownloadFilePreview);

  const clearSelectedFile = useFilesStore((state) => state.clearSelectedFile);
  const [file, setFile] = useState<File | null>(null);
  const [fileSelected, setFileSelected] = useState(false);
  const [previewFileDesign, setPreviewFileDesign] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      alert("Please select a file");
      return;
    }
    setSelectedFile(file as any);
    setPreviewFileDesign(URL.createObjectURL(file as File));
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

      const data = await response.data;

      if (!data.downloadUrl) {
        alert("Conversion failed!");
        return;
      }
      setDownloadFilePreview(data.previewUrl);
      const a = document.createElement("a");
      a.href = data.downloadUrl;
      a.download = data.fileName;
      a.click();
      URL.revokeObjectURL(data.downloadUrl);
      alert("Conversion successful!");
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
        previewFileDesign={previewFileDesign}
      />
    </>
  );
};

export default ExcelToPdf;
