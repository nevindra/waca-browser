import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  ZoomIn,
  ZoomOut,
  ArrowLeft,
  List,
} from "lucide-react";
import Link from "next/link";

export interface ReaderToolbarProps {
  bookTitle: string;
  currentPage: number;
  totalPages: number | undefined;
  scale?: number;
  showZoom?: boolean;
  onPageChange: (newPage: number) => void;
  onScaleChange?: (newScale: number) => void;
  onToggleSearch?: () => void;
  onToggleToc?: () => void;
}

export const ReaderToolbar = ({
  bookTitle,
  currentPage,
  totalPages,
  scale = 1,
  showZoom = true,
  onPageChange,
  onScaleChange,
  onToggleSearch,
  onToggleToc,
}: ReaderToolbarProps) => (
  <div className="fixed top-0 left-0 right-0 z-10 bg-white/80 backdrop-blur-sm border-b py-3">
    <div className="flex items-center justify-between px-4 py-2">
      <div className="flex items-center gap-4">
        <Link href="/library">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-md font-medium truncate max-w-[50vw]">
          {bookTitle}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
            disabled={currentPage <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="min-w-[100px] text-center text-sm">
            Page {currentPage} of {totalPages ?? "?"}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              onPageChange(Math.min(currentPage + 1, totalPages ?? currentPage))
            }
            disabled={currentPage >= (totalPages ?? 1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2 border-l pl-4">
          {showZoom && onScaleChange && (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onScaleChange(Math.max(scale - 0.1, 0.5))}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="min-w-[60px] text-center text-sm">
                {Math.round(scale * 100)}%
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onScaleChange(Math.min(scale + 0.1, 2))}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
            </>
          )}
          {onToggleSearch && (
            <Button variant="ghost" size="icon" onClick={onToggleSearch}>
              <Search className="h-4 w-4" />
            </Button>
          )}
          {onToggleToc && (
            <Button variant="ghost" size="icon" onClick={onToggleToc}>
              <List className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  </div>
);
