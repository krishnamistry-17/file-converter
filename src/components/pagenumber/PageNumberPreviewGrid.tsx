import { usePdfPageNumbersStore } from "../../store/usePdfPageNumbers";

const PageNumberPreviewGrid = () => {
  const results = usePdfPageNumbersStore((s) => s.results);

  return (
    <div className="my-6 w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
        {results.map((file, index) => (
          <div
            key={`${file.fileName}-${index}`}
            className="bg-white max-w-96 mt-3 xl rounded-xl shadow-md p-4 relative z-40 overflow-x-auto "
          >
            <iframe
              src={file.url}
              title={file.fileName}
              className="w-full h-72 border rounded"
              style={{ transform: `rotate(${file.rotation}deg)` }}
            />

            <div className="mt-3">
              <p className="font-medium truncate">{file.fileName}</p>
              <p className="text-sm text-gray-500">Page {file.pages}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PageNumberPreviewGrid;
