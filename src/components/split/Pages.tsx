import { useState } from "react";
import useUploadData from "../../hooks/useUploadData";
import useFilesStore from "../../store/useSheetStore";
import useSplitStore from "../../store/useSplitStore";

const Pages = () => {
  const pageExtractMode = useSplitStore((s) => s.pageExtractMode);
  const setPageExtractMode = useSplitStore((s) => s.setPageExtractMode);

  const { extractAllPages, extractSelectedRange, extractSelectedPage } =
    useUploadData();

  const selectedFile = useFilesStore((state) => state.selectedFile);

  const clearSelectedRange = useSplitStore((s) => s.clearSelectedRange);

  const setResults = useSplitStore((state) => state.setResults);
  const setSelectedPages = useSplitStore((state) => state.setSelectedPages);
  const selectedPages = useSplitStore((state) => state.selectedPages);
  const results = useSplitStore((state) => state.results);
  const selectedRange = useSplitStore((state) => state.selectedRange);

  const [pageInput, setPageInput] = useState("");

  const handleSplit = async () => {
    if (!selectedFile) return;

    if (pageExtractMode === "extractAll") {
      const allResults = await extractAllPages(selectedFile as File);
      setResults(allResults as any);
    }

    if (pageExtractMode === "selectPages") {
      const allResults = await extractAllPages(selectedFile as File);
      const pageResults = await extractSelectedPage(
        selectedFile as File,
        selectedPages
      );

      const rangeResults = await Promise.all(
        selectedRange.map((r) => extractSelectedRange(selectedFile as File, r))
      );

      setResults([
        ...allResults,
        ...pageResults,
        ...rangeResults.flat(),
      ] as any);
    }
  };

  const parsePagesAndRanges = (input: string) => {
    const pages: number[] = [];
    const ranges: { from: number; to: number }[] = [];

    input.split(",").forEach((part) => {
      const value = part.trim();

      if (value.includes("-")) {
        const [from, to] = value.split("-").map(Number);

        if (
          !Number.isNaN(from) &&
          !Number.isNaN(to) &&
          from > 0 &&
          to >= from
        ) {
          ranges.push({ from, to });
        }
      } else {
        const page = Number(value);
        if (!Number.isNaN(page) && page > 0) {
          pages.push(page);
        }
      }
    });

    return { pages, ranges };
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPageInput(value);

    clearSelectedRange();

    const { pages, ranges } = parsePagesAndRanges(value);
    setSelectedPages(pages);
    useSplitStore.getState().setSelectedRange(ranges);
  };
  const handleDownloadSelectedPages = async () => {
    if (!selectedFile) return;
    const selectedpageResult = await extractSelectedPage(
      selectedFile as File,
      selectedPages
    );
    const rangeResults = await Promise.all(
      selectedRange.map((r) => extractSelectedRange(selectedFile as File, r))
    );

    const blob = new Blob(
      [new Uint8Array(await selectedpageResult[0]?.blob.arrayBuffer())],
      {
        type: "application/pdf",
      }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "selected-pages.pdf";
    a.click();

    rangeResults.forEach(async (r) => {
      const rangeblob = new Blob(
        [new Uint8Array(await r[0]?.blob.arrayBuffer())],
        {
          type: "application/pdf",
        }
      );
      const urls = URL.createObjectURL(rangeblob);
      const as = document.createElement("a");
      as.href = urls;
      as.download = "selected-pages.pdf";
      as.click();
      URL.revokeObjectURL(urls);
    });
  };

  const handleDownloadAllPages = async () => {
    if (!selectedFile) return;
    const allResults = await extractAllPages(selectedFile as File);
    const blob = new Blob(
      [new Uint8Array(await allResults[0]?.blob.arrayBuffer())],
      {
        type: "application/pdf",
      }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "all-pages.pdf";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <p className=" text-lg font-medium py-2">Extract Mode:</p>
      <div className="flex justify-between  items-center gap-2">
        <button
          onClick={() => setPageExtractMode("extractAll")}
          className={`
                ${
                  pageExtractMode === "extractAll"
                    ? " border border-black bg-gray-200"
                    : "bg-gray-200 text-gray-800"
                }
                px-6 py-2 rounded-md
            `}
        >
          Extract All Pages
        </button>
        <button
          onClick={() => setPageExtractMode("selectPages")}
          className={`
                ${
                  pageExtractMode === "selectPages"
                    ? " border border-black bg-gray-200"
                    : "bg-gray-200 text-gray-800"
                }
                px-6 py-2 rounded-md
            `}
        >
          Select Pages
        </button>
      </div>
      <div className="py-3 flex flex-col gap-2">
        {pageExtractMode === "extractAll" && (
          <div className="mt-2 flex flex-col gap-2">
            <div className=" w-full flex justify-center my-2">
              <button
                onClick={handleSplit}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition w-full"
              >
                Split
              </button>
            </div>
            <p className="text-sm text-black">
              Selected pages will be converted into sepraate pdf files.{" "}
              <b>{results.length} pdf</b> will be created.
            </p>
            <button
              onClick={handleDownloadAllPages}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition w-full"
            >
              Download All Pages
            </button>
          </div>
        )}
        {pageExtractMode === "selectPages" && (
          <div className="flex flex-col gap-2 my-2">
            <p>Pages to extract</p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="1,2,5-10"
                className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-0"
                value={pageInput}
                onChange={handleInputChange}
              />
            </div>
            <div className="mt-2 flex flex-col gap-2">
              <button
                onClick={handleSplit}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
              >
                Split
              </button>
              <p className="text-sm text-black">
                Selected pages will be converted into sepraate pdf files.{" "}
                <b>{selectedRange.length} pdf</b> will be created.
              </p>
              <button
                onClick={handleDownloadSelectedPages}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition w-full"
              >
                Download Selected Pages
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Pages;
