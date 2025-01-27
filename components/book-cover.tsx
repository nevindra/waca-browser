"use client";

import { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { FileText, Book as BookIcon } from "lucide-react";
import { Book as EPub } from "epubjs";

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";

interface BookCoverProps {
  type: "pdf" | "epub";
  url: string;
  className?: string;
}

export function BookCover({ type, url, className = "" }: BookCoverProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [coverUrl, setCoverUrl] = useState<string | null>(null);

  useEffect(() => {
    if (type === "epub") {
      const loadEpubCover = async () => {
        try {
          const book = new EPub(url);
          await book.ready;
          const coverUrl = await book.coverUrl();
          if (coverUrl) {
            setCoverUrl(coverUrl);
            setError(false);
          } else {
            setError(true);
          }
        } catch (err) {
          console.error("Error loading EPUB cover:", err);
          setError(true);
        } finally {
          setIsLoading(false);
        }
      };

      loadEpubCover();
    }
  }, [type, url]);

  if (type === "pdf") {
    return (
      <div
        className={`relative aspect-[3/4] bg-muted/10 rounded-lg overflow-hidden ${className}`}
      >
        <Document
          file={url}
          loading={
            <FileText className="absolute inset-0 m-auto h-8 w-8 text-red-500 animate-pulse" />
          }
          error={
            <FileText className="absolute inset-0 m-auto h-8 w-8 text-red-500" />
          }
        >
          <Page
            pageNumber={1}
            width={300}
            renderTextLayer={false}
            renderAnnotationLayer={false}
            className="w-full h-full object-cover"
          />
        </Document>
      </div>
    );
  }

  return (
    <div
      className={`relative aspect-[3/4] bg-muted/10 rounded-lg flex items-center justify-center ${className}`}
    >
      {isLoading ? (
        <BookIcon className="h-8 w-8 text-blue-500 animate-pulse" />
      ) : error || !coverUrl ? (
        <BookIcon className="h-8 w-8 text-blue-500" />
      ) : (
        <img
          src={coverUrl}
          alt="Book cover"
          className="w-full h-full object-cover rounded-lg"
          onError={() => setError(true)}
        />
      )}
    </div>
  );
}
