import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { POST_CONSTANTS } from '@/constants';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    if (file.size > POST_CONSTANTS.MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File size exceeds 5MB limit' },
        { status: 400 }
      );
    }

    if (!POST_CONSTANTS.ACCEPTED_IMAGE_TYPES.includes(file.type as any)) {
      return NextResponse.json(
        {
          error: 'Invalid file type. Only jpg, jpeg, png, and webp are allowed',
        },
        { status: 400 }
      );
    }

    const timestamp = Date.now();
    const originalName = file.name.replace(/[^a-zA-Z0-9.]/g, '');
    const filename = `${timestamp}-${originalName}`;

    const uploadDir = join(process.cwd(), 'public', 'uploads');
    await writeFile(
      join(uploadDir, filename),
      Buffer.from(await file.arrayBuffer())
    );

    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    const host = request.headers.get('host') || 'localhost:3000';

    const imageUrl = `${protocol}://${host}/uploads/${filename}`;

    return NextResponse.json({ imageUrl }, { status: 201 });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}
