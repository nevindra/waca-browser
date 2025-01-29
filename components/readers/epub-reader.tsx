"use client";

import { FC, useState } from "react";
import { ReactReader } from "react-reader";
import type { Rendition } from "epubjs";
import { ReaderToolbar } from "./shared/reader-toolbar";
import { EPubToolbar } from "./epub/epub-toolbar";
import { useTextSelection } from "@/hooks/use-text-selection";

interface TextSelection {
  text: string;
  cfiRange: string;
}

interface EPubReaderProps {
  url: string;
  title?: string;
}

export const EPubReader: FC<EPubReaderProps> = ({ url, title }) => {
  const [location, setLocation] = useState<string>("0");
  const [selections, setSelections] = useState<TextSelection[]>([]);
  const [rendition, setRendition] = useState<Rendition | undefined>(undefined);

  const { currentSelection } = useTextSelection(rendition);

  const locationChanged = (epubcifi: string) => {
    setLocation(epubcifi);
  };

  return (
    <div className="relative flex flex-col h-screen space-y-2">
      <ReaderToolbar bookTitle={title || ""}>
        <EPubToolbar
          currentSelection={currentSelection}
          selections={selections}
          rendition={rendition}
        />
      </ReaderToolbar>
      <ReactReader
        url={url}
        title={title}
        location={location}
        locationChanged={locationChanged}
        showToc={true}
        epubInitOptions={{
          openAs: "epub",
        }}
        epubOptions={{
          flow: "paginated",
          manager: "continuous",
          allowScriptedContent: true,
          width: "100%",
          height: "100%",
        }}
        getRendition={(_rendition: Rendition) => {
          if (process.env.DEVELOPMENT === "true") {
            console.log("Rendition callback triggered");
          }
          _rendition.themes.default({
            "::selection": {
              background: "rgba(255,255,0,0.3)",
            },
          });
          setRendition(_rendition);
        }}
      />
    </div>
  );
};
