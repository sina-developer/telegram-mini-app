import { FormCategory } from '@/types';

export const FORM_CATEGORIES: FormCategory[] = [
  { value: 'technology', label: 'Technology' },
  { value: 'lifestyle', label: 'Lifestyle' },
  { value: 'business', label: 'Business' },
  { value: 'health', label: 'Health' },
] as const;

export const FORM_IMAGE = {
  MAX_FILE_SIZE: 5000000, // 5MB
  ACCEPTED_TYPES: [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
  ] as const,
} as const;
