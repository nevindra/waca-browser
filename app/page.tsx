"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Upload, FileText, Book as BookIcon } from "lucide-react";
import { uploadBook, getBooks, type Book } from "./actions";
import { useRef, useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

function formatFileSize(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(1)} ${units[unitIndex]}`;
}

export default function Home() {
  const [isUploading, setIsUploading] = useState(false);
  const [books, setBooks] = useState<Book[]>([]);
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();

  async function loadBooks() {
    const bookList = await getBooks();
    setBooks(bookList);
  }

  useEffect(() => {
    loadBooks();
  }, []);

  async function handleSubmit(formData: FormData) {
    try {
      setIsUploading(true);
      const result = await uploadBook(formData);
      
      if (result?.error) {
        toast({
          variant: "destructive",
          title: "Upload failed",
          description: result.error,
        });
        return;
      }

      toast({
        title: "Upload Successful",
        description: "Book uploaded successfully",
        variant: "success",
      });
      
      // Reset the form and reload books
      formRef.current?.reset();
      loadBooks();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: "Something went wrong while uploading the book",
      });
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background p-8 md:p-12 lg:p-16">
      <Toaster />
      <header className="mb-12">
        <h1 className="text-4xl font-semibold mb-2">Your Library</h1>
        <p className="text-muted-foreground">
          Discover and manage your digital book collection
        </p>
      </header>

      <div className="grid gap-8">
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <h2 className="text-2xl font-medium">Recent Books</h2>
            <p className="text-sm text-muted-foreground">
              Continue where you left off
            </p>
          </div>
          <form
            ref={formRef}
            action={async (formData: FormData) => {
              await handleSubmit(formData);
            }}
          >
            <input
              type="file"
              name="file"
              accept=".pdf,.epub"
              className="hidden"
              id="book-upload"
              onChange={(e) => {
                if (e.target.files?.length) {
                  const form = e.target.form;
                  if (form) {
                    const formData = new FormData(form);
                    form.requestSubmit();
                  }
                }
              }}
            />
            <Button asChild disabled={isUploading}>
              <label htmlFor="book-upload" className="cursor-pointer">
                <Upload className="h-5 w-5 mr-2" />
                {isUploading ? "Uploading..." : "Upload Books"}
              </label>
            </Button>
          </form>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {books.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-lg border-muted">
              <div className="mb-4 rounded-full bg-muted/10 p-3">
                <Image
                  src="/book-open.svg"
                  alt="Book icon"
                  width={24}
                  height={24}
                  className="opacity-75"
                />
              </div>
              <h3 className="text-lg font-medium mb-2">No books yet</h3>
              <p className="text-sm text-muted-foreground text-center mb-4">
                Upload your first book to get started with your digital library
              </p>
              <label htmlFor="book-upload">
                <Button variant="outline" asChild disabled={isUploading}>
                  <span>Browse Files</span>
                </Button>
              </label>
            </div>
          ) : (
            books.map((book) => (
              <Link
                key={book.path}
                href={`/books/${encodeURIComponent(book.filename)}`}
                className="group relative flex flex-col space-y-2 rounded-lg border p-6 hover:bg-accent transition-colors"
              >
                <div className="flex items-center space-x-4">
                  {book.type === 'pdf' ? (
                    <FileText className="h-10 w-10 text-red-500" />
                  ) : (
                    <BookIcon className="h-10 w-10 text-blue-500" />
                  )}
                  <div className="space-y-1">
                    <h3 className="font-medium leading-none line-clamp-1">{book.filename}</h3>
                    <p className="text-sm text-muted-foreground">
                      {formatFileSize(book.size)}
                    </p>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  Added {formatDistanceToNow(book.createdAt, { addSuffix: true })}
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
