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
  infiniteScroll?: boolean;
}

export const PDFViewer = ({
  url,
  pageNumber,
  scale,
  highlights,
  onDocumentLoad,
  onPageChange,
  infiniteScroll = true,
}: PDFViewerProps) => {
  const [visiblePages, setVisiblePages] = useState<number[]>([]);
  const [numPages, setNumPages] = useState<number>(0);

  useEffect(() => {
    // Initialize visible pages based on scroll mode and ensure proper page synchronization
    if (numPages > 0) {
      if (infiniteScroll) {
        const pagesToShow = [];
        const buffer = 2; // Number of pages to show before and after current page

        // Ensure we load pages around the target page number
        const startPage = Math.max(1, pageNumber - buffer);
        const endPage = Math.min(numPages, pageNumber + buffer);

        for (let i = startPage; i <= endPage; i++) {
          pagesToShow.push(i);
        }

        // Update visible pages immediately to prevent flickering
        setVisiblePages(pagesToShow);

        // Ensure the target page is properly scrolled into view
        const scrollToPage = () => {
          const pageElement = document.querySelector(
            `[data-page-number="${pageNumber}"]`
          );
          if (pageElement) {
            pageElement.scrollIntoView({ behavior: "instant", block: "start" });
          }
        };

        // Use requestAnimationFrame to ensure the DOM has updated
        requestAnimationFrame(() => {
          scrollToPage();
        });
      } else {
        setVisiblePages([pageNumber]);
      }
    }
  }, [pageNumber, numPages, infiniteScroll]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (!infiniteScroll) return;

    const container = e.currentTarget;
    const pages = container.getElementsByClassName("react-pdf__Page");

    // Find the most visible page with improved visibility calculation
    let maxVisibleRatio = 0;
    let mostVisiblePage = pageNumber;

    Array.from(pages).forEach((page) => {
      const rect = page.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();

      // Calculate the intersection of the page with the viewport
      const visibleTop = Math.max(rect.top, containerRect.top);
      const visibleBottom = Math.min(rect.bottom, containerRect.bottom);
      const visibleHeight = Math.max(0, visibleBottom - visibleTop);

      // Calculate visibility ratio (visible height / total height)
      const visibilityRatio = visibleHeight / rect.height;

      if (visibilityRatio > maxVisibleRatio) {
        maxVisibleRatio = visibilityRatio;
        mostVisiblePage = parseInt(
          page.getAttribute("data-page-number") || "1"
        );
      }
    });

    // Only update if the page is significantly visible (more than 30%)
    if (maxVisibleRatio > 0.3) {
      // Update current page if changed
      if (mostVisiblePage !== pageNumber) {
        onPageChange(mostVisiblePage);
      }

      // Load more pages when scrolling near the edges
      const scrollPosition = container.scrollTop;
      const containerHeight = container.clientHeight;
      const scrollHeight = container.scrollHeight;

      if (scrollPosition < containerHeight * 0.2 && visiblePages[0] > 1) {
        // Load more pages at the top
        const newPages = [
          ...new Set([
            ...visiblePages,
            ...Array.from({ length: 2 }, (_, i) => visiblePages[0] - i - 1),
          ]),
        ]
          .filter((p) => p > 0)
          .sort((a, b) => a - b);
        setVisiblePages(newPages);
      } else if (
        scrollHeight - scrollPosition - containerHeight <
          containerHeight * 0.2 &&
        visiblePages[visiblePages.length - 1] < numPages
      ) {
        // Load more pages at the bottom
        const newPages = [
          ...new Set([
            ...visiblePages,
            ...Array.from(
              { length: 2 },
              (_, i) => visiblePages[visiblePages.length - 1] + i + 1
            ),
          ]),
        ]
          .filter((p) => p <= numPages)
          .sort((a, b) => a - b);
        setVisiblePages(newPages);
      }
    }
  };

  return (
    <div className="mt-24 mb-4 w-full flex justify-center">
      <div
        className="h-[calc(100vh-8rem)] overflow-y-auto"
        onScroll={handleScroll}
      >
        <Document
          file={url}
          onLoadSuccess={(pdf) => {
            onDocumentLoad(pdf);
            setNumPages(pdf.numPages);
            setVisiblePages([pageNumber]);
          }}
          loading={<div>Loading PDF...</div>}
          error={<div>Failed to load PDF</div>}
          onItemClick={({ pageNumber }) => {
            if (pageNumber) {
              onPageChange(pageNumber);
            }
          }}
        >
          <div className="relative w-full max-w-[1200px] flex flex-col gap-4">
            {visiblePages.map((pageNum) => (
              <div key={pageNum} className="relative">
                <Page
                  pageNumber={pageNum}
                  scale={scale}
                  className="shadow-lg w-full"
                  width={1200}
                  data-page-number={pageNum}
                />
                {highlights
                  .filter((highlight) => highlight.pageIndex === pageNum)
                  .map((highlight, index) => (
                    <div
                      key={`${pageNum}-${highlight.pageIndex}-${highlight.startIndex}-${highlight.endIndex}-${highlight.position?.left}-${highlight.position?.top}-${index}`}
                      className="absolute bg-yellow-300 mix-blend-multiply pointer-events-none"
                      style={{
                        left: `${(highlight.position?.left || 0) * scale}px`,
                        top: `${(highlight.position?.top || 0) * scale}px`,
                        width: `${(highlight.position?.width || 0) * scale}px`,
                        height: `${
                          (highlight.position?.height || 0) * scale
                        }px`,
                        transform: `scale(${scale})`,
                        transformOrigin: "top left",
                        borderRadius: "2px",
                      }}
                    />
                  ))}
              </div>
            ))}
          </div>
        </Document>
      </div>
    </div>
  );
};
