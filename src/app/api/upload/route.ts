import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { POST_CONSTANTS } from '@/constants';

type AcceptedImageType = (typeof POST_CONSTANTS.ACCEPTED_IMAGE_TYPES)[number];

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

    if (
      !POST_CONSTANTS.ACCEPTED_IMAGE_TYPES.includes(
        file.type as AcceptedImageType
      )
    ) {
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

    // Upload to Vercel Blob
    const { url } = await put(filename, file, {
      access: 'public',
      addRandomSuffix: true, // Adds a random suffix to prevent naming conflicts
    });

    return NextResponse.json({ imageUrl: url }, { status: 201 });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}
