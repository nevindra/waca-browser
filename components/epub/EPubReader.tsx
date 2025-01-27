"use client";

import { FC, useState } from "react";
import { ReactReader } from "react-reader";

interface EPubReaderProps {
  url: string;
  title?: string;
}

export const EPubReader: FC<EPubReaderProps> = ({ url, title }) => {
  const [location, setLocation] = useState<string>("0");
  const [size, setSize] = useState<string>("100%");

  const locationChanged = (epubcifi: string) => {
    setLocation(epubcifi);
  };

  return (
    <div style={{ height: "100vh", position: "relative" }}>
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
        }}
      />
    </div>
  );
};
