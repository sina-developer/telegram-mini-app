import fs from 'fs/promises';
import path from 'path';
import { Post } from '@/types';

const postsFilePath = path.join(process.cwd(), 'src/storage/posts.json');

interface PostsData {
  posts: Post[];
}

export async function getAllPosts(): Promise<Post[]> {
  try {
    const jsonData = await fs.readFile(postsFilePath, 'utf-8');
    const data: PostsData = JSON.parse(jsonData);
    return data.posts;
  } catch (error) {
    console.error('Error reading posts:', error);
    return [];
  }
}

export async function addPost(
  post: Omit<Post, 'id' | 'createdAt'>
): Promise<Post> {
  try {
    const jsonData = await fs.readFile(postsFilePath, 'utf-8');
    const data: PostsData = JSON.parse(jsonData);

    const newPost: Post = {
      ...post,
      id:
        data.posts.length > 0
          ? Math.max(...data.posts.map((p) => p.id)) + 1
          : 1,
      createdAt: new Date().toISOString(),
    };

    data.posts.push(newPost);

    await fs.writeFile(postsFilePath, JSON.stringify(data, null, 2));
    return newPost;
  } catch (error) {
    console.error('Error adding post:', error);
    throw new Error('Failed to add post');
  }
}

export async function getFilteredAndPaginatedPosts(
  page: number,
  limit: number,
  category?: string
): Promise<{
  posts: Post[];
  totalPosts: number;
  totalPages: number;
  hasMore: boolean;
}> {
  try {
    let posts = await getAllPosts();

    if (category) {
      posts = posts.filter((post) => post.category === category);
    }

    posts.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedPosts = posts.slice(startIndex, endIndex);
    const totalPosts = posts.length;
    const totalPages = Math.ceil(totalPosts / limit);

    return {
      posts: paginatedPosts,
      totalPosts,
      totalPages,
      hasMore: endIndex < totalPosts,
    };
  } catch (error) {
    console.error('Error getting filtered posts:', error);
    throw new Error('Failed to get posts');
  }
}
