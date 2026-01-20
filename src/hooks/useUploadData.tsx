import jsPDF from "jspdf";
import useFilesStore from "../store/useSheetStore";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { PDFDocument } from "pdf-lib";
import useSplitStore from "../store/useSplitStore";
import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker?url";
import mammoth from "mammoth";
import autoTable from "jspdf-autotable";
import { degrees } from "pdf-lib";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

type TextItem = {
  str: string;
  transform: number[];
};

export type SplitResult = {
  name: string;
  blob: Blob;
  url: string;
  pages: string;
};

// export const normalizeText = (text: string) => {
//   //number
//   if (!isNaN(Number(text))) {
//     return text;
//   }

//   //date
//   if (!isNaN(new Date(text).getTime())) {
//     return new Date(text).toLocaleDateString();
//   }

//   //boolean
//   if (text.toLowerCase() === "true" || text.toLowerCase() === "false") {
//     return text.toLowerCase() === "true";
//   }

//   //null
//   if (text.toLowerCase() === "null") {
//     return null;
//   }

//   //undefined
//   if (text.toLowerCase() === "undefined") {
//     return undefined;
//   }

//   //empty string
//   if (text.toLowerCase() === "") {
//     return "";
//   }

//   return text;
// };

const normalizeText = (value: any) =>
  value === null || value === undefined ? "" : String(value);

