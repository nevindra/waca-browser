import { Document, Page, pdfjs } from "react-pdf";
import { SearchResult } from "./types";

export interface PDFViewerProps {
  url: string;
  pageNumber: number;
  scale: number;
  highlights: SearchResult[];
  onDocumentLoad: (pdf: pdfjs.PDFDocumentProxy) => void;
}

export const PDFViewer = ({
  url,
  pageNumber,
  scale,
  highlights,
  onDocumentLoad,
}: PDFViewerProps) => (
  <div className="mt-24 mb-4">
    <Document
      file={url}
      onLoadSuccess={onDocumentLoad}
      loading={<div>Loading PDF...</div>}
      error={<div>Failed to load PDF</div>}
    >
      <div className="relative">
        <Page pageNumber={pageNumber} scale={scale} className="shadow-lg" />
        {highlights.map((highlight, index) => (
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
    </Document>
  </div>
);
