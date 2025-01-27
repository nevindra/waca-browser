"use server";

import { revalidatePath } from "next/cache";
import { writeFile, mkdir, readdir, stat } from "fs/promises";
import path from "path";

export type Book = {
  filename: string;
  path: string;
  size: number;
  createdAt: Date;
  type: 'pdf' | 'epub';
}

export async function getBooks(): Promise<Book[]> {
  try {
    const uploadDir = path.join(process.cwd(), "uploads");
    
    // Create directory if it doesn't exist
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (error) {
      // Ignore if directory exists
    }

    const files = await readdir(uploadDir);
    const books: Book[] = [];

    for (const file of files) {
      if (file.endsWith('.pdf') || file.endsWith('.epub')) {
        const filePath = path.join(uploadDir, file);
        const stats = await stat(filePath);
        
        books.push({
          filename: file,
          path: filePath,
          size: stats.size,
          createdAt: stats.birthtime,
          type: file.endsWith('.pdf') ? 'pdf' : 'epub'
        });
      }
    }

    return books.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  } catch (error) {
    console.error("Error getting books:", error);
    return [];
  }
}

export async function uploadBook(formData: FormData) {
  try {
    const file = formData.get("file") as File;
    console.log(file);
    if (!file) {
      throw new Error("No file uploaded");
    }

    // Validate file type
    const allowedTypes = ["application/pdf", "application/epub+zip"];
    if (!allowedTypes.includes(file.type)) {
      throw new Error("Only PDF and EPUB files are allowed");
    }

    // Convert the file to a buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Create uploads directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), "uploads");
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (error) {
      // Ignore error if directory already exists
    }

    // Create a unique filename
    const filename = `${Date.now()}-${file.name}`;
    const filepath = path.join(uploadDir, filename);

    // Save the file
    await writeFile(filepath, buffer);

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Upload error:", error);
    return { error: (error as Error).message };
  }
}
