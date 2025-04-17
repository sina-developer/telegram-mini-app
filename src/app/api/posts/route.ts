import { NextRequest, NextResponse } from 'next/server';
import { PostCategory } from '@/enums';
import { POST_CONSTANTS, POST_VALIDATION_MESSAGES } from '@/constants';
import { addPost, getFilteredAndPaginatedPosts } from '@/storage/posts';

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

    const result = await getFilteredAndPaginatedPosts(
      page,
      limit,
      category || undefined
    );

    return NextResponse.json({
      posts: result.posts,
      pagination: {
        currentPage: page,
        totalPages: result.totalPages,
        totalPosts: result.totalPosts,
        hasMore: result.hasMore,
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

    const postData = {
      title: body.title,
      description: body.description,
      category: body.category as PostCategory,
      imageUrl: body.imageUrl,
      userId: 1,
    };

    const newPost = await addPost(postData);

    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.error('Failed to create post:', error);
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
}
