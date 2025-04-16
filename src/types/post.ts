import { PostCategory, PostStatus, PostSortBy } from '@/enums';

export interface Post {
  id: number;
  title: string;
  description: string;
  category: PostCategory;
  status?: PostStatus;
  imageUrl?: string;
  userId: number;
  createdAt: string;
}

export interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalPosts: number;
  hasMore: boolean;
}

export type FormCategory = {
  value: string;
  label: string;
};

export interface PostFormData {
  title: string;
  description: string;
  category: PostCategory | '';
  status?: PostStatus;
  imageUrl?: string;
  imageFile?: File;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
  };
}

export interface PostQueryParams {
  page?: number;
  limit?: number;
  sortBy?: PostSortBy;
  category?: PostCategory;
  status?: PostStatus;
}

export type PostsResponse = PaginatedResponse<Post>;
