import useFilesStore from "../store/useSheetStore";
import useUploadData from "../hooks/useUploadData";
import { useEffect, useState } from "react";
import Pagination from "./Pagination";
import Loader from "./Loader";

const TableView = () => {
  const files = useFilesStore((state) => state.files);
  const { ExportToExcel, ExportToCSV, ExportToJSON, ExportToPDF } =
    useUploadData();
  const fetchFiles = useFilesStore((state) => state.fetchFiles);
  const loading = useFilesStore((state) => state.loading);

  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;
  const totalPages = Math.ceil(files.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedFiles = files.slice(startIndex, endIndex);

  const onNext = () => {
    setCurrentPage(currentPage + 1);
  };
  const onPrevious = () => {
    setCurrentPage(currentPage - 1);
  };

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  return (
    <div className="p-6 w-full">
      <div className="flex flex-col md:flex-row justify-center items-center md:justify-between md:items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Product Table</h1>
        <div className="flex flex-col md:flex-row gap-2 items-center">
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition"
            onClick={ExportToExcel}
          >
            Export to Excel
          </button>
          <button
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition"
            onClick={ExportToCSV}
          >
            Export to CSV
          </button>
          <button
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition"
            onClick={ExportToJSON}
          >
            Export to JSON
          </button>
          <button
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md transition"
            onClick={ExportToPDF}
          >
            Export to PDF
          </button>
        </div>
      </div>

      {loading && <Loader />}

      <div className="overflow-x-auto rounded-lg shadow-md bg-white">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100 border-b border-gray-200">
            <tr className="text-left text-sm font-medium text-gray-600">
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Brand</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Rating</th>
              <th className="px-4 py-3">Photo</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-gray-700">
            {paginatedFiles.length > 0 ? (
              paginatedFiles?.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-2">{item?.id}</td>
                  <td className="px-4 py-2">{item?.title}</td>
                  <td className="px-4 py-2">{item?.brand}</td>
                  <td className="px-4 py-2">{item?.category}</td>
                  <td className="px-4 py-2">${item?.price}</td>
                  <td className="px-4 py-2">{item?.rating}</td>
                  <td className="px-4 py-2">
                    <img
                      src={item?.images?.[0] || ""}
                      alt={item?.title}
                      className="w-12 h-12 object-cover rounded-md"
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center text-gray-500">
                  No data found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onNext={onNext}
        onPrevious={onPrevious}
      />
    </div>
  );
};

export default TableView;
