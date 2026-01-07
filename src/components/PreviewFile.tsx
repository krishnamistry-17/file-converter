import getFileType from "../constance/FileType";
import useFilesStore from "../store/useSheetStore";
import { FaFileExcel, FaFilePowerpoint, FaFileWord } from "react-icons/fa";


const PreviewFile = ({ type }: { type: "split" | "merge" | "compress" }) => {
  const selectedFile = useFilesStore((state) => state.selectedFile);
  const previewFile = useFilesStore((state) => state.previewFile);

  return (
    <div>
      <div className="w-full flex flex-col gap-3 items-center justify-center">
        {previewFile && selectedFile && (
          <div className="max-w-md my-4 flex flex-col items-center gap-2">
            {(() => {
              const type = getFileType(selectedFile as File);

              // PDF
              if (type === ".pdf") {
                return (
                  <iframe
                    src={previewFile}
                    title="PDF Preview"
                    className="w-full h-80 rounded border"
                  />
                );
              }

              // Image
              if (type === ".jpg" || type === ".png" || type === ".jpeg") {
                return (
                  <img
                    src={previewFile}
                    alt="Image Preview"
                    className="max-h-80 object-contain rounded border"
                  />
                );
              }

              // Text (CSV / JSON)
              if (type === ".csv" || type === ".json") {
                return <p className="text-gray-500">Preview not available</p>;
              }

              // Word / Excel / PPT
              if (type === ".doc" || type === ".xlsx" || type === ".ppt") {
                return (
                  <div className="flex flex-col items-center text-gray-600 py-6">
                    {type === ".doc" && <FaFileWord size={48} />}
                    {type === ".xlsx" && <FaFileExcel size={48} />}
                    {type === ".ppt" && <FaFilePowerpoint size={48} />}
                    <p className="mt-2 text-sm">
                      {selectedFile.name.split(".")[0]}
                    </p>
                    <p className="text-xs">Preview not available</p>
                  </div>
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
  );
};

export default PreviewFile;
