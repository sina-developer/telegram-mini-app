import { NextRequest, NextResponse } from 'next/server';
import { PostCategory } from '@/enums';
import { POST_CONSTANTS, POST_VALIDATION_MESSAGES } from '@/constants';
import { createClient } from 'redis';
import { Post } from '@/types';

const redis = createClient({
  url: process.env.REDIS_URL,
});

// Connect to Redis
redis.connect().catch(console.error);

function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

interface PostRequestBody {
  title?: string;
  description?: string;
  category?: string;
  imageUrl?: string;
}

function validatePost(body: PostRequestBody) {
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

  if (
    !body.category ||
    !Object.values(PostCategory).includes(body.category as PostCategory)
  ) {
    errors.push(POST_VALIDATION_MESSAGES.CATEGORY_REQUIRED);
  }

  if (body.imageUrl && !isValidUrl(body.imageUrl)) {
    errors.push(POST_VALIDATION_MESSAGES.INVALID_IMAGE_URL);
  }

  return errors;
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

    // Get all posts from Redis
    const postsStr = await redis.get('posts');
    const posts = postsStr ? (JSON.parse(postsStr) as Post[]) : [];

    // Filter by category if provided
    const filteredPosts = category
      ? posts.filter((post: Post) => post.category === category)
      : posts;

    // Calculate pagination
    const totalPosts = filteredPosts.length;
    const totalPages = Math.ceil(totalPosts / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    // Get paginated posts
    const paginatedPosts = filteredPosts.slice(startIndex, endIndex);

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
    console.error('Failed to fetch posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validationErrors = validatePost(body);

    if (validationErrors.length > 0) {
      return NextResponse.json({ errors: validationErrors }, { status: 400 });
    }

    // Get existing posts
    const postsStr = await redis.get('posts');
    const posts = postsStr ? (JSON.parse(postsStr) as Post[]) : [];

    // Create new post
    const newPost: Post = {
      id: posts.length > 0 ? Math.max(...posts.map((p: Post) => p.id)) + 1 : 1,
      title: body.title,
      description: body.description,
      category: body.category as PostCategory,
      imageUrl: body.imageUrl,
      userId: 1,
      createdAt: new Date().toISOString(),
    };

    // Add new post to array and save back to Redis
    posts.unshift(newPost);
    await redis.set('posts', JSON.stringify(posts));

    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.error('Failed to create post:', error);
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
}
