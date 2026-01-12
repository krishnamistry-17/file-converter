import { createBrowserRouter } from "react-router-dom";
import Layout from "../components/layout/Layout";
import Home from "../Pages/Home/Home";
import MergePdfComponent from "../Pages/pdfs/MergePdfs";
import JsonToPdf from "../Pages/pdfs/JsonToPdf";
import PdfToExcel from "../Pages/pdfs/PdfToExcel";
import PdfToWord from "../Pages/pdfs/PdfToWord";
import PdfToCsv from "../Pages/pdfs/PdfToCsv";
import JpgToPdf from "../Pages/pdfs/JpgToPdf";
import PdfToPpt from "../Pages/pdfs/PdfToPpt";
import CompressPdf from "../Pages/pdfs/Compress";
import SplitPdf from "../Pages/pdfs/SplitPdf";
import PdfToJson from "../Pages/pdfs/PdfToJson";
import CsvToPdf from "../Pages/pdfs/CsvToPdf";
import ExcelToJson from "../Pages/excels/ExcelToJson";
import ExcelToCsv from "../Pages/excels/ExcelToCsv";
import DocsToHtml from "../Pages/docs/DocsToHtml";
import ConvertPdf from "../Pages/Convertpdf";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/json-to-pdf",
        element: <JsonToPdf />,
      },
      {
        path: "/pdf-to-json",
        element: <PdfToJson />,
      },
      {
        path: "/pdf-to-excel",
        element: <PdfToExcel />,
      },
      {
        path: "/pdf-to-word",
        element: <PdfToWord />,
      },
      {
        path: "/pdf-to-csv",
        element: <PdfToCsv />,
      },
      {
        path: "/jpg-to-pdf",
        element: <JpgToPdf />,
      },
      {
        path: "/pdf-to-ppt",
        element: <PdfToPpt />,
      },
      {
        path: "/merge-pdfs",
        element: <MergePdfComponent />,
      },
      {
        path: "/compress-pdfs",
        element: <CompressPdf />,
      },
      {
        path: "/split-pdfs",
        element: <SplitPdf />,
      },
      {
        path: "/csv-to-pdf",
        element: <CsvToPdf />,
      },
      {
        path: "/excel-to-json",
        element: <ExcelToJson />,
      },
      {
        path: "/excel-to-csv",
        element: <ExcelToCsv />,
      },
      {
        path: "/docs-to-html",
        element: <DocsToHtml />,
      },
      {
        path: "/convert-pdfs",
        element: <ConvertPdf />,
      },
    ],
  },
]);
export default routes;
