import Papa from "papaparse";
import * as XLSX from "xlsx";
import useFilesStore from "../store/useSheetStore";
import useUploadData from "../hooks/useUploadData";

const UploadData = () => {
  const { ExportToExcel, ExportToCSV, ExportToJSON, ExportToPDF } =
    useUploadData();
  const error = useFilesStore((state) => state.error);
  const setFiles = useFilesStore((state) => state.setFiles);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      alert("Please select a file");
      return;
    }

    const extension = file.name.split(".").pop()?.toLowerCase();
    if (!extension) {
      alert("Please select a valid file");
      console.warn("Selected file is not a valid", error);
      return;
    }
    //parse csv file
    if (extension === "csv") {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          setFiles(result.data as any[]);
        },
      });
    }

    //parse excel file
    if (extension === "xlsx" || extension === "xls") {
      const reader = new FileReader();

      reader.onload = (event) => {
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet);
        setFiles(json as any[]);
      };

      reader.readAsArrayBuffer(file);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-2 max-w-sm mx-auto my-4">
        <div className=" flex justify-center w-full">
          <label className="w-full max-w-sm cursor-pointer bg-gray-50 border border-gray-300 rounded-lg p-3 text-center hover:bg-gray-100 transition">
            <span className="text-gray-600">Select a file</span>
            <input
              type="file"
              accept=".csv,.xlsx,.xls,.json,.pdf,.jpg,.jpeg,.png,.ppt"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>

        <button
          onClick={ExportToExcel}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition"
        >
          Export to Excel
        </button>
        <button
          onClick={ExportToCSV}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition"
        >
          Export to CSV
        </button>
        <button
          onClick={ExportToJSON}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition"
        >
          Export to JSON
        </button>
        <button
          onClick={ExportToPDF}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md transition"
        >
          Export to PDF
        </button>
      </div>
    </>
  );
};

export default UploadData;
