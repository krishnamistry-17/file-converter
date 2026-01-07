import useSplitStore from "../../store/useSplitStore";
import { useEffect } from "react";

const SplitPreviewGrid = () => {
  const results = useSplitStore((s) => s.results);
  const clearResults = useSplitStore((state) => state.clearResults);
  if (!results.length) return null
  console.log(results, "results");

  useEffect(() => {
    if (!results.length) {
      clearResults();
    }
  }, [results]);

  return (
    <div className="my-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {results.map((file, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-md p-4 flex flex-col"
          >
            <div className="flex-1">
              <iframe
                src={file.url}
                title="PDF Preview"
                className="w-full h-80 rounded border"
              ></iframe>
              <p className="font-medium">{file.name}</p>
              <p className="text-sm text-gray-500">Pages {file.pages}</p>
            </div>

            <a
              href={file.url}
              download={file.name}
              className="mt-4 text-center bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
            >
              Download
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SplitPreviewGrid;
