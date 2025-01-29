"use client";

import { Button } from "@/components/ui/button";
import { NotebookTextIcon } from "lucide-react";
import { ToolbarSheet } from "../shared/toolbar-sheet";
import { HighlightCard } from "../shared/highlight-card";
import type { Rendition } from "epubjs";

interface TextSelection {
  text: string;
  cfiRange: string;
}

interface HighlightSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  highlights: TextSelection[];
  rendition?: Rendition;
  onRemoveHighlight: (cfiRange: string) => void;
}

export const HighlightSheet = ({
  isOpen,
  onOpenChange,
  highlights,
  rendition,
  onRemoveHighlight,
}: HighlightSheetProps) => {
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
            {highlights.map(({ text, cfiRange }, i) => (
              <HighlightCard
                key={i}
                text={text}
                pageInfo="Current Chapter"
                onDelete={() => onRemoveHighlight(cfiRange)}
                onGoToHighlight={() => {
                  rendition?.display(cfiRange);
                  onOpenChange(false);
                }}
              />
            ))}
          </div>
        )}
      </div>
    </ToolbarSheet>
  );
};
