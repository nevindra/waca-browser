"use client";

import { useEffect, useRef, useState } from "react";
import { Book as EPub } from "epubjs";
import { ReaderToolbar } from "@/components/readers/shared/reader-toolbar";
import { EPubToolbar } from "./epub/epub-toolbar";

interface EPubReaderProps {
  url: string;
}

export function EPubReader({ url }: EPubReaderProps) {
  const viewerRef = useRef<HTMLDivElement>(null);
  const [book, setBook] = useState<EPub | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    if (!viewerRef.current) return;

    const book = new EPub(url);
    setBook(book);

    book.ready.then(() => {
      const rendition = book.renderTo(viewerRef.current!, {
        width: "100%",
        height: "600px",
      });

      rendition.display();

      // Get total pages
      book.locations.generate().then(() => {
        const total = book.locations.total;
        setTotalPages(total);
      });
    });

    return () => {
      book.destroy();
    };
  }, [url]);

  const goToNextPage = () => {
    if (!book || currentPage >= totalPages - 1) return;
    book.rendition.next();
    setCurrentPage((prev) => prev + 1);
  };

  const goToPrevPage = () => {
    if (!book || currentPage <= 0) return;
    book.rendition.prev();
    setCurrentPage((prev) => prev - 1);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <ReaderToolbar bookTitle={url.split("/").pop() || "EPUB Book"}>
        <EPubToolbar
          currentPage={currentPage}
          totalPages={totalPages}
          onPrevPage={goToPrevPage}
          onNextPage={goToNextPage}
        />
      </ReaderToolbar>

      <div
        ref={viewerRef}
        className="w-full max-w-3xl border rounded-lg bg-white p-4"
      />
    </div>
  );
}
