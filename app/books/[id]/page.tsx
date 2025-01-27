"use client";

import { useEffect, useState, use } from "react";
import { PDFReader } from "@/components/readers/pdf-reader";
import { EPubReader } from "@/lib/epub/view";

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
    <div className="min-h-screen bg-background">
      <div className="h-screen">
        {book.type === "pdf" ? (
          <PDFReader url={book.url} title={book.title} />
        ) : (
          <EPubReader url={book.url} title={book.title} />
        )}
      </div>
    </div>
  );
}
