import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export interface ReaderToolbarProps {
  bookTitle: string;
  children?: React.ReactNode;
}

export const ReaderToolbar = ({ bookTitle, children }: ReaderToolbarProps) => (
  <div className="fixed top-0 left-0 right-0 z-10 bg-white/80 backdrop-blur-sm border-b py-3 mb-16">
    <div className="flex items-center justify-between px-4 py-2">
      <div className="flex items-center gap-4">
        <Link href="/">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-md font-medium truncate max-w-[50vw]">
          {bookTitle}
        </h1>
      </div>

      <div className="flex items-center gap-4">{children}</div>
    </div>
  </div>
);
