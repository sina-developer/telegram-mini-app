export const POST_CONSTANTS = {
  TITLE_MAX_LENGTH: 100,
  DESCRIPTION_MAX_LENGTH: 500,
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_FILE_SIZE: 5000000, // 5MB
  ACCEPTED_IMAGE_TYPES: [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
  ] as const,
} as const;

export const POST_CATEGORIES = [
  { value: 'technology', label: 'Technology' },
  { value: 'lifestyle', label: 'Lifestyle' },
  { value: 'business', label: 'Business' },
  { value: 'health', label: 'Health' },
] as const;

export const POST_VALIDATION_MESSAGES = {
  TITLE_REQUIRED: 'Title is required',
  TITLE_TOO_LONG: 'Title must be less than 100 characters',
  DESCRIPTION_REQUIRED: 'Description is required',
  DESCRIPTION_TOO_LONG: 'Description must be less than 500 characters',
  CATEGORY_REQUIRED: 'Valid category is required',
  INVALID_IMAGE_URL: 'Image URL must be a valid URL',
  INVALID_FILE: 'Invalid file',
  FILE_TOO_LARGE: 'Max file size is 5MB',
  INVALID_FILE_TYPE: 'Only .jpg, .jpeg, .png and .webp formats are supported',
} as const;
