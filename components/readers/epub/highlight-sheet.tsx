"use client";

import { Button } from "@/components/ui/button";
import { List, Sparkles, TextSearch, MoreVertical } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Rendition } from "epubjs";

interface TextSelection {
  text: string;
  cfiRange: string;
}

interface HighlightSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  highlights: TextSelection[];
  rendition?: Rendition;
  onRemoveHighlight: (cfiRange: string) => void;
}

export const HighlightSheet = ({
  isOpen,
  onOpenChange,
  highlights,
  rendition,
  onRemoveHighlight,
}: HighlightSheetProps) => {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" title="View highlights">
          <List className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent className="backdrop-blur-xl bg-white/80 border-l shadow-2xl transition-transform duration-300 ease-in-out">
        <SheetHeader className="space-y-4 mb-8">
          <SheetTitle className="text-2xl font-semibold tracking-tight">
            Highlights
          </SheetTitle>
          <SheetDescription className="text-base text-gray-500">
            View and manage your highlights
          </SheetDescription>
        </SheetHeader>
        <div className="space-y-4 pr-2">
          {highlights.map(({ text, cfiRange }, i) => (
            <Card
              key={i}
              className="group transition-all duration-200 hover:shadow-md relative"
            >
              <CardContent className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <p className="text-base leading-relaxed text-gray-700">
                    {text}
                  </p>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        title="More options"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem className="cursor-pointer">
                        Add Note
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer">
                        View Notes
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="cursor-pointer text-red-500 hover:text-red-600"
                        onClick={() => onRemoveHighlight(cfiRange)}
                      >
                        Delete Highlight
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="flex items-center gap-4">
                  <Button
                    className="bg-blue-500 hover:bg-blue-600 text-white transition-colors duration-200"
                    size="sm"
                  >
                    <Sparkles className="h-4 w-4 mr-2" /> Explain with AI
                  </Button>
                  <Button
                    className="border border-gray-200 hover:bg-gray-50 text-gray-700 transition-colors duration-200"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      rendition?.display(cfiRange);
                      onOpenChange(false);
                    }}
                  >
                    <TextSearch className="h-4 w-4 mr-2" /> Find in Book
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};
