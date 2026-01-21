import { FaChevronDown } from "react-icons/fa";
import { usePdfPageNumbersStore } from "../../store/usePdfPageNumbers";
import NumberPosition from "../NumberPosition";
import { useEffect, useState } from "react";
import useUploadData from "../../hooks/useUploadData";
import useSplitStore from "../../store/useSplitStore";
{/*Font size slider

Color picker

Page range (odd / even / all)

Roman numerals (i, ii, iii)

Prefix text (“Page 1 of 10”) */}
const PageSidebar = () => {
  const {
    pageMode,
    setPageMode,
    selectedName,
    setSelectedName,
    firstNumber,
    setFirstNumber,
    selectedTextName,
    setSelectedTextName,
    clearResults,
  } = usePdfPageNumbersStore();
  const position = usePdfPageNumbersStore((s) => s.pageNumberPosition);
  const [menuOpen, setMenuOpen] = useState(false);
  const [textMenuOpen, setTextMenuOpen] = useState(false);
  const results = usePdfPageNumbersStore((s) => s.results);
  const totalPages = results.length;

  const activeRange = useSplitStore((s) => s.activeRange);
  const setActiveRange = useSplitStore((s) => s.setActiveRange);
  const { addPageNumberToPdf } = useUploadData();

  const getDefaultText = (start: number) => {
    if (!totalPages) return "";
    return `Page ${start} of ${totalPages}`;
  };

  useEffect(() => {
    if (totalPages > 0) {
      setSelectedTextName(getDefaultText(firstNumber));
    }
  }, [firstNumber, totalPages]);

  const handleApply = async () => {
    addPageNumberToPdf(results, {
      position,
      startFrom: firstNumber,
      range: {
        from: Number(activeRange[0].from),
        to: Number(activeRange[activeRange.length - 1].to),
      },
      fileName: "page-numbered.pdf",
      text: selectedTextName as string,
    });
    clearResults();
  };

  useEffect(() => {
    if (activeRange.length === 0) {
      setActiveRange([{ from: "1", to: `${totalPages}` }]);
    }
  }, [activeRange, setActiveRange]);

  const handleRangeChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
    field: "from" | "to"
  ) => {
    const value = e.target.value;
    const updated = [...activeRange];
    updated[index] = { ...updated[index], [field]: value };
    setActiveRange(updated);
  };

  return (
    <div className="flex flex-col">
      <h2 className="text-xl font-semibold border-b pb-4">Add Page Number</h2>
      <div className="flex flex-col gap-2 my-4">
        <p className="font-semibold">Page Mode:</p>
        <div className="flex items-center gap-2">
          <button
            className={`bg-blue-500 text-white px-4 py-2 rounded-md ${
              pageMode === "single" ? "bg-blue-600" : ""
            }`}
            onClick={() => setPageMode("single")}
          >
            Single Page
          </button>
          <button
            className={`bg-blue-500 text-white px-4 py-2 rounded-md ${
              pageMode === "multiple" ? "bg-blue-600" : ""
            }`}
            onClick={() => setPageMode("multiple")}
          >
            Multiple Pages
          </button>{" "}
        </div>

        <div className="flex items-center justify-between w-full gap-3">
          <div className="w-full">
            <p className="font-semibold">Position:</p>
            <NumberPosition />
          </div>
          <div
            className="relative cursor-pointer flex items-center justify-between gap-2 w-full border border-gray-400 rounded-md p-2"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <p className="text-sm">{selectedName}</p>
            <button className="">
              <FaChevronDown
                className={`text-sm ${menuOpen ? "rotate-180" : ""}`}
              />
            </button>

            {menuOpen && (
              <div
                className="absolute top-10 left-0 bg-white shadow-md rounded-md
               p-3 w-full z-50 flex flex-col gap-2 cursor-pointer"
              >
                <button
                  className="text-sm text-left px-2 py-1    "
                  onClick={() => setSelectedName("Recommended")}
                >
                  Recommended
                </button>
                <button
                  className="text-sm text-left px-2 py-1 "
                  onClick={() => setSelectedName("small")}
                >
                  small
                </button>
                <button
                  className="text-sm text-left px-2 py-1 "
                  onClick={() => setSelectedName("big")}
                >
                  big
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <h2 className=" font-semibold">Pages:</h2>
          <div className="flex items-center gap-2 w-full border border-gray-300 rounded-md p-2">
            <div className=" bg-gray-100 p-2 w-full rounded-md">
              <p>First Page Number:</p>
            </div>
            <input
              type="number"
              value={firstNumber}
              onChange={(e) => setFirstNumber(Number(e.target.value))}
              className=" focus:outline-none focus:ring-0 w-full"
            />
          </div>
        </div>

        <div className=" my-3 flex flex-col gap-2">
          <p className=" font-semibold">Which Page do you want to number?</p>
          {activeRange?.map((range, index) => {
            return (
              <div key={index} className="flex items-center gap-2 mt-2 w-full">
                <div className="flex items-center gap-2 border border-gray-300 rounded-md p-2">
                  <p className="w-full bg-gray-100 p-2 rounded-md">From:</p>
                  <input
                    type="number"
                    value={range.from}
                    onChange={(e) => handleRangeChange(e, index, "from")}
                    className="w-full focus:outline-none focus:ring-0"
                  />
                </div>
                <div className="flex items-center gap-2 border border-gray-300 rounded-md p-2">
                  <p className="w-full bg-gray-100 p-2 rounded-md">To:</p>
                  <input
                    type="number"
                    value={range.to}
                    onChange={(e) => handleRangeChange(e, index, "to")}
                    className="w-full focus:outline-none focus:ring-0"
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col gap-2">
          <p className=" font-semibold">Text:</p>
          <div
            className="relative cursor-pointer flex items-center justify-between gap-2 w-full border border-gray-400 rounded-md p-2"
            onClick={() => setTextMenuOpen(!textMenuOpen)}
          >
            <p className="text-sm">{selectedTextName}</p>
            <button className="">
              <FaChevronDown
                className={`text-sm ${textMenuOpen ? "rotate-180" : ""}`}
              />
            </button>
            {textMenuOpen && (
              <div
                className="absolute top-10 left-0 bg-white shadow-md rounded-md
               p-3 w-full z-50 flex flex-col gap-2 cursor-pointer"
              >
                <button
                  className="text-sm text-left px-2 py-1"
                  onClick={() =>
                    setSelectedTextName(
                      `page ${firstNumber} of ${
                        activeRange[activeRange.length - 1].to
                      }`
                    )
                  }
                >
                  Recommended
                </button>
                <button
                  className="text-sm text-left px-2 py-1"
                  onClick={() =>
                    setSelectedTextName(
                      `page ${firstNumber} of ${
                        activeRange[activeRange.length - 1].to
                      }`
                    )
                  }
                >{`page ${activeRange[activeRange.length - 1].from} of ${
                  activeRange[activeRange.length - 1].to
                }`}</button>
              </div>
            )}
          </div>
        </div>

        <div className="w-full flex justify-center my-3">
          <button
            onClick={handleApply}
            disabled={!results.length}
            className="bg-blue-500 text-white w-full py-2 rounded-md
           flex justify-center items-center"
          >
            Apply Page Numbers
          </button>
        </div>
      </div>
    </div>
  );
};

export default PageSidebar;
