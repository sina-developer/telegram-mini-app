import { PostCategory } from '@/enums';

export const getCategoryColor = (category: PostCategory) => {
  const colors: Record<
    PostCategory,
    | 'default'
    | 'primary'
    | 'secondary'
    | 'error'
    | 'info'
    | 'success'
    | 'warning'
  > = {
    [PostCategory.TECHNOLOGY]: 'primary',
    [PostCategory.LIFESTYLE]: 'secondary',
    [PostCategory.BUSINESS]: 'success',
    [PostCategory.HEALTH]: 'info',
  };
  return colors[category] || 'default';
};
