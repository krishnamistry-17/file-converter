import useFilesStore from "../../store/useSheetStore";
import { useState } from "react";
import api from "../../utils/axios";
import { saveAs } from "file-saver";
import axios from "axios";
import PdfFile from "../../components/layout/PdfFile";

const PdfToPpt = () => {
  const setSelectedFile = useFilesStore((state) => state.setSelectedFile);

  const setPreviewFile = useFilesStore((state) => state.setPreviewFile);

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
      const response = await api.post("/api/ai/pdf-to-ppt", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const pptUrl = response.data.url;
      console.log(pptUrl, "pptUrl-------");

      if (!pptUrl) {
        alert("Conversion failed: no URL returned");
        return;
      }

      // window.open(pptUrl, "_blank");

      const fileResponse = await axios.get(pptUrl, {
        responseType: "blob",
      });
      console.log(fileResponse.data, "fileResponse.data-------");

      const blob = new Blob([fileResponse.data], {
        type: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      });

      saveAs(blob, "converted.pptx");
      alert("Conversion successful!");
    } catch (err: any) {
      console.error(err.response || err.message);
      alert(
        "Conversion failed: " + (err.response?.data?.message || err.message)
      );
    }
  };

  const handleConvert = async () => {
    await handleUpload();
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
