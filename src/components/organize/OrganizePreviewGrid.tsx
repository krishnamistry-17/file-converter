import { FaRotate } from "react-icons/fa6";
import { MdClose } from "react-icons/md";
import { useOrganizeStore } from "../../store/useOrganizeStore";

type pageResult = {
  name: string;
  blob: Blob;
  url: string;
  pages: number;
  rotation: number;
};

const OrganizePreviewGrid = () => {
  const results = useOrganizeStore((s) => s.results);
  const sortedResults = useOrganizeStore((s) => s.sortedResults);
  const setResults = useOrganizeStore((s) => s.setResults);
  const setSortedResults = useOrganizeStore((s) => s.setSortedResults);
  console.log(sortedResults);
  const showResults = sortedResults.length > 0 ? sortedResults : results;

  const handleRotate = (index: number) => {
    const update = (list: pageResult[]) =>
      list.map((item, i) =>
        i === index
          ? { ...item, rotation: ((item.rotation ?? 0) + 90) % 360 }
          : item
      );

    setResults(update(results));
    if (sortedResults.length) {
      setSortedResults(update(sortedResults));
    }
  };

  const handleRemove = (index: number) => {
    const remove = (list: pageResult[]) => list.filter((_, i) => i !== index);

    setResults(remove(results));
    if (sortedResults.length) {
      setSortedResults(remove(sortedResults));
    }
  };

  if (!showResults.length) {
    return (
      <p className="text-gray-500 mt-6 text-center">No pages to display</p>
    );
  }

  return (
    <div className="my-6 w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {showResults.map((file: pageResult, index: number) => (
          <div
            key={`${file.name}-${index}`}
            className="bg-white rounded-xl shadow-md p-4 relative"
          >
            {/* PDF PREVIEW */}
            <iframe
              src={file.url}
              title={file.name}
              className="w-full h-72 border rounded transition-transform duration-300"
              style={{
                transform: `rotate(${file.rotation}deg)`,
              }}
            />

            {/* INFO */}
            <div className="mt-3">
              <p className="font-medium truncate">{file.name}</p>
              <p className="text-sm text-gray-500">Page {file.pages}</p>
            </div>

            {/* ACTIONS */}
            <div className="absolute top-2 right-2 flex gap-2">
              <button
                onClick={() => handleRotate(index)}
                className="bg-white p-2 rounded shadow hover:bg-gray-100"
                title="Rotate"
              >
                <FaRotate />
              </button>

              <button
                onClick={() => handleRemove(index)}
                className="bg-white p-2 rounded shadow hover:bg-gray-100"
                title="Remove"
              >
                <MdClose />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrganizePreviewGrid;
