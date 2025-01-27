import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface EPubToolbarProps {
  currentPage: number;
  totalPages: number;
  onPrevPage: () => void;
  onNextPage: () => void;
}

export const EPubToolbar = ({
  currentPage,
  totalPages,
  onPrevPage,
  onNextPage,
}: EPubToolbarProps) => (
  <div className="flex items-center gap-4">
    <Button variant="ghost" onClick={onPrevPage} disabled={currentPage <= 0}>
      <ChevronLeft className="h-4 w-4 mr-2" />
      Previous
    </Button>
    <span className="text-sm">
      Page {currentPage + 1} of {totalPages}
    </span>
    <Button
      variant="ghost"
      onClick={onNextPage}
      disabled={currentPage >= totalPages - 1}
    >
      Next
      <ChevronRight className="h-4 w-4 ml-2" />
    </Button>
  </div>
);
