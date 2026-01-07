import { useState } from "react";
import useUploadData from "../../hooks/useUploadData";
import useFilesStore from "../../store/useSheetStore";
import Loader from "../../components/Loader";

const MergePdfComponent = () => {
  const mergeFile1 = useFilesStore((state) => state.mergeFile1);
  const mergeFile2 = useFilesStore((state) => state.mergeFile2);

  const setMergeFile1 = useFilesStore((state) => state.setMergeFile1);
  const setMergeFile2 = useFilesStore((state) => state.setMergeFile2);

  const mergedPdfPreview = useFilesStore((state) => state.mergedPdfPreview);
  const mergedPdfbytes = useFilesStore((state) => state.mergedPdfbytes);

  const [pdfPreview1, setPdfPreview1] = useState<string | null>(null);
  const [pdfPreview2, setPdfPreview2] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { MergePdfs } = useUploadData();

  const handleFileUpload1 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setMergeFile1(file);
    setPdfPreview1(URL.createObjectURL(file as File));
  };

  const handleFileUpload2 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setMergeFile2(file);
    setPdfPreview2(URL.createObjectURL(file as File));
  };

  const handleMerge = async () => {
    setLoading(true);
    try {
      await MergePdfs();
    } catch (error) {
      console.error(error);
      alert("Failed to merge PDFs");
    } finally {
      setLoading(false);
    }
    setLoading(false);
  };

  const handleDownload = () => {
    if (!mergedPdfbytes) return;
    const blob = new Blob([new Uint8Array(mergedPdfbytes)], {
      type: "application/pdf",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "merged.pdf";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-[1000px] mx-auto my-6 p-4 flex flex-col items-center gap-6">
      <div className="flex gap-6 mb-2">
        <div className=" relative">
          <label
            htmlFor="pdf1"
            className="cursor-pointer bg-white border-2 border-dashed border-gray-500 
          rounded-md w-64 h-40 flex flex-col items-center justify-center 
          hover:bg-gray-50 transition"
          >
            <span className="text-gray-700 font-medium">Select PDF 1</span>
            <input
              id="pdf1"
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={handleFileUpload1}
            />
          </label>
          {pdfPreview1 && (
            <div className="absolute top-0 left-0 w-full h-full">
              <object
                data={pdfPreview1}
                title="PDF Preview1"
                className="w-64 h-40 object-cover"
              >
                <embed src={pdfPreview1} type="application/pdf" />
              </object>
              {mergeFile1 && (
                <div>
                  <p>{mergeFile1.name}</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className=" relative">
          <label
            htmlFor="pdf2"
            className="cursor-pointer bg-white border-2 border-dashed border-gray-500 
          rounded-md w-64 h-40 flex flex-col items-center justify-center 
          hover:bg-gray-50 transition"
          >
            <span className="text-gray-700 font-medium">Select PDF 2</span>
            <input
              id="pdf2"
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={handleFileUpload2}
            />
          </label>
          {pdfPreview2 && (
            <div className="absolute top-0 left-0 w-full h-full">
              <object
                data={pdfPreview2}
                title="PDF Preview2"
                className="w-64 h-40 object-cover"
              >
                <embed src={pdfPreview2} type="application/pdf" />
              </object>
              {mergeFile2 && (
                <div>
                  <p>{mergeFile2.name}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <button
        onClick={handleMerge}
        className="bg-blue-600 text-white my-3
         px-6 py-2 rounded-md hover:bg-blue-700 transition"
      >
        Merge PDFs
      </button>

      {mergedPdfPreview && !loading && (
        <div>
          <p className="text-lg font-bold py-2 text-center">
            Merged Pdf Preview
          </p>
          {loading && <Loader />}
          <object
            data={mergedPdfPreview}
            title="PDF Preview1"
            className=" w-full  h-full object-cover"
          >
            <embed src={mergedPdfPreview} type="application/pdf" />
          </object>
        </div>
      )}

      <button
        onClick={handleDownload}
        className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
      >
        Download Merged PDF
      </button>
    </div>
  );
};

export default MergePdfComponent;
