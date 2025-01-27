import { NextRequest } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: { filename: string } }
) {
  try {
    const filename = params.filename;
    const filePath = path.join(process.cwd(), 'uploads', filename);
    
    const file = await readFile(filePath);
    
    const contentType = filename.endsWith('.pdf')
      ? 'application/pdf'
      : 'application/epub+zip';
    
    return new Response(file, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `inline; filename="${filename}"`,
      },
    });
  } catch (error) {
    return new Response('File not found', { status: 404 });
  }
}
