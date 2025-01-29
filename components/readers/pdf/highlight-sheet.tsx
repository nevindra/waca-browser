import { ToolbarSheet } from "../shared/toolbar-sheet";
import { Button } from "@/components/ui/button";
import { NotebookTextIcon } from "lucide-react";
import { SearchResult } from "./types";
import { HighlightCard } from "../shared/highlight-card";

interface HighlightSheetProps {
  highlights: SearchResult[];
  onRemoveHighlight: (index: number) => void;
}

export function HighlightSheet({
  highlights,
  onRemoveHighlight,
}: HighlightSheetProps) {
  return (
    <ToolbarSheet
      title="Highlights"
      trigger={
        <Button variant="ghost" size="icon" title="View highlights">
          <NotebookTextIcon className="h-4 w-4" />
        </Button>
      }
    >
      <div className="mt-4 space-y-4">
        {highlights.length === 0 ? (
          <p className="text-sm text-gray-500 text-center">No highlights yet</p>
        ) : (
          <div className="space-y-4">
            {highlights.map((highlight, index) => (
              <HighlightCard
                key={`${highlight.pageIndex}-${index}`}
                text={highlight.text}
                pageInfo={`Page ${highlight.pageIndex}`}
                onDelete={() => onRemoveHighlight(index)}
              />
            ))}
          </div>
        )}
      </div>
    </ToolbarSheet>
  );
}
