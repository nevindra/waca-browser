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
            className="absolute bg-yellow-200/50 pointer-events-none"
            style={{
              left: `${highlight.position?.left * scale}px`,
              top: `${highlight.position?.top * scale}px`,
              width: `${highlight.position?.width * scale}px`,
              height: `${(highlight.position?.height || 12) * scale}px`,
              opacity: 0.5,
            }}
          />
        ))}
      </div>
    </Document>
  </div>
);
