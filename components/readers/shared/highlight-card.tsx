"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MoreVertical, Sparkles, TextSearch } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HighlightCardProps {
  text: string;
  pageInfo: string;
  onDelete: () => void;
  onGoToHighlight?: () => void;
}

export function HighlightCard({
  text,
  pageInfo,
  onDelete,
  onGoToHighlight,
}: HighlightCardProps) {
  return (
    <Card className="group transition-all duration-200 hover:shadow-md relative">
      <CardContent className="p-6 space-y-4">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground">{pageInfo}</div>
            <p className="text-base leading-relaxed text-foreground">{text}</p>
          </div>
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
                onClick={onDelete}
              >
                Delete Highlight
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center gap-4">
          <Button
            className="bg-primary hover:bg-primary/90 text-primary-foreground transition-colors duration-200"
            size="sm"
          >
            <Sparkles className="h-4 w-4 mr-2" /> Explain with AI
          </Button>
          {onGoToHighlight && (
            <Button
              className="border border-input hover:bg-accent text-foreground transition-colors duration-200"
              variant="outline"
              size="sm"
              onClick={onGoToHighlight}
            >
              <TextSearch className="h-4 w-4 mr-2" /> Find in Book
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
