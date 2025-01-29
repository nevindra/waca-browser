import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, ChevronLeft } from "lucide-react";
import { useState } from "react";

export interface TOCItem {
  title: string;
  pageNumber: number;
  href: string;
  children?: TOCItem[];
}

export interface TableOfContentsProps {
  isOpen: boolean;
  items: TOCItem[];
  onClose: () => void;
  onItemClick: (pageNumber: number, href: string) => void;
}

const TOCItemComponent = ({
  item,
  onItemClick,
  level = 0,
}: {
  item: TOCItem;
  onItemClick: (pageNumber: number, href: string) => void;
  level?: number;
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = item.children && item.children.length > 0;

  return (
    <div className="w-full">
      <button
        onClick={() => {
          onItemClick(item.pageNumber, item.href);
          if (hasChildren) setIsExpanded(!isExpanded);
        }}
        className={`w-full text-left px-4 py-2 hover:bg-accent flex items-center gap-2 text-sm ${
          level === 0 ? "font-medium" : ""
        }`}
        style={{ paddingLeft: `${level * 12 + 16}px` }}
      >
        {hasChildren && (
          <span className="text-muted-foreground">
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </span>
        )}
        <span className="flex-1 truncate text-foreground">{item.title}</span>
        <span className="text-muted-foreground text-xs">{item.pageNumber}</span>
      </button>
      {hasChildren && isExpanded && (
        <div>
          {item.children!.map((child, index) => (
            <TOCItemComponent
              key={`${child.title}-${index}`}
              item={child}
              onItemClick={onItemClick}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const TableOfContents = ({
  isOpen,
  items,
  onClose,
  onItemClick,
}: TableOfContentsProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed top-12 right-4 z-20 w-72 bg-background rounded-lg shadow-lg border border-border overflow-hidden">
      <div className="p-3 border-b border-border flex items-center justify-between">
        <h2 className="font-medium text-foreground">Table of Contents</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>
      <div className="max-h-[calc(100vh-12rem)] overflow-y-auto divide-y divide-border">
        {items.map((item, index) => (
          <TOCItemComponent
            key={`${item.title}-${index}`}
            item={item}
            onItemClick={onItemClick}
          />
        ))}
      </div>
    </div>
  );
};
