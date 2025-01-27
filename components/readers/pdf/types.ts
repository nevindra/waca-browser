export interface SearchResult {
  pageIndex: number;
  text: string;
  startIndex: number;
  endIndex: number;
  position?: {
    left: number;
    top: number;
    width: number;
    height: number;
  };
}

export interface TextItem {
  str: string;
  transform: number[];
  width: number;
  height?: number;
}
