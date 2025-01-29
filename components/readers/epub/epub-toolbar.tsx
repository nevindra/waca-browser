"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Highlighter } from "lucide-react";
import type { Rendition } from "epubjs";
import { HighlightSheet } from "./highlight-sheet";

interface TextSelection {
  text: string;
  cfiRange: string;
}

interface EPubToolbarProps {
  currentSelection: TextSelection | null;
  selections: TextSelection[];
  rendition?: Rendition;
}

export const EPubToolbar = ({
  currentSelection,
  rendition,
}: EPubToolbarProps) => {
  const [isHighlightOpen, setIsHighlightOpen] = useState(false);
  const [highlights, setHighlights] = useState<TextSelection[]>([]);

  const handleAnnotate = () => {
    if (currentSelection && rendition) {
      const { cfiRange, text } = currentSelection;
      console.log("Annotating:", { cfiRange, text });
      setHighlights([...highlights, currentSelection]);
      rendition.annotations.add(
        "highlight",
        cfiRange,
        {},
        (e: MouseEvent) => {
          console.log("Highlight clicked:", { cfiRange, event: e });
        },
        "hl",
        {
          fill: "rgb(255, 255, 0)",
          "fill-opacity": "0.3",
          "mix-blend-mode": "multiply",
        }
      );

      const selection = window.getSelection();
      selection?.removeAllRanges();
    }
  };

  const removeHighlight = (cfiRange: string) => {
    rendition?.annotations.remove(cfiRange, "highlight");
    setHighlights(highlights.filter((h) => h.cfiRange !== cfiRange));
  };

  return (
    <>
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleAnnotate}
          disabled={!currentSelection}
          title="Highlight selected text"
        >
          <Highlighter className="h-4 w-4" />
        </Button>
        <HighlightSheet
          isOpen={isHighlightOpen}
          onOpenChange={setIsHighlightOpen}
          highlights={highlights}
          rendition={rendition}
          onRemoveHighlight={removeHighlight}
        />
      </div>
    </>
  );
};
