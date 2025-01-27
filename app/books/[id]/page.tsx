"use client";

import { useEffect, useState, use } from "react";
import { PDFReader } from "@/components/readers/pdf-reader";
import { EPubReader } from "@/components/readers/epub-reader";

interface BookPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function BookPage({ params }: BookPageProps) {
  const resolvedParams = use(params);
  const [book, setBook] = useState<{
    filename: string;
    type: "pdf" | "epub";
    url: string;
    title: string;
  } | null>(null);

  useEffect(() => {
    if (!resolvedParams?.id) return;

    const filename = decodeURIComponent(resolvedParams.id);
    const type = filename.endsWith(".pdf") ? "pdf" : "epub";
    const url = `/api/uploads/${filename}`;
    const title = filename.replace(/\.[^/.]+$/, ""); // Remove file extension
    setBook({ filename, type, url, title });
  }, [resolvedParams?.id]);

  if (!book) return null;

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-muted/50 rounded-lg p-6">
          {book.type === "pdf" ? (
            <PDFReader url={book.url} title={book.title} />
          ) : (
            <EPubReader url={book.url} />
          )}
        </div>
      </div>
    </div>
  );
}
