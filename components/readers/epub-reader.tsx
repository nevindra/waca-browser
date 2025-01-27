'use client';

import { useEffect, useRef, useState } from 'react';
import { Book as EPub } from 'epubjs';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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
        width: '100%',
        height: '600px',
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
    setCurrentPage(prev => prev + 1);
  };

  const goToPrevPage = () => {
    if (!book || currentPage <= 0) return;
    book.rendition.prev();
    setCurrentPage(prev => prev - 1);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          onClick={goToPrevPage}
          disabled={currentPage <= 0}
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        <span className="text-sm">
          Page {currentPage + 1} of {totalPages}
        </span>
        <Button
          variant="outline"
          onClick={goToNextPage}
          disabled={currentPage >= totalPages - 1}
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div 
        ref={viewerRef}
        className="w-full max-w-3xl border rounded-lg bg-white p-4"
      />
    </div>
  );
}
