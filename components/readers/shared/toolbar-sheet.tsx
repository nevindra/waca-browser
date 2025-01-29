import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ReactNode } from "react";

interface ToolbarSheetProps {
  title: string;
  trigger: ReactNode;
  children: ReactNode;
  side?: "left" | "right" | "top" | "bottom";
}

export function ToolbarSheet({
  title,
  trigger,
  children,
  side = "right",
}: ToolbarSheetProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent side={side} className="w-[400px]">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
        </SheetHeader>
        {children}
      </SheetContent>
    </Sheet>
  );
}
