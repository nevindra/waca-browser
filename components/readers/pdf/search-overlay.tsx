import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, ArrowRight, Loader2, X } from "lucide-react";
import { SearchResult } from "./types";
import { useDebounce } from "@uidotdev/usehooks";
import { useState, useEffect } from "react";

export interface SearchOverlayProps {
  isOpen: boolean;
  searchQuery: string;
  isSearching: boolean;
  searchResults: SearchResult[];
  currentSearchIndex: number;
  onClose: () => void;
  onSearch: (query: string) => void;
  onNavigate: (direction: "next" | "prev") => void;
  onResultClick: (index: number) => void;
}

export const SearchOverlay = ({
  isOpen,
  searchQuery,
  isSearching,
  searchResults,
  currentSearchIndex,
  onClose,
  onSearch,
  onNavigate,
  onResultClick,
}: SearchOverlayProps) => {
  if (!isOpen) return null;

  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const debouncedSearchQuery = useDebounce(localSearchQuery, 300);

  useEffect(() => {
    setLocalSearchQuery(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    if (debouncedSearchQuery !== searchQuery) {
      onSearch(debouncedSearchQuery);
    }
  }, [debouncedSearchQuery]);

  const renderSearchResult = (result: SearchResult, index: number) => {
    const preText = result.text.substring(
      0,
      result.text.indexOf(localSearchQuery)
    );
    const matchText = result.text.substring(
      result.text.indexOf(localSearchQuery),
      result.text.indexOf(localSearchQuery) + localSearchQuery.length
    );
    const postText = result.text.substring(
      result.text.indexOf(localSearchQuery) + localSearchQuery.length
    );

    return (
      <div
        key={`${result.pageIndex}-${index}-${result.startIndex}-${result.endIndex}-${result.text}`}
        className={`text-sm p-2 hover:bg-gray-50 cursor-pointer ${
          index === currentSearchIndex ? "bg-blue-50" : ""
        }`}
        onClick={() => onResultClick(index)}
      >
        <div className="text-xs text-gray-500 mb-1">
          Page {result.pageIndex}
        </div>
        <div>
          {preText}
          <span className="bg-yellow-200">{matchText}</span>
          {postText}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed top-12 right-4 z-20 w-80 bg-white rounded-lg shadow-lg border">
      <div className="p-3 border-b">
        <div className="flex items-center gap-2">
          <Input
            type="text"
            placeholder="Search in document..."
            value={localSearchQuery}
            onChange={(e) => setLocalSearchQuery(e.target.value)}
            className="flex-1"
          />
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="max-h-[400px] overflow-y-auto">
        {isSearching ? (
          <div className="flex items-center justify-center p-4 text-sm text-gray-500">
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            Searching...
          </div>
        ) : searchResults.length > 0 ? (
          <>
            <div className="flex items-center justify-between p-2 bg-gray-50 border-b">
              <span className="text-sm text-gray-500">
                {searchResults.length} results
              </span>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onNavigate("prev")}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onNavigate("next")}
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="divide-y">
              {searchResults.map((result, index) =>
                renderSearchResult(result, index)
              )}
            </div>
          </>
        ) : searchQuery && !isSearching ? (
          <div className="p-4 text-sm text-gray-500 text-center">
            No results found
          </div>
        ) : null}
      </div>
    </div>
  );
};
