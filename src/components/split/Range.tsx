import { useState } from "react";
import useUploadData from "../../hooks/useUploadData";
import useFilesStore from "../../store/useSheetStore";
import useSplitStore from "../../store/useSplitStore";

type SplitRange = {
  from: number;
  to: number;
};

const Range = () => {
  const selectedFile = useFilesStore((state) => state.selectedFile);
  const { splitPdfByRange, splitPdfByFixedRange } = useUploadData();
  const [activeRange, setActiveRange] = useState<SplitRange[]>([
    { from: 1, to: 10 },
  ]);
  const [activeMode, setActiveMode] = useState<"custome" | "fixed">("custome");
  const [pageRange, setPageRange] = useState<number>();

  const setResults = useSplitStore((state) => state.setResults);
  const handleRangeChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
    type: "from" | "to"
  ) => {
    const newRange = [...activeRange] as SplitRange[];
    newRange[index][type] = parseInt(e.target.value);
    setActiveRange(newRange);
  };
  const handleSplit = async () => {
    if (!selectedFile) return;

    // CUSTOM RANGE (from-to)
    if (activeMode === "custome") {
      const results = await splitPdfByRange(selectedFile as File, activeRange);

      setResults(results as any);
    }

    // FIXED RANGE (every N pages)
    if (activeMode === "fixed") {
      if (!pageRange || pageRange < 1) {
        alert("Please enter a valid page range");
        return;
      }

      const results = await splitPdfByFixedRange(
        selectedFile as File,
        pageRange
      );

      setResults(results as any);
    }
  };

  const handleAddRange = () => {
    const last = activeRange[activeRange.length - 1];

    setActiveRange([
      ...activeRange,
      {
        from: last.to + 1,
        to: last.to + 5, // default step (or ask user)
      },
    ]);
  };

  return (
    <>
      <p className=" text-lg font-medium py-2">Range Mode:</p>
      <div className="flex justify-between  items-center gap-2">
        <button
          onClick={() => setActiveMode("custome")}
          className={`
                ${
                  activeMode === "custome"
                    ? " border border-black bg-gray-200"
                    : "bg-gray-200 text-gray-800"
                }
                sm:px-6 sm:py-2 px-2 py-2 rounded-md
            `}
        >
          Custome Range
        </button>
        <button
          onClick={() => setActiveMode("fixed")}
          className={`
                ${
                  activeMode === "fixed"
                    ? " border border-black bg-gray-200"
                    : "bg-gray-200 text-gray-800"
                }
                sm:px-6 sm:py-2 px-2 py-2 rounded-md
            `}
        >
          Fixed Range
        </button>
      </div>
      <div className="py-3 flex flex-col gap-2">
        <p>Range:</p>
        {activeMode === "custome" && (
          <div>
            {/* <p>Total Range: {activeRange.length}</p> */}
            {activeRange.map((range, index) => (
              <div key={index} className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-2 w-full border border-gray-300 rounded-md p-2 ">
                  <p>From:</p>
                  <input
                    type="number"
                    value={range.from}
                    onChange={(e) => handleRangeChange(e, index, "from")}
                    className="w-full focus:outline-none focus:ring-0"
                  />
                </div>

                <div className="flex items-center gap-2 w-full border border-gray-300 rounded-md p-2">
                  <p>To:</p>
                  <input
                    type="number"
                    value={range.to}
                    onChange={(e) => handleRangeChange(e, index, "to")}
                    className="w-full focus:outline-none focus:ring-0"
                  />
                </div>
              </div>
            ))}

            <div className=" flex justify-center my-4">
              <button
                onClick={handleAddRange}
                className="flex items-center justify-center  gap-2 bg-gray-200 text-gray-800 px-6 py-2 rounded-md"
              >
                <span className="text-2xl">+</span>
                Add Range
              </button>
            </div>
          </div>
        )}
        {activeMode === "fixed" && (
          <>
            <div className="sm:flex items-center justify-between gap-2 my-2">
              <p className=" text-sm font-medium">Split into page ranges of:</p>
              <input
                type="number"
                value={pageRange}
                onChange={(e) =>
                  setPageRange(parseInt(e.target.value) as number)
                }
                className=" focus:outline-none focus:ring-0 
                border border-gray-300 rounded-md p-2 sm:mt-0 mt-2"
              />
            </div>
          </>
        )}
      </div>
      <div className="my-3">
        <button
          onClick={handleSplit}
          className="bg-blue-500 hover:bg-blue-600 text-white w-full 
        px-4 py-2 rounded-md transition"
        >
          Split
        </button>
      </div>
    </>
  );
};

export default Range;
