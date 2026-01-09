import InputField from "../../components/InputField";
import PreviewFile from "../../components/PreviewFile";
import SelectFile from "../../components/SelectFile";
import useFilesStore from "../../store/useSheetStore";
import { useState } from "react";
import api from "../../utils/axios";
import { saveAs } from "file-saver";
import axios from "axios";

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

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <SelectFile
        heading="Convert PDF to Ppt"
        description="Convert a PDF file to a Ppt file. This tool will convert a PDF file to a Ppt file."
      />
      <div className="w-full flex items-center justify-center">
        <InputField
          handleFileUpload={handleFileUpload}
          accept=".pdf"
          label="Select a file"
        />
      </div>
      <PreviewFile type=".pptx" />

      {fileSelected && (
        <div className="my-4">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
            onClick={handleUpload}
          >
            Download Ppt
          </button>
        </div>
      )}
    </div>
  );
};

export default PdfToPpt;
