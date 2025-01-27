import { pdfjs } from "react-pdf";
import { SearchResult, TextItem } from "./types";

export const findTextPositionsInPage = async (
  page: pdfjs.PDFPageProxy,
  searchText: string
): Promise<SearchResult[]> => {
  const textContent = await page.getTextContent();
  const viewport = page.getViewport({ scale: 1.0 });
  
  const positions: SearchResult[] = [];
  const items = textContent.items.filter((item): item is TextItem => 'str' in item);
  
  // Process each text item individually
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const itemText = item.str.toLowerCase();
    const searchLower = searchText.toLowerCase();
    
    if (itemText.includes(searchLower)) {
      const startIndex = itemText.indexOf(searchLower);
      const charWidth = item.width / itemText.length;
      
      // Convert coordinates
      const [left, top] = viewport.convertToViewportPoint(
        item.transform[4] + (startIndex * charWidth),
        item.transform[5]
      );
      
      positions.push({
        pageIndex: page.pageNumber,
        text: item.str,
        startIndex,
        endIndex: startIndex + searchText.length,
        position: {
          left,
          top: viewport.height - top,
          width: charWidth * searchText.length,
          height: item.height || 12,
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

  // Search through each page
  for (let pageIndex = 1; pageIndex <= pdf.numPages; pageIndex++) {
    const page = await pdf.getPage(pageIndex);
    const positions = await findTextPositionsInPage(page, query);
    results.push(...positions);
  }

  return results;
};
