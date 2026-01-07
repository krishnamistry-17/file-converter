import jsPDF from "jspdf";
import useFilesStore from "../store/useSheetStore";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { PDFDocument } from "pdf-lib";

const useUploadData = () => {
  const files = useFilesStore((state) => state.files);
  const selectedFile = useFilesStore((state) => state.selectedFile);
  const setSelectedFile = useFilesStore((state) => state.setSelectedFile);

  const mergeFile1 = useFilesStore((state) => state.mergeFile1);

  const mergeFile2 = useFilesStore((state) => state.mergeFile2);
  const setMergedPdfPreview = useFilesStore(
    (state) => state.setMergedPdfPreview
  );
  const setMergedPdfbytes = useFilesStore((state) => state.setMergedPdfbytes);

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

  //download data in pdf format
  const ExportToPDF = () => {
    const pdf = new jsPDF();
    pdf.text(JSON.stringify(files, null, 4), 10, 10);
    pdf.save("data.pdf");
    // autoTable(pdf, {
    //   head: Object.keys(files[0]).map((key) => ({
    //     content: key.toString().toUpperCase(),
    //   })),
    //   body: files.map((item) => Object.values(item)),
    // });
    pdf.save("data.pdf");
  };

  // Json -> Pdf
  const ConvertJsonToPdf = () => {
    showError();

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = event.target?.result as string;
        const json = JSON.parse(data);

        const pdf = new jsPDF({
          compress: true,
        });

        const pageHeight = pdf.internal.pageSize.height;
        const pageWidth = pdf.internal.pageSize.width;
        const margin = 10;
        const lineHeight = 7; // distance between lines

        // convert JSON to string and split into wrapped lines
        const jsonString = JSON.stringify(json, null, 2);
        const lines = pdf.splitTextToSize(jsonString, pageWidth - 2 * margin);

        let y = margin; // initial y position

        for (let i = 0; i < lines.length; i++) {
          if (y + lineHeight > pageHeight - margin) {
            pdf.addPage();
            y = margin; // reset for new page
          }
          pdf.text(lines[i], margin, y);
          y += lineHeight;
        }

        pdf.save("converted.pdf");
        setSelectedFile(null);
      } catch (err) {
        console.error("Error converting JSON to PDF:", err);
        alert(
          "Failed to convert JSON to PDF. Make sure the file is valid JSON."
        );
      }
    };

    reader.readAsText(selectedFile as any);
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
        const blob = new Blob([text], { type: "application/msword" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "converted.doc";
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
  const ConvertPdfToCsv = async () => {
    showError();
    try {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        const csv = Papa.unparse(
          text.split("\n").map((line) => ({ Data: line }))
        );
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "converted.csv";
        a.click();
        setSelectedFile(null);
      };
      reader.readAsText(selectedFile as any);
    } catch (err) {
      console.error(err);
      alert("Failed to convert PDF to CSV");
    }
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
      alert("Please select two PDF files first!");
      return;
    }

    try {
      // Read files
      const arrayBuffer1 = await mergeFile1.arrayBuffer();
      const arrayBuffer2 = await mergeFile2.arrayBuffer();

      // Load PDFs
      const pdfDoc1 = await PDFDocument.load(arrayBuffer1);
      const pdfDoc2 = await PDFDocument.load(arrayBuffer2);

      // Create a new PDF
      const mergedPdf = await PDFDocument.create();

      // Copy pages from first PDF
      const pages1 = await mergedPdf.copyPages(
        pdfDoc1,
        pdfDoc1.getPageIndices()
      );
      pages1.forEach((page) => mergedPdf.addPage(page));

      // Copy pages from second PDF
      const pages2 = await mergedPdf.copyPages(
        pdfDoc2,
        pdfDoc2.getPageIndices()
      );
      pages2.forEach((page) => mergedPdf.addPage(page));

      // Save merged PDF
      const mergedPdfBytes = await mergedPdf.save();
      setMergedPdfbytes(mergedPdfBytes);

      //display merged pdf in preview
      setMergedPdfPreview(
        URL.createObjectURL(
          new Blob([new Uint8Array(mergedPdfBytes)], {
            type: "application/pdf",
          })
        )
      );
    } catch (error) {
      console.error(error);
      alert("Failed to merge PDFs");
    }
  };

  const SplitPdf = () => {
    if (!selectedFile) return alert("Please select a PDF file first!");
  };

  return {
    ExportToExcel,
    ExportToCSV,
    ExportToPDF,
    ExportToJSON,
    ConvertJsonToPdf,
    ConvertPdfToExcel,
    ConvertPdfToWord,
    ConvertPdfToCsv,
    ConvertJpgToPdf,
    ConvertedPdfToPpt,
    compressPdf,
    MergePdfs,
    SplitPdf,
  };
};

export default useUploadData;
