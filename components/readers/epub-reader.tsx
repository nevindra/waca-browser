"use client";

import { FC, useState, useEffect } from "react";
import { ReactReader, ReactReaderStyle } from "react-reader";
import type { Rendition } from "epubjs";
import { ReaderToolbar } from "./shared/reader-toolbar";
import { EPubToolbar } from "./epub/epub-toolbar";
import { useTextSelection } from "@/hooks/use-text-selection";
import { useTheme } from "next-themes";

type ITheme = "light" | "dark";

function updateTheme(rendition: Rendition, theme: ITheme) {
  const themes = rendition.themes;
  themes.default({
    body: {
      color: theme === "dark" ? "#cdd6f4" : "#4c4f69", // Text color
      background: theme === "dark" ? "#1e1e2e" : "#eff1f5", // Background color
    },
    "::selection": {
      background: theme === "dark" ? "#89b4fa80" : "#7287fd80",
    },
  });
  themes.select(theme);
}

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
  const { theme } = useTheme();
  const currentTheme = (theme as ITheme) || "light";

  useEffect(() => {
    if (rendition) {
      updateTheme(rendition, currentTheme);
    }
  }, [currentTheme, rendition]);

  const { currentSelection } = useTextSelection(rendition);

  const locationChanged = (epubcifi: string) => {
    setLocation(epubcifi);
  };

  return (
    <div className="relative flex flex-col h-screen space-y-2">
      <ReaderToolbar bookTitle={title || ""}>
        <div className="flex items-center gap-4">
          <EPubToolbar
            currentSelection={currentSelection}
            selections={selections}
            rendition={rendition}
          />
        </div>
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
        readerStyles={
          currentTheme === "dark" ? darkReaderTheme : lightReaderTheme
        }
        getRendition={(_rendition: Rendition) => {
          updateTheme(_rendition, currentTheme);
          setRendition(_rendition);
        }}
      />
    </div>
  );
};

const lightReaderTheme = {
  ...ReactReaderStyle,
  arrow: {
    ...ReactReaderStyle.arrow,
    color: "#4c4f69",
  },
  arrowHover: {
    ...ReactReaderStyle.arrowHover,
    color: "#7287fd",
  },
  readerArea: {
    ...ReactReaderStyle.readerArea,
    backgroundColor: "#eff1f5",
    transition: undefined,
  },
  titleArea: {
    ...ReactReaderStyle.titleArea,
    color: "#4c4f69",
    display: "none",
  },
  tocArea: {
    ...ReactReaderStyle.tocArea,
    background: "#e6e9ef",
  },
  tocButtonExpanded: {
    ...ReactReaderStyle.tocButtonExpanded,
    background: "#ccd0da",
  },
  tocButtonBar: {
    ...ReactReaderStyle.tocButtonBar,
    background: "#4c4f69",
  },
  tocButton: {
    ...ReactReaderStyle.tocButton,
    color: "#4c4f69",
  },
};

const darkReaderTheme = {
  ...ReactReaderStyle,
  arrow: {
    ...ReactReaderStyle.arrow,
    color: "#cdd6f4",
  },
  arrowHover: {
    ...ReactReaderStyle.arrowHover,
    color: "#a6adc8",
  },
  readerArea: {
    ...ReactReaderStyle.readerArea,
    backgroundColor: "#1e1e2e",
    transition: undefined,
  },
  titleArea: {
    ...ReactReaderStyle.titleArea,
    color: "#a6adc8",
    display: "none",
  },
  tocArea: {
    ...ReactReaderStyle.tocArea,
    background: "#181825",
  },
  tocButtonExpanded: {
    ...ReactReaderStyle.tocButtonExpanded,
    background: "#313244",
  },
  tocButtonBar: {
    ...ReactReaderStyle.tocButtonBar,
    background: "#cdd6f4",
  },
  tocButton: {
    ...ReactReaderStyle.tocButton,
    color: "#cdd6f4",
  },
};
