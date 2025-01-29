import { useState, useEffect } from "react";
import type { Rendition } from "epubjs";

interface TextSelection {
  text: string;
  cfiRange: string;
}

export function useTextSelection(rendition?: Rendition) {
  const [currentSelection, setCurrentSelection] =
    useState<TextSelection | null>(null);

  useEffect(() => {
    if (rendition) {
      const handleSelectionChange = () => {
        const selection = window.getSelection();

        if (selection && !selection.isCollapsed) {
          const cfiRange = rendition.getRange(selection);
          const selectedText = selection.toString();
          setCurrentSelection({ text: selectedText, cfiRange });
        } else {
          setCurrentSelection(null);
        }
      };

      document.addEventListener("selectionchange", handleSelectionChange);
      rendition.on("selected", (cfiRange) => {
        const selectedText = rendition.getRange(cfiRange).toString();
        setCurrentSelection({ text: selectedText, cfiRange });
      });

      return () => {
        document.removeEventListener("selectionchange", handleSelectionChange);
        rendition.off("selected", () => {});
      };
    }
  }, [rendition]);

  return {
    currentSelection,
  };
}