const useUploadData = () => {
  const mergeFile1 = useFilesStore((state) => state.mergeFile1);
  const mergeFile2 = useFilesStore((state) => state.mergeFile2);

  const files = useFilesStore((state) => state.results);
  const selectedFile = useFilesStore((state) => state.selectedFile);

  const setSelectedFile = useFilesStore((state) => state.setSelectedFile);

  const showError = () => {
    if (!selectedFile) {
      alert("No file selected!");
      return;
    }
  };

  //download data in excel format
  const ExportToExcel = () => {
    //create a worksheet
    const excel = XLSX.utils.json_to_sheet(files);
    //create a workbook
    const workbook = XLSX.utils.book_new();
    //append the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, excel, "Sheet1");
    //write the workbook to a buffer
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    //create a blob from the buffer
    const excelBlob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    //create a url from the blob
    const excelUrl = URL.createObjectURL(excelBlob);
    //create a link element
    const a = document.createElement("a");
    a.href = excelUrl;
    a.download = "data.xlsx";
    a.click();
  };

  const ConvertExcelToCsv = () => {
    if (!selectedFile) {
      alert("Please select a file");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const data = new Uint8Array(event.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.SheetNames[0];
      const csv = XLSX.utils.sheet_to_csv(workbook.Sheets[sheet]);
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${selectedFile.name}.csv`;
      a.click();
    };
    reader.readAsArrayBuffer(selectedFile as any);
  };

  const ConvertDocsToHtml = async () => {
    if (!selectedFile) {
      alert("Please select a file");
      return;
    }

    const arrayBuffer = await selectedFile.arrayBuffer();
    const doc = await mammoth.extractRawText(
      new Uint8Array(arrayBuffer) as any
    );

    const blob = new Blob([doc.value], { type: "text/html;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${selectedFile?.name}.html`;
    a.click();
    setSelectedFile(null);
  };

  const ConvertExcelToJson = () => {
    if (!selectedFile) {
      alert("Please select a file");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const data = new Uint8Array(event.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.SheetNames[0];
      const json = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);
      const blob = new Blob([JSON.stringify(json, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${selectedFile.name}.json`;
      a.click();
    };
    reader.readAsArrayBuffer(selectedFile as any);
  };

  //download data in csv format
  const ExportToCSV = () => {
    const csv = Papa.unparse(files);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "data.csv";
    a.click();
  };

  //download data in json format
  const ExportToJSON = () => {
    const json = JSON.stringify(files, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "data.json";
    a.click();
  };

  const mapTableDataToRows = (data: any[]): string[][] => {
    if (!Array.isArray(data) || data.length === 0) return [];

    // If rows are objects (table data)
    if (!Array.isArray(data[0])) {
      const headers = Object.keys(data[0]);

      const body = data.map((row) =>
        headers.map((key) => normalizeText(row[key]) as string)
      );

      return [headers, ...body] as string[][];
    }

    // If already string[][]
    return data.map((row) => row.map(normalizeText)) as string[][];
  };

  //download data in pdf format
  const ExportToPDF = () => {
    const pdf = new jsPDF();
    const rows = mapTableDataToRows(files as any[]);

    let y = 10;

    rows.forEach((row: string[]) => {
      if (y > 270) {
        pdf.addPage();
        y = 10;
      }

      pdf.text(row.join("    "), 10, y);
      y += 8;
    });

    pdf.save("data.pdf");
  };

  // Json -> Pdf
  const ConvertJsonToPdf = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      showError();

      const reader = new FileReader();

      reader.onload = (event) => {
        try {
          const data = event.target?.result as string;
          const json = JSON.parse(data);

          const pdf = new jsPDF({ compress: true });

          const pageHeight = pdf.internal.pageSize.height;
          const pageWidth = pdf.internal.pageSize.width;
          const margin = 10;
          const lineHeight = 7;

          const jsonString = JSON.stringify(json, null, 2);
          const lines = pdf.splitTextToSize(jsonString, pageWidth - 2 * margin);

          let y = margin;

          for (let i = 0; i < lines.length; i++) {
            if (y + lineHeight > pageHeight - margin) {
              pdf.addPage();
              y = margin;
            }
            pdf.text(lines[i], margin, y);
            y += lineHeight;
          }

          pdf.save("converted.pdf");
          setSelectedFile(null);
          resolve();
        } catch (err) {
          console.error(err);
          reject(err);
        }
      };

      reader.onerror = reject;
      reader.readAsText(selectedFile as File);
    });
  };

  // Pdf -> Json
  const convertPdfToJson = async (file: File) => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    const pages: {
      pageNumber: number;
      text: string;
      items: any[];
    }[] = [];

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();

      const pageText = textContent.items.map((item: any) => item.str).join(" ");

      pages.push({
        pageNumber: i,
        text: pageText,
        items: textContent.items, // raw text positions (optional)
      });
    }

    //add download the json file
    const json = JSON.stringify(pages, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${file.name}.json`;
    a.click();
    setSelectedFile(null);

    return {
      fileName: file.name,
      totalPages: pdf.numPages,
      pages,
    };
  };

  // Pdf -> Excel
  const ConvertPdfToExcel = async () => {
    showError();
    try {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        const lines = text.split("\n").map((line) => ({ Data: line }));
        const worksheet = XLSX.utils.json_to_sheet(lines);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        const buffer = XLSX.write(workbook, {
          bookType: "xlsx",
          type: "array",
        });
        const blob = new Blob([buffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "converted.xlsx";
        a.click();
        setSelectedFile(null);
      };
      reader.readAsText(selectedFile as any);
    } catch (err) {
      console.error(err);
      alert("Failed to convert PDF to Excel");
    }
  };

  // Pdf -> Word
  const ConvertPdfToWord = async () => {
    showError();
    try {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        const blob = new Blob([text], {
          type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "converted.docx";
        a.click();
        setSelectedFile(null);
      };
      reader.readAsText(selectedFile as any);
    } catch (err) {
      console.error(err);
      alert("Failed to convert PDF to Word");
    }
  };

  // Pdf -> csv

  const convertPdfToCsv = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    const rows: string[][] = [];

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();

      const items = textContent.items as TextItem[];

      // Group text by Y position (rows)
      const rowMap: Record<number, TextItem[]> = {};

      items.forEach((item) => {
        const y = Math.round(item.transform[5]); // vertical position
        if (!rowMap[y]) rowMap[y] = [];
        rowMap[y].push(item);
      });

      // Sort rows top → bottom
      const sortedRows = Object.keys(rowMap)
        .map(Number)
        .sort((a, b) => b - a);

      sortedRows.forEach((y) => {
        const row = rowMap[y]
          .sort((a, b) => a.transform[4] - b.transform[4]) // left → right
          .map((item) => item.str.trim())
          .filter(Boolean);

        if (row.length) rows.push(row);
      });
    }

    const csv = rowsToCsv(rows);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${file.name}.csv`;
    a.click();
    setSelectedFile(null);
    return csv;
  };

  const rowsToCsv = (rows: string[][]): string => {
    return rows
      .map((row) =>
        row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");
  };

  // Jpg,png,jpeg -> Pdf
  const ConvertJpgToPdf = async () => {
    showError();
    try {
      const reader = new FileReader();
      reader.onload = (event) => {
        const image = event.target?.result as string;

        const pdf = new jsPDF();
        pdf.addImage(image, "JPEG,PNG,JPG", 10, 10, 100, 100);
        pdf.save("converted.pdf");
        setSelectedFile(null);
      };
      reader.readAsDataURL(selectedFile as any);
    } catch (err) {
      console.error(err);
      alert("Failed to convert JPG to PDF");
    }
  };

  // pdf -> ppt
  const ConvertedPdfToPpt = async () => {
    showError();
    try {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        const blob = new Blob([text], {
          type: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "converted.ppt";
        a.click();
        setSelectedFile(null);
      };
      reader.readAsText(selectedFile as any);
    } catch (error) {
      console.error(error);
      alert("Failed to convert PDF to PPT");
    }
  };

  // Compress PDF
  const compressPdf = async () => {
    if (!selectedFile) {
      alert("Please select a PDF file first!");
      return;
    }

    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);

      const compressedBytes = await pdfDoc.save({
        useObjectStreams: true,
        addDefaultPage: false,
        objectsPerTick: 20,
      });

      const blob = new Blob([new Uint8Array(compressedBytes)], {
        type: "application/pdf",
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `compressed-${selectedFile.name}`;
      a.click();
    } catch (err) {
      console.error(err);
      alert("Failed to compress PDF");
    }
  };

  // Merge PDFs

  const MergePdfs = async () => {
    if (!mergeFile1 || !mergeFile2) {
      alert("Please select both PDF files to merge!");
      return;
    }

    try {
      // Read the files as array buffers
      const file1Buffer = await mergeFile1.arrayBuffer();
      const file2Buffer = await mergeFile2.arrayBuffer();

      // Load PDFs
      const pdf1 = await PDFDocument.load(file1Buffer);
      const pdf2 = await PDFDocument.load(file2Buffer);

      // Create a new PDF to merge into
      const mergedPdf = await PDFDocument.create();

      // Copy pages from first PDF
      const pages1 = await mergedPdf.copyPages(pdf1, pdf1.getPageIndices());
      pages1.forEach((page) => mergedPdf.addPage(page));

      // Copy pages from second PDF
      const pages2 = await mergedPdf.copyPages(pdf2, pdf2.getPageIndices());
      pages2.forEach((page) => mergedPdf.addPage(page));

      // Save merged PDF
      const mergedPdfBytes = await mergedPdf.save();

      // Create blob and preview URL
      downloadPdf(mergedPdfBytes, "merged.pdf");
    } catch (error) {
      console.error("Error merging PDFs:", error);
    }
  };

  const splitPdfByRange = async (
    file: File,
    range: { from: number; to: number }
  ) => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await PDFDocument.load(arrayBuffer);
    const totalPages = pdf.getPageCount();

    //ensure numbers
    const from = Number(range.from);
    const to = Number(range.to);

    if (
      Number.isNaN(from) ||
      Number.isNaN(to) ||
      from < 1 ||
      to > totalPages ||
      from > to
    ) {
      return [];
    }

    const newPdf = await PDFDocument.create();

    // IMPORTANT: pdf-lib uses ZERO-based indexes
    const pageIndexes: number[] = [];
    for (let i = from; i <= to; i++) {
      pageIndexes.push(i - 1);
    }

    const copiedPages = await newPdf.copyPages(pdf, pageIndexes);
    copiedPages.forEach((p) => newPdf.addPage(p));

    const bytes = await newPdf.save();
    const blob = new Blob([new Uint8Array(bytes)], {
      type: "application/pdf",
    });

    return [
      {
        name: `range-${from}-${to}.pdf`,
        blob,
        url: URL.createObjectURL(blob),
        pages: `${from}-${to}`,
      },
    ];
  };

  const splitPdfByFixedRange = async (
    file: File,
    rangeSize: number
  ): Promise<SplitResult[]> => {
    const buffer = await file.arrayBuffer();
    const pdf = await PDFDocument.load(buffer);
    const totalPages = pdf.getPageCount();

    const results: SplitResult[] = [];

    for (let start = 0; start < totalPages; start += rangeSize) {
      const newPdf = await PDFDocument.create();

      const pageIndexes = Array.from(
        { length: Math.min(rangeSize, totalPages - start) },
        (_, i) => start + i
      );

      const pages = await newPdf.copyPages(pdf, pageIndexes);
      pages.forEach((p) => newPdf.addPage(p));

      const bytes = await newPdf.save();
      const blob = new Blob([new Uint8Array(bytes)], {
        type: "application/pdf",
      });

      results.push({
        name: `pages-${start + 1}-${start + pageIndexes.length}.pdf`,
        blob,
        url: URL.createObjectURL(blob),
        pages: `${start + 1}-${start + pageIndexes.length}`,
      });
    }

    return results;
  };

  const downloadPdf = (bytes: Uint8Array, name: string) => {
    const blob = new Blob([new Uint8Array(bytes)], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();

    URL.revokeObjectURL(url);
  };

  const splitEveryPage = async (file: File) => {
    const buffer = await file.arrayBuffer();
    const pdf = await PDFDocument.load(buffer);
    const totalPages = pdf.getPageCount();

    for (let i = 0; i < totalPages; i++) {
      const newPdf = await PDFDocument.create();
      const [page] = await newPdf.copyPages(pdf, [i]);
      newPdf.addPage(page);

      const bytes = await newPdf.save();
      downloadPdf(bytes, `page-${i + 1}.pdf`);
    }
  };

  const downloadSplitPdf = (bytes: Uint8Array, name: string) => {
    const blob = new Blob([new Uint8Array(bytes)], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
  };

  const getTotalPages = async (file: File) => {
    const arrayBuffer = await file.arrayBuffer();
    const originalPdf = await PDFDocument.load(arrayBuffer);

    const totalPages = originalPdf.getPageCount();
    console.log(totalPages, "totalPages");
    return totalPages;
  };

  const extractAllPages = async (file: File) => {
    const buffer = await file.arrayBuffer();
    const pdf = await PDFDocument.load(buffer);
    const totalPages = pdf.getPageCount();
    console.log(totalPages, "totalPages");
    const results: SplitResult[] = [];
    for (let i = 0; i < totalPages; i++) {
      const newPdf = await PDFDocument.create();
      const [page] = await newPdf.copyPages(pdf, [i]);
      newPdf.addPage(page);
      const bytes = await newPdf.save();
      const blob = new Blob([new Uint8Array(bytes)], {
        type: "application/pdf",
      });
      results.push({
        name: `page-${i + 1}.pdf`,
        blob,
        url: URL.createObjectURL(blob),
        pages: `${i + 1}`,
      });
    }
    return results;
  };

  const extractSelectedPage = async (file: File, pages: number[]) => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await PDFDocument.load(arrayBuffer);
    const totalPages = pdf.getPageCount();
    const results: SplitResult[] = [];

    for (const page of pages) {
      if (page < 1 || page > totalPages) {
        continue;
      }
      const newPdf = await PDFDocument.create();
      const [pageData] = await newPdf.copyPages(pdf, [page - 1]);
      newPdf.addPage(pageData);
      const bytes = await newPdf.save();
      const blob = new Blob([new Uint8Array(bytes)], {
        type: "application/pdf",
      });
      results.push({
        name: `page-${page}.pdf`,
        blob,
        url: URL.createObjectURL(blob),
        pages: `${page}`,
      });
    }
    return results;
  };

  const extractSelectedRange = async (
    file: File,
    range: { from: number; to: number }
  ) => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await PDFDocument.load(arrayBuffer);
    const totalPages = pdf.getPageCount();

    // ensure numbers
    const from = Number(range.from);
    const to = Number(range.to);

    if (
      Number.isNaN(from) ||
      Number.isNaN(to) ||
      from < 1 ||
      to > totalPages ||
      from > to
    ) {
      return [];
    }

    const newPdf = await PDFDocument.create();

    // IMPORTANT: pdf-lib uses ZERO-based indexes
    const pageIndexes: number[] = [];
    for (let i = from; i <= to; i++) {
      pageIndexes.push(i - 1);
    }

    const copiedPages = await newPdf.copyPages(pdf, pageIndexes);
    copiedPages.forEach((p) => newPdf.addPage(p));

    const bytes = await newPdf.save();
    const blob = new Blob([new Uint8Array(bytes)], {
      type: "application/pdf",
    });

    return [
      {
        name: `range-${from}-${to}.pdf`,
        blob,
        url: URL.createObjectURL(blob),
        pages: `${from}-${to}`,
      },
    ];
  };

  const pdfSize = async (file: File) => {
    const buffer = await file.arrayBuffer();
    const pdf = await PDFDocument.load(buffer);
    const sizeUnit = useSplitStore((state) => state.sizeUnit);
    const bytes = await pdf.save();
    const size = bytes.length;
    if (sizeUnit === "MB") {
      return Math.round(size / 1024 / 1024);
    } else {
      return Math.round(size / 1024);
    }
  };

  const compressPdfBySize = async (file: File) => {
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer, {
      ignoreEncryption: true,
    });

    // Re-save PDF without changing pages to reduce size
    const compressedBytes = await pdfDoc.save({
      useObjectStreams: true,
      addDefaultPage: false,
    });
    const results: SplitResult[] = [];
    const blob = new Blob([new Uint8Array(compressedBytes)], {
      type: "application/pdf",
    });
    //download the compressed pdf
    downloadPdf(compressedBytes, `compressed-${file.name}`);
    results.push({
      name: `compressed-${file.name}`,
      blob,
      url: URL.createObjectURL(blob),
      pages: pdfDoc.getPageCount().toString(),
    });
    return results;
  };

  const convertCsvToPdf = async (file: File) => {
    const buffer = await file.arrayBuffer();
    const text = new TextDecoder().decode(buffer);

    const { data, meta } = Papa.parse(text, {
      header: true,
      skipEmptyLines: true,
    });

    const pdf = new jsPDF();

    autoTable(pdf, {
      head: [meta.fields!],
      body: data.map((row: any) => meta.fields!.map((f) => row[f])),
      styles: { fontSize: 8 },
    });

    pdf.save("converted.pdf");
  };

  const organizePdf = async (
    pages: {
      blob: Blob;
      rotation: number;
    }[],
    fileName = "organized.pdf"
  ) => {
    const finalPdf = await PDFDocument.create();

    for (const page of pages) {
      const buffer = await page.blob.arrayBuffer();
      const srcPdf = await PDFDocument.load(buffer);
      const [srcPage] = await finalPdf.copyPages(srcPdf, [0]);

      if (page.rotation) {
        srcPage.setRotation(degrees(page.rotation));
      }

      finalPdf.addPage(srcPage);
    }

    const bytes = await finalPdf.save();
    const blob = new Blob([new Uint8Array(bytes)], { type: "application/pdf" });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();

    URL.revokeObjectURL(link.href);
  };

  return {
    ExportToExcel,
    ExportToCSV,
    ExportToPDF,
    ExportToJSON,
    ConvertExcelToJson,
    ConvertExcelToCsv,
    ConvertDocsToHtml,
    ConvertJsonToPdf,
    ConvertPdfToExcel,
    ConvertPdfToWord,
    convertPdfToCsv,
    ConvertJpgToPdf,
    ConvertedPdfToPpt,
    compressPdf,
    MergePdfs,
    splitPdfByRange,
    splitEveryPage,
    getTotalPages,
    splitPdfByFixedRange,
    downloadPdf,
    downloadSplitPdf,
    extractAllPages,
    extractSelectedPage,
    extractSelectedRange,
    pdfSize,
    compressPdfBySize,
    convertPdfToJson,
    convertCsvToPdf,
    organizePdf,
  };
};

export default useUploadData;
