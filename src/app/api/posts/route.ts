import { Post } from '@/types';
import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import jwt from 'jsonwebtoken';
import { PostCategory } from '@/enums';
import {
  JWT_SECRET,
  POST_CONSTANTS,
  POST_VALIDATION_MESSAGES,
} from '@/constants';

// Mock database - replace with your actual database
let posts: Post[] = [
  {
    id: 1,
    title: 'Getting Started with Next.js',
    description:
      'Learn how to build modern web applications with Next.js framework',
    category: PostCategory.TECHNOLOGY,
    imageUrl: 'https://placehold.co/600x400',
    userId: 1,
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    title: 'Best Travel Destinations 2024',
    description: 'Explore the most amazing places to visit this year',
    category: PostCategory.LIFESTYLE,
    userId: 1,
    createdAt: new Date().toISOString(),
  },
];

function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

function validatePost(body: any) {
  const errors: string[] = [];

  if (!body.title) {
    errors.push(POST_VALIDATION_MESSAGES.TITLE_REQUIRED);
  } else if (body.title.length > POST_CONSTANTS.TITLE_MAX_LENGTH) {
    errors.push(POST_VALIDATION_MESSAGES.TITLE_TOO_LONG);
  }

  if (!body.description) {
    errors.push(POST_VALIDATION_MESSAGES.DESCRIPTION_REQUIRED);
  } else if (body.description.length > POST_CONSTANTS.DESCRIPTION_MAX_LENGTH) {
    errors.push(POST_VALIDATION_MESSAGES.DESCRIPTION_TOO_LONG);
  }

  if (!body.category || !Object.values(PostCategory).includes(body.category)) {
    errors.push(POST_VALIDATION_MESSAGES.CATEGORY_REQUIRED);
  }

  if (body.imageUrl && !isValidUrl(body.imageUrl)) {
    errors.push(POST_VALIDATION_MESSAGES.INVALID_IMAGE_URL);
  }

  return errors;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validationErrors = validatePost(body);

    if (validationErrors.length > 0) {
      return NextResponse.json({ errors: validationErrors }, { status: 400 });
    }

    const newPost: Post = {
      id: posts.length + 1,
      title: body.title,
      description: body.description,
      category: body.category,
      imageUrl: body.imageUrl,
      userId: 1,
      createdAt: new Date().toISOString(),
    };

    posts.push(newPost);

    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(
      searchParams.get('page') || String(POST_CONSTANTS.DEFAULT_PAGE)
    );
    const limit = parseInt(
      searchParams.get('limit') || String(POST_CONSTANTS.DEFAULT_LIMIT)
    );
    const category = searchParams.get('category');

    let filteredPosts = posts;
    if (category) {
      filteredPosts = posts.filter((post) => post.category === category);
    }

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const paginatedPosts = filteredPosts.slice(startIndex, endIndex);
    const totalPosts = filteredPosts.length;
    const totalPages = Math.ceil(totalPosts / limit);

    return NextResponse.json({
      posts: paginatedPosts,
      pagination: {
        currentPage: page,
        totalPages,
        totalPosts,
        hasMore: endIndex < totalPosts,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}
