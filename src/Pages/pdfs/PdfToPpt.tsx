import useFilesStore from "../../store/useSheetStore";
import { useState } from "react";
import api from "../../utils/axios";
import PdfFile from "../../components/layout/PdfFile";
import { API_ROUTES } from "../../constance/apiConstance";

const PdfToPpt = () => {
  const setSelectedFile = useFilesStore((state) => state.setSelectedFile);
  const clearSelectedFile = useFilesStore((state) => state.clearSelectedFile);
  const setPreviewFile = useFilesStore((state) => state.setPreviewFile);
  const setResults = useFilesStore((state) => state.setResults);
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
    setResults([{ url: URL.createObjectURL(file as File) as string }]);
    e.target.value = "";
    setFileSelected(true);
  };

  const handleUpload = async () => {
    if (!file) return alert("Select a PDF file first");

    const formData = new FormData();
    formData.append("pdf", file);

    try {
      const response = await api.post(API_ROUTES.PDFS.PDF_TO_PPT, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const pptUrl = response.data.url;
      window.open(pptUrl, "_blank");

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
        heading="Convert PDF to Ppt"
        para="Convert a PDF file to a Ppt file. This tool will convert a PDF file to a Ppt file."
        onFileUpload={handleFileUpload}
        fileSelected={fileSelected}
        handleConvert={handleConvert}
        PreviewFileType="pptx"
        accept=".pdf"
        label="Select a file"
        btnText="Download Ppt"
      />
    </>
  );
};

export default PdfToPpt;
