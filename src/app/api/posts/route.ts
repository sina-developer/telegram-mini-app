import { NextRequest, NextResponse } from 'next/server';

export enum PostCategory {
  TECHNOLOGY = 'Technology',
  LIFESTYLE = 'Lifestyle',
  TRAVEL = 'Travel',
  FOOD = 'Food',
  OTHER = 'Other',
}

interface Post {
  id: string;
  title: string;
  description: string;
  category: PostCategory;
  imageUrl?: string;
  createdAt: Date;
}

// Mock database - replace with your actual database
let posts: Post[] = [
  {
    id: '1',
    title: 'Getting Started with Next.js',
    description:
      'Learn how to build modern web applications with Next.js framework',
    category: PostCategory.TECHNOLOGY,
    imageUrl: 'https://placehold.co/600x400',
    createdAt: new Date(),
  },
  {
    id: '2',
    title: 'Best Travel Destinations 2024',
    description: 'Explore the most amazing places to visit this year',
    category: PostCategory.TRAVEL,
    createdAt: new Date(),
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
    errors.push('Title is required');
  } else if (body.title.length > 100) {
    errors.push('Title must be less than 100 characters');
  }

  if (!body.description) {
    errors.push('Description is required');
  } else if (body.description.length > 500) {
    errors.push('Description must be less than 500 characters');
  }

  if (!body.category || !Object.values(PostCategory).includes(body.category)) {
    errors.push('Valid category is required');
  }

  if (body.imageUrl && !isValidUrl(body.imageUrl)) {
    errors.push('Image URL must be a valid URL');
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
      id: Date.now().toString(),
      title: body.title,
      description: body.description,
      category: body.category,
      imageUrl: body.imageUrl,
      createdAt: new Date(),
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
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
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
