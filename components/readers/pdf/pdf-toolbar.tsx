import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, List, ZoomIn, ZoomOut, Highlighter } from "lucide-react";

interface PDFToolbarProps {
  currentPage: number;
  totalPages?: number;
  scale: number;
  selectedText: string | null;
  onPageChange: (page: number) => void;
  onScaleChange: (scale: number) => void;
  onToggleSearch: () => void;
  onToggleToc: () => void;
  onHighlight: () => void;
}

export const PDFToolbar = ({
  currentPage,
  totalPages,
  scale,
  selectedText,
  onPageChange,
  onScaleChange,
  onToggleSearch,
  onToggleToc,
  onHighlight,
}: PDFToolbarProps) => {
  const handlePageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const page = parseInt(e.target.value);
    if (!isNaN(page) && page >= 1 && page <= (totalPages || 1)) {
      onPageChange(page);
    }
  };

  return (
    <div className="flex items-center gap-4 text-foreground">
      <div className="flex items-center gap-2">
        <Input
          type="number"
          min={1}
          max={totalPages}
          value={currentPage}
          onChange={handlePageChange}
          className="w-16 h-8 px-2 border rounded text-sm bg-background"
        />
        <span className="text-sm text-muted-foreground">
          of {totalPages || "?"}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onScaleChange(scale - 0.1)}
          disabled={scale <= 0.5}
          className="hover:bg-accent"
        >
          <ZoomOut className="h-5 w-5" />
        </Button>
        <span className="text-sm w-16 text-center">
          {Math.round(scale * 100)}%
        </span>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onScaleChange(scale + 0.1)}
          disabled={scale >= 2}
          className="hover:bg-accent"
        >
          <ZoomIn className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSearch}
          className="hover:bg-accent"
        >
          <Search className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleToc}
          className="hover:bg-accent"
        >
          <List className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onHighlight}
          disabled={!selectedText}
          title="Highlight selected text"
          className="hover:bg-accent"
        >
          <Highlighter className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};
