import getFileType from "../constance/FileType";
import useFilesStore from "../store/useSheetStore";
import { useEffect, useState } from "react";
import useClearOnTabChange from "../hooks/useClearOnTabChnage";
import * as XLSX from "xlsx";
import { useLocation } from "react-router-dom";

export const CsvPreview = ({ file }: { file: File }) => {
  const [content, setContent] = useState<string>("");

  useEffect(() => {
    let cancelled = false;

    file.text().then((text) => {
      if (!cancelled) {
        setContent(text.split("\n").slice(0, 5).join("\n"));
      }
    });

    return () => {
      cancelled = true;
    };
  }, [file]);

  return (
    <pre className="w-full max-h-80 overflow-auto bg-gray-100 p-2 rounded text-xs">
      {content}
    </pre>
  );
};

export const JsonPreview = ({ file }: { file: File }) => {
  const [content, setContent] = useState<string>("");

  useEffect(() => {
    let cancelled = false;

    file.text().then((text) => {
      if (!cancelled) {
        try {
          const json = JSON.parse(text);
          setContent(JSON.stringify(json, null, 2));
        } catch {
          setContent("Invalid JSON file");
        }
      }
    });

    return () => {
      cancelled = true;
    };
  }, [file]);

  return (
    <pre className="w-full max-h-80 overflow-auto bg-gray-100 p-2 rounded text-xs">
      {content}
    </pre>
  );
};

export const ExcelPreview = ({ file }: { file: File }) => {
  const [data, setData] = useState<any[][]>([]);

  useEffect(() => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const buffer = e.target?.result;
      if (buffer) {
        const workbook = XLSX.read(buffer, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        setData(jsonData.slice(0, 10) as any[][]);
      }
    };
    reader.readAsArrayBuffer(file);
  }, [file]);

  return (
    <div className="overflow-auto max-h-80 w-full">
      <table className="border-collapse border border-gray-300 w-full text-xs">
        <tbody>
          {data.map((row, i) => (
            <tr key={i}>
              {row.map((cell: any, j: number) => (
                <td key={j} className="border border-gray-300 px-1 py-0.5">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export const WordPreview = () => {
  return (
    <pre className="w-full max-h-80 overflow-auto bg-gray-100 p-2 rounded text-xs">
      No preview available for Word file
    </pre>
  );
};

const PreviewFile = ({
  type,
}: {
  type:
    | "pdf"
    | "json"
    | "csv"
    | "xlsx"
    | "pptx"
    | "doc"
    | "docx"
    | "html"
    | "xls";
}) => {
  const selectedFile = useFilesStore((state) => state.selectedFile);
  const previewFile = useFilesStore((state) => state.previewFile);
  const downloadFileUrl = useFilesStore((state) => state.downloadFileUrl);

  const clearSelectedFile = useFilesStore((state) => state.clearSelectedFile);

  useClearOnTabChange(clearSelectedFile);

  const location = useLocation();

  const showPptPreview = () => {
    if (location.pathname.includes("ppt-to-pdf")) {
      return (
        <>
          <p>Converted Pdf</p>
          <iframe
            src={downloadFileUrl || ""}
            title="Ppt Preview"
            className="w-full h-80 rounded border"
          />
        </>
      );
    }
  };

  useEffect(() => {
    clearSelectedFile();
  }, [location.pathname]);

  return (
    <div>
      <div className="w-full flex flex-col gap-3 items-center justify-center">
        <div>
          {previewFile && selectedFile && (
            <div className="max-w-md my-4 flex flex-col items-center gap-2">
              {(() => {
                const type = getFileType(selectedFile as File);

                // PDF
                if (type === "pdf") {
                  return (
                    <iframe
                      src={previewFile}
                      title="PDF Preview"
                      className="w-full h-80 rounded border"
                    />
                  );
                }

                // Image
                if (type === "jpg" || type === "png" || type === "jpeg") {
                  return (
                    <img
                      src={previewFile}
                      alt="Image Preview"
                      className="max-h-80 object-contain rounded border"
                    />
                  );
                }

                // json preview
                if (type === "json") {
                  return <JsonPreview file={selectedFile as File} />;
                }

                //csv preview
                if (type === "csv") {
                  return <CsvPreview file={selectedFile as File} />;
                }

                //excel preview
                if (type === "xlsx") {
                  return <ExcelPreview file={selectedFile as File} />;
                }

                // word preview
                if (type === "doc" || type === "docx") {
                  return <WordPreview />;
                }

                if (location.pathname.includes("ppt-to-pdf")) {
                  return showPptPreview();
                }

                // Html
                if (type === "html") {
                  return (
                    <>
                      <iframe
                        src={previewFile}
                        title="Html Preview"
                        className="w-full h-80 rounded border"
                      />
                    </>
                  );
                }

                return (
                  <p className="text-gray-500">
                    {selectedFile
                      ? "Please select a file to preview"
                      : "No preview available"}
                  </p>
                );
              })()}

              <p className="text-sm text-gray-500">{selectedFile.name}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PreviewFile;
