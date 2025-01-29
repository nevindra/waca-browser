"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { BookCover } from "@/components/book-cover";
import { uploadBook, getBooks, type Book } from "./actions";
import { useRef, useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

function formatFileSize(bytes: number): string {
  const units = ["B", "KB", "MB", "GB"];
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
    <main className="flex min-h-screen flex-col">
      <header className="flex h-14 bg-white rounded-lg shrink-0 items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="/">Library</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>Books</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>
      <div className="flex-1 bg-white px-6 pt-2 pb-4 md:px-8 md:pt-3 md:pb-6 lg:px-12 lg:pt-4 lg:pb-8">
        <header className="mb-6 md:mb-8">
          <h1 className="text-3xl md:text-4xl font-semibold mb-2">
            Your Library
          </h1>
          <p className="text-muted-foreground">
            Discover and manage your digital book collection
          </p>
        </header>

        <div className="grid gap-6 md:gap-8 rounded-lg">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="space-y-1">
              <h2 className="text-xl md:text-2xl font-medium">Recent Books</h2>
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
                  <Upload className="h-4 w-4 mr-2" />
                  {isUploading ? "Uploading..." : "Upload Books"}
                </label>
              </Button>
            </form>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {books.length === 0 ? (
              <div className="col-span-full flex flex-col items-center justify-center p-8 md:p-12 border-2 border-dashed rounded-lg border-muted">
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
                  Upload your first book to get started with your digital
                  library
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
                  className="group relative flex flex-col space-y-2 rounded-lg border p-4 md:p-6 hover:bg-accent transition-colors"
                >
                  <div className="flex flex-col space-y-4">
                    <BookCover
                      type={book.type}
                      url={`/api/uploads/${book.filename}`}
                      className="w-full aspect-[3/4]"
                    />
                    <div className="space-y-1">
                      <h3 className="font-medium leading-none line-clamp-1">
                        {book.filename}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {formatFileSize(book.size)}
                      </p>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Added{" "}
                    {formatDistanceToNow(book.createdAt, { addSuffix: true })}
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
      <Toaster />
    </main>
  );
}
