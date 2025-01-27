import { Button } from "@/components/ui/button";
import { Search, List, ZoomIn, ZoomOut } from "lucide-react";
import { ScrollText, ArrowLeftRight } from "lucide-react";
interface PDFToolbarProps {
  currentPage: number;
  totalPages?: number;
  scale: number;
  onPageChange: (page: number) => void;
  onScaleChange: (scale: number) => void;
  onToggleSearch: () => void;
  onToggleToc: () => void;
  infiniteScroll?: boolean;
  onInfiniteScrollChange?: (enabled: boolean) => void;
}

export const PDFToolbar = ({
  currentPage,
  totalPages,
  scale,
  onPageChange,
  onScaleChange,
  onToggleSearch,
  onToggleToc,
  infiniteScroll = true,
  onInfiniteScrollChange,
}: PDFToolbarProps) => {
  const handlePageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const page = parseInt(e.target.value);
    if (!isNaN(page) && page >= 1 && page <= (totalPages || 1)) {
      onPageChange(page);
    }
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <input
          type="number"
          min={1}
          max={totalPages}
          value={currentPage}
          onChange={handlePageChange}
          className="w-16 h-8 px-2 border rounded text-sm"
        />
        <span className="text-sm text-gray-500">of {totalPages || "?"}</span>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onScaleChange(scale - 0.1)}
          disabled={scale <= 0.5}
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <span className="text-sm w-16 text-center">
          {Math.round(scale * 100)}%
        </span>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onScaleChange(scale + 0.1)}
          disabled={scale >= 2}
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onInfiniteScrollChange?.(!infiniteScroll)}
          title={
            infiniteScroll
              ? "Switch to page-by-page"
              : "Switch to infinite scroll"
          }
        >
          {infiniteScroll ? (
            <ScrollText className="h-4 w-4" />
          ) : (
            <ArrowLeftRight className="h-4 w-4" />
          )}
        </Button>
        <Button variant="ghost" size="icon" onClick={onToggleSearch}>
          <Search className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={onToggleToc}>
          <List className="h-4 w-4" />
        </Button>
      </div>
    </>
  );
};
