import { z } from 'zod';
import { FORM_IMAGE } from '../constants';

export const postSchema = z.object({
  imageUrl: z
    .string()
    .url('Please enter a valid URL')
    .optional()
    .or(z.literal('')),
  imageFile: z
    .any()
    .refine((file) => !file || file instanceof File, 'Invalid file')
    .refine(
      (file) => !file || file.size <= FORM_IMAGE.MAX_FILE_SIZE,
      'Max file size is 5MB'
    )
    .refine(
      (file) => !file || FORM_IMAGE.ACCEPTED_TYPES.includes(file.type),
      'Only .jpg, .jpeg, .png and .webp formats are supported'
    )
    .optional(),
  title: z
    .string()
    .min(1, 'Title is required')
    .max(100, 'Title must be less than 100 characters'),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(500, 'Description must be less than 500 characters'),
  category: z.enum(['technology', 'lifestyle', 'business', 'health'], {
    required_error: 'Please select a category',
  }),
});

export type PostFormData = z.infer<typeof postSchema>;
