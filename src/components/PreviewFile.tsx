import getFileType from "../constance/FileType";
import useFilesStore from "../store/useSheetStore";
import { FaFileExcel, FaFilePowerpoint, FaFileWord } from "react-icons/fa";

const PreviewFile = ({
  type,
}: {
  type: "pdf" | "json" | "csv" | "xlsx" | "pptx" | "doc" | "docx" | "html";
}) => {
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

              // Text (CSV / JSON)
              if (type === "csv" || type === "json") {
                return <p className="text-gray-500">Preview not available</p>;
              }

              // Word / Excel / PPT
              if (type === "doc" || type === "xlsx" || type === "ppt") {
                return (
                  <div className="flex flex-col items-center text-gray-600 py-6">
                    {type === "doc" && <FaFileWord size={48} />}
                    {type === "xlsx" && <FaFileExcel size={48} />}
                    {type === "ppt" && <FaFilePowerpoint size={48} />}
                    <p className="mt-2 text-sm">
                      {selectedFile.name.split(".")[0]}
                    </p>
                    <p className="text-xs">Preview not available</p>
                  </div>
                );
              }

              // Html
              if (type === "html") {
                return (
                  <iframe
                    src={previewFile}
                    title="Html Preview"
                    className="w-full h-80 rounded border"
                  />
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



{/*



// import InputField from "../InputField";
// import PreviewFile from "../PreviewFile";
// import useFilesStore from "../../store/useSheetStore";
// import UploadModal from "../UploadModal";
// import { useState } from "react";

// interface PdfFileProps {
//   heading: string;
//   para: string;
//   onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;

//   handleConvert: () => void;
//   PreviewFileType:
//     | "pdf"
//     | "json"
//     | "csv"
//     | "xlsx"
//     | "pptx"
//     | "doc"
//     | "docx"
//     | "html";
//   accept: string;
//   label: string;
//   btnText: string;
// }
// const PdfFile = ({
//   onFileUpload,
//   handleConvert,
// }: PdfFileProps) => {
//   const [modalOpen, setModalOpen] = useState(false);
//   const selectedFile = useFilesStore((state) => state.selectedFile);

//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
//       <div className="max-w-3xl w-full bg-white shadow-md rounded-xl p-8 flex flex-col gap-6">
//         <h1 className="text-3xl font-bold text-gray-800 mb-2">
//           Convert PDF to Word
//         </h1>
//         <p className="text-gray-600">
//           Convert a PDF file to a Word file. Drag & drop or select a file below.
//         </p>

//         {/* Upload Button */}
//         <button
//           onClick={() => setModalOpen(true)}
//           className="bg-gray-200 text-gray-700 font-semibold px-6 py-3 rounded-lg hover:bg-gray-300 transition"
//         >
//           {selectedFile ? selectedFile.name : "Select a PDF"}
//         </button>

//         {/* Modal */}
//         {modalOpen && (
//           <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
//             <div className="bg-white p-6 rounded-lg w-full max-w-md relative">
//               <button
//                 className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
//                 onClick={() => setModalOpen(false)}
//               >
//                 ✕
//               </button>
//               <UploadModal
//                 handleFileUpload={onFileUpload}
//                 accept=".pdf"
//                 label="Drag & drop or click to select PDF"
//               />
//             </div>
//           </div>
//         )}

//         {/* Preview */}
//         <div className="flex justify-center">
//           <PreviewFile type="pdf" />
//         </div>

//         {/* Convert Button */}
//         {selectedFile && (
//           <div className="flex justify-center">
//             <button
//               onClick={handleConvert}
//               className="bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 transition"
//             >
//               Download Word
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default PdfFile;

// import { FaFileWord, FaFileExcel, FaFilePowerpoint } from "react-icons/fa";
// import useFilesStore from "../store/useSheetStore";

// interface PreviewFileProps {
//   type: "pdf" | "docx" | "doc" | "xlsx" | "ppt" | "jpg" | "png";
// }

// const PreviewFile = ({ type }: PreviewFileProps) => {
//   const selectedFile = useFilesStore((state) => state.selectedFile);
//   const previewFile = useFilesStore((state) => state.previewFile);

//   if (!selectedFile || !previewFile)
//     return <p className="text-gray-500">No file selected</p>;

//   // PDF preview
//   if (type === "pdf")
//     return (
//       <iframe
//         src={previewFile}
//         title="PDF Preview"
//         className="w-full max-w-md h-80 rounded border"
//       />
//     );

//   // Images
//   if (["jpg", "png"].includes(type))
//     return (
//       <img
//         src={previewFile}
//         alt="Preview"
//         className="max-h-80 object-contain rounded border"
//       />
//     );

//   // Office files
//   return (
//     <div className="flex flex-col items-center text-gray-600 py-6">
//       {type === "doc" || type === "docx" ? <FaFileWord size={48} /> : null}
//       {type === "xlsx" ? <FaFileExcel size={48} /> : null}
//       {type === "ppt" ? <FaFilePowerpoint size={48} /> : null}
//       <p className="mt-2 text-sm">{selectedFile.name}</p>
//       <p className="text-xs text-gray-500">Preview not available</p>
//     </div>
//   );
// };

// export default PreviewFile;


// import { useState } from "react";
// import UploadModal from "./UploadModal";
// import { IoMdClose } from "react-icons/io";

// interface InputFieldProps {
//   handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
//   accept: string;
//   label: string;
// }

// const InputField = ({
//   handleFileUpload,
//   accept = ".csv,.xlsx,.xls,.json,.pdf,.jpg,.jpeg,.png,.ppt,.doc",
//   label = "Select a file",
// }: InputFieldProps) => {
//   const [modalOpen, setModalOpen] = useState(false);

//   const toggleModal = () => {
//     setModalOpen(!modalOpen);
//   };

//   return (
//     <>
//       <div
//         onClick={toggleModal}
//         className="cursor-pointer w-full max-w-sm mx-auto
//          bg-gray-50 border border-gray-300 rounded-lg p-3 text-center hover:bg-gray-100 transition"
//       >
//         <p className="text-gray-600">{label}</p>
//       </div>

//       {modalOpen && (
//         <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded-lg relative w-full max-w-md">
//             <button
//               onClick={toggleModal}
//               className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
//             >
//               <IoMdClose className="w-5 h-5" />
//             </button>

//             <UploadModal
//               handleFileUpload={(e) => {
//                 handleFileUpload(e);
//                 toggleModal();
//               }}
//               accept={accept}
//               label={label}
//             />
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default InputField;
 