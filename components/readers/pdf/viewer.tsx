import { Document, Page, pdfjs } from "react-pdf";
import { SearchResult } from "./types";
import { useEffect, useState } from "react";

export interface PDFViewerProps {
  url: string;
  pageNumber: number;
  scale: number;
  highlights: SearchResult[];
  onDocumentLoad: (pdf: pdfjs.PDFDocumentProxy) => void;
  onPageChange: (pageNumber: number) => void;
  onTextSelect?: (text: string | null) => void;
}

export const PDFViewer = ({
  url,
  pageNumber,
  scale,
  highlights,
  onDocumentLoad,
  onPageChange,
  onTextSelect,
}: PDFViewerProps) => {
  const [numPages, setNumPages] = useState<number>(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" && pageNumber > 1) {
        onPageChange(pageNumber - 1);
      } else if (e.key === "ArrowRight" && pageNumber < numPages) {
        onPageChange(pageNumber + 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [pageNumber, numPages, onPageChange]);

  useEffect(() => {
    const handleMouseUp = () => {
      const selection = window.getSelection();
      const selectedText = selection?.toString() || null;
      onTextSelect?.(selectedText);
    };

    window.addEventListener("mouseup", handleMouseUp);
    return () => window.removeEventListener("mouseup", handleMouseUp);
  }, [onTextSelect]);

  return (
    <div className="my-2 w-full flex justify-center bg-white">
      <div className="w-full max-w-[1200px]">
        <Document
          file={url}
          onLoadSuccess={(pdf) => {
            onDocumentLoad(pdf);
            setNumPages(pdf.numPages);
          }}
          loading={<div>Loading PDF...</div>}
          error={<div>Failed to load PDF</div>}
          onItemClick={({ pageNumber }) => {
            if (pageNumber) {
              onPageChange(pageNumber);
            }
          }}
        >
          <div className="relative w-full flex flex-col items-center">
            <div className="relative">
              <Page
                pageNumber={pageNumber}
                scale={scale}
                className="shadow-lg"
                width={1200}
              />
              {highlights
                .filter((highlight) => highlight.pageIndex === pageNumber)
                .map((highlight, index) => (
                  <div
                    key={`${pageNumber}-${highlight.pageIndex}-${highlight.startIndex}-${highlight.endIndex}-${highlight.position?.left}-${highlight.position?.top}-${index}`}
                    className="absolute bg-yellow-300 mix-blend-multiply pointer-events-none"
                    style={{
                      left: `${(highlight.position?.left || 0) * scale}px`,
                      top: `${(highlight.position?.top || 0) * scale}px`,
                      width: `${(highlight.position?.width || 0) * scale}px`,
                      height: `${(highlight.position?.height || 0) * scale}px`,
                      transform: `scale(${scale})`,
                      transformOrigin: "top left",
                      borderRadius: "2px",
                    }}
                  />
                ))}
            </div>
          </div>
        </Document>
      </div>
    </div>
  );
};
