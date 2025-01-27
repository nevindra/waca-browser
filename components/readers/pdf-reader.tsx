"use client";

import { useState, useRef, useEffect } from "react";
import { pdfjs } from "react-pdf";
import { useDebounce } from "@uidotdev/usehooks";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { ReaderToolbar } from "./shared/reader-toolbar";
import { SearchOverlay } from "./pdf/search-overlay";
import { PDFViewer } from "./pdf/viewer";
import { SearchResult } from "./pdf/types";
import { searchInDocument } from "./pdf/utils";
import { TableOfContents } from "./pdf/table-of-contents";
import { PDFToolbar } from "./pdf/pdf-toolbar";
// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";

interface PDFReaderProps {
  url: string;
  title: string;
}

interface TOCItem {
  title: string;
  pageNumber: number;
  children?: TOCItem[];
}

export function PDFReader({ url, title }: PDFReaderProps) {
  const [numPages, setNumPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [infiniteScroll, setInfiniteScroll] = useState(true);
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [currentSearchIndex, setCurrentSearchIndex] = useState(-1);
  const [isSearching, setIsSearching] = useState(false);
  const [highlights, setHighlights] = useState<SearchResult[]>([]);
  const pdfDocumentRef = useRef<pdfjs.PDFDocumentProxy | null>(null);

  // Update highlights when page changes or search results change
  const updateHighlights = () => {
    if (!searchQuery || currentSearchIndex === -1) {
      setHighlights([]);
      return;
    }

    const currentPageResults = searchResults.filter(
      (result) => result.pageIndex === pageNumber
    );
    setHighlights(currentPageResults);
  };

  useEffect(() => {
    if (debouncedSearchQuery) {
      handleSearch(debouncedSearchQuery);
    }
  }, [debouncedSearchQuery]);

  const handleSearch = async (query: string) => {
    if (!query || !pdfDocumentRef.current) return;

    setSearchQuery(query);
    setIsSearching(true);
    setSearchResults([]);
    setCurrentSearchIndex(-1);
    setHighlights([]);

    try {
      const results = await searchInDocument(pdfDocumentRef.current, query);
      setSearchResults(results);
      if (results.length > 0) {
        setCurrentSearchIndex(0);
        setPageNumber(results[0].pageIndex);
      }
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const navigateSearch = (direction: "next" | "prev") => {
    if (searchResults.length === 0) return;

    let newIndex = currentSearchIndex;
    if (direction === "next") {
      newIndex = (currentSearchIndex + 1) % searchResults.length;
    } else {
      newIndex = currentSearchIndex - 1;
      if (newIndex < 0) newIndex = searchResults.length - 1;
    }

    setCurrentSearchIndex(newIndex);
    setPageNumber(searchResults[newIndex].pageIndex);
  };

  const [isTocOpen, setIsTocOpen] = useState(false);
  const [tocItems, setTocItems] = useState<TOCItem[]>([]);

  const handleDocumentLoad = async (pdf: pdfjs.PDFDocumentProxy) => {
    setNumPages(pdf.numPages);
    pdfDocumentRef.current = pdf;

    try {
      const outline = await pdf.getOutline();
      if (outline) {
        const items: TOCItem[] = await Promise.all(
          outline.map(async (item) => {
            let pageIndex = 0;
            try {
              if (item.dest) {
                const dest = await pdf.getDestination(item.dest);
                if (dest) {
                  const ref = await pdf.getPageIndex(dest[0]);
                  pageIndex = ref;
                }
              }
            } catch (error) {
              console.warn("Failed to resolve page index:", error);
            }

            const children = item.items
              ? await Promise.all(
                  item.items.map(async (child) => {
                    let childPageIndex = 0;
                    try {
                      if (child.dest) {
                        const childDest = await pdf.getDestination(child.dest);
                        if (childDest) {
                          const ref = await pdf.getPageIndex(childDest[0]);
                          childPageIndex = ref;
                        }
                      }
                    } catch (error) {
                      console.warn(
                        "Failed to resolve child page index:",
                        error
                      );
                    }

                    return {
                      title: child.title,
                      pageNumber: childPageIndex + 1,
                    };
                  })
                )
              : undefined;

            return {
              title: item.title,
              pageNumber: pageIndex + 1,
              children,
            };
          })
        );
        setTocItems(items);
      }
    } catch (error) {
      console.error("Failed to load table of contents:", error);
    }
  };

  // Update highlights when page or search results change
  useEffect(() => {
    updateHighlights();
  }, [pageNumber, searchResults, currentSearchIndex, searchQuery]);

  // Handle keyboard navigation
  const pdfContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" && pageNumber > 1) {
        setPageNumber(pageNumber - 1);
        pdfContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
      } else if (e.key === "ArrowRight" && pageNumber < (numPages || 1)) {
        setPageNumber(pageNumber + 1);
        pdfContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [pageNumber, numPages]);

  return (
    <div className="relative flex flex-col items-center min-h-screen bg-gray-50">
      <ReaderToolbar bookTitle={title}>
        <PDFToolbar
          currentPage={pageNumber}
          totalPages={numPages}
          scale={scale}
          onPageChange={setPageNumber}
          onScaleChange={setScale}
          onToggleSearch={() => setIsSearchOpen(!isSearchOpen)}
          onToggleToc={() => setIsTocOpen(!isTocOpen)}
          infiniteScroll={infiniteScroll}
          onInfiniteScrollChange={setInfiniteScroll}
        />
      </ReaderToolbar>

      <TableOfContents
        isOpen={isTocOpen}
        items={tocItems}
        onClose={() => setIsTocOpen(false)}
        onItemClick={(page) => {
          setPageNumber(page);
          setIsTocOpen(false);
        }}
      />

      <SearchOverlay
        isOpen={isSearchOpen}
        searchQuery={searchQuery}
        isSearching={isSearching}
        searchResults={searchResults}
        currentSearchIndex={currentSearchIndex}
        onClose={() => setIsSearchOpen(false)}
        onSearch={handleSearch}
        onNavigate={navigateSearch}
        onResultClick={(index) => {
          setCurrentSearchIndex(index);
          setPageNumber(searchResults[index].pageIndex);
        }}
      />

      <PDFViewer
        url={url}
        pageNumber={pageNumber}
        scale={scale}
        highlights={highlights}
        onDocumentLoad={handleDocumentLoad}
        onPageChange={setPageNumber}
        infiniteScroll={infiniteScroll}
      />
    </div>
  );
}
