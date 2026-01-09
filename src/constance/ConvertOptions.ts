import {
  FaFileExcel,
  FaFileWord,
  FaFileCsv,
  FaFilePowerpoint,
  FaFileAlt,
  FaFilePdf,
} from "react-icons/fa";
export const navOptions = [
  { label: "Merge PDF", path: "/merge-pdfs" },
  { label: "Split PDF", path: "/split-pdfs" },
  { label: "Compress PDF", path: "/compress-pdfs" },
  {
    label: "Convert PDF",
    path: "/convert-pdfs",
    showArrow: true,
    hover: true,
  },
];

export const convertOptions = [
  {
    title: "Convert to PDF",
    options: [
      { icon: FaFileAlt, label: "JSON to PDF", path: "/json-to-pdf" },
      { icon: FaFileExcel, label: "Excel to PDF", path: "/excel-to-pdf" },
      { icon: FaFileWord, label: "Word to PDF", path: "/word-to-pdf" },
      { icon: FaFileCsv, label: "CSV to PDF", path: "/csv-to-pdf" },
      { icon: FaFilePowerpoint, label: "PPT to PDF", path: "/ppt-to-pdf" },
    ],
  },
  {
    title: "Convert from PDF",
    options: [
      { icon: FaFileAlt, label: "PDF to JSON", path: "/pdf-to-json" },
      { icon: FaFileExcel, label: "PDF to Excel", path: "/pdf-to-excel" },
      { icon: FaFileWord, label: "PDF to Word", path: "/pdf-to-word" },
      { icon: FaFileCsv, label: "PDF to CSV", path: "/pdf-to-csv" },
      { icon: FaFilePowerpoint, label: "PDF to PPT", path: "/pdf-to-ppt" },
    ],
  },
  {
    title: "Convert from Excel",
    options: [
      { icon: FaFileExcel, label: "Excel to Json", path: "/excel-to-json" },
      { icon: FaFileCsv, label: "Excel to Csv", path: "/excel-to-csv" },
    ],
  },
];

export const fileOperations = [
  {
    label: "Convert JSON to PDF",
    path: "/json-to-pdf",
    icon: FaFilePdf,
    description: "Convert a JSON file to a PDF file.",
  },
  {
    label: "Convert Excel to Json",
    path: "/excel-to-json",
    icon: FaFileExcel,
    description: "Convert a Excel file to a Json file.",
  },
  {
    label: "Convert Excel to Csv",
    path: "/excel-to-csv",
    icon: FaFileCsv,
    description: "Convert a Excel file to a Csv file.",
  },

  {
    label: "Convert PDF to Excel",
    path: "/pdf-to-excel",
    icon: FaFileExcel,
    description: "Convert a PDF file to a Excel file.",
  },
  {
    label: "Convert PDF to Word",
    path: "/pdf-to-word",
    icon: FaFileWord,
    description: "Convert a PDF file to a Word file.",
  },
  {
    label: "Convert PDF to CSV",
    path: "/pdf-to-csv",
    icon: FaFileCsv,
    description: "Convert a PDF file to a CSV file.",
  },
  {
    label: "Convert JPG to PDF",
    path: "/jpg-to-pdf",
    icon: FaFilePdf,
    description: "Convert a JPG file to a PDF file.",
  },
  {
    label: "Convert PDF to PPT",
    path: "/pdf-to-ppt",
    icon: FaFilePowerpoint,
    description: "Convert a PDF file to a PPT file.",
  },
  {
    label: "Compress PDF",
    path: "/compress-pdfs",
    icon: FaFilePdf,
    description: "Compress a PDF file to reduce its size.",
  },
  {
    label: "Merge PDFs",
    path: "/merge-pdfs",
    icon: FaFilePdf,
    menushow: false,
    description: "Merge two or more PDF files into a single PDF file.",
  },
];

export const compressPdfOptions = [
  {
    label: "Extreme Compression",
    description:
      "Extreme compression will reduce the size of the PDF file to 10% of the original size.",
    value: "100%",
  },
  {
    label: "High Compression",
    description:
      "High compression will reduce the size of the PDF file to 25% of the original size.",
    value: "75%",
  },
  {
    label: "Medium Compression",
    description:
      "Medium compression will reduce the size of the PDF file to 50% of the original size.",
    value: "50%",
  },
  {
    label: "Low Compression",
    description:
      "Low compression will reduce the size of the PDF file to 75% of the original size.",
    value: "25%",
  },
  {
    label: "Very Low Compression",
    description:
      "Very low compression will reduce the size of the PDF file to 90% of the original size.",
    value: "10%",
  },
];
