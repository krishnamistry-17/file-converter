import useFilesStore from "../../store/useSheetStore";
import { useState } from "react";
import PdfFile from "../../components/layout/PdfFile";
import api from "../../utils/axios";

const PptToPdf = () => {
  const setSelectedFile = useFilesStore((state) => state.setSelectedFile);

  const setDownloadFileUrl = useFilesStore((state) => state.setDownloadFileUrl);
  const clearSelectedFile = useFilesStore((state) => state.clearSelectedFile);
  const downloadFileUrl = useFilesStore((state) => state.downloadFileUrl);
  const [fileSelected, setFileSelected] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return alert("Please select a file");

    setSelectedFile(file);
    setFile(file);
    setFileSelected(true);
    e.target.value = "";
  };

  const handleUpload = async () => {
    if (!file) return alert("Select a Ppt file first");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await api.post("/api/convert/ppt-to-pdf", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const data = await response.data;

      if (!data.url) {
        alert("Conversion failed!");
        return;
      }

      setDownloadFileUrl(data.url);
      window.open(data.url, "_blank");
    } catch (error) {
      console.error(error);
      alert("Download failed!");
    }
  };

  const handleDownload = async () => {
    if (!downloadFileUrl) return alert("No file to download");
    window.open(downloadFileUrl, "_blank");
  };

  const handleConvert = async () => {
    await handleUpload();
    await handleDownload();
    clearSelectedFile();
  };

  return (
    <>
      <PdfFile
        heading="Convert Ppt to Pdf"
        para="Convert a Ppt file to a Pdf file. This tool will convert a Ppt file to a Pdf file."
        onFileUpload={handleFileUpload}
        fileSelected={fileSelected}
        handleConvert={handleConvert}
        accept=".pptx"
        label="Select a file"
        btnText="Download Pdf"
        PreviewFileType="pptx"
      />
    </>
  );
};

export default PptToPdf;
