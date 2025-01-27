import { pdfjs } from "react-pdf";
import { SearchResult, TextItem } from "./types";

export const findTextPositionsInPage = async (
  page: pdfjs.PDFPageProxy,
  searchText: string
): Promise<SearchResult[]> => {
  const textContent = await page.getTextContent();
  const viewport = page.getViewport({ scale: 1.0 });

  const positions: SearchResult[] = [];
  const items = textContent.items.filter(
    (item): item is TextItem => "str" in item
  );

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const itemText = item.str.toLowerCase();
    const searchLower = searchText.toLowerCase();

    if (itemText.includes(searchLower)) {
      const startIndex = itemText.indexOf(searchLower);
      const transform = item.transform;

      // Calculate the width of text before the match
      const preMatchWidth =
        startIndex > 0 ? (item.width * startIndex) / itemText.length : 0;

      // Calculate the width of the matched text
      const matchWidth = (item.width * searchText.length) / itemText.length;

      // Get the text position in PDF coordinates
      const x = transform[4] + preMatchWidth;
      const y = transform[5];

      // Convert to viewport coordinates
      const [viewportX, viewportY] = viewport.convertToViewportPoint(x, y);

      // Calculate height based on font size and viewport scale
      const fontSize = Math.sqrt(
        transform[0] * transform[0] + transform[1] * transform[1]
      );
      const height = item.height || fontSize;

      // Adjust the vertical position slightly upward
      const adjustedY = viewportY - height;

      positions.push({
        pageIndex: page.pageNumber,
        text: item.str,
        startIndex,
        endIndex: startIndex + searchText.length,
        position: {
          left: viewportX,
          top: adjustedY,
          width: matchWidth,
          height: height,
        },
      });
    }
  }

  return positions;
};

export const searchInDocument = async (
  pdf: pdfjs.PDFDocumentProxy,
  searchQuery: string
): Promise<SearchResult[]> => {
  if (!searchQuery.trim()) return [];

  const results: SearchResult[] = [];
  const query = searchQuery.toLowerCase();

  for (let pageIndex = 1; pageIndex <= pdf.numPages; pageIndex++) {
    const page = await pdf.getPage(pageIndex);
    const positions = await findTextPositionsInPage(page, query);
    results.push(...positions);
  }

  return results;
};
