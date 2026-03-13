import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const registerSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirm_password: z.string(),
}).refine((data) => data.password === data.confirm_password, {
  message: 'Passwords do not match',
  path: ['confirm_password'],
})

export const checkoutSchema = z.object({
  full_name: z.string().min(2, 'Name is required'),
  phone: z.string().min(7, 'Phone number is required'),
  address_line1: z.string().min(5, 'Address is required'),
  address_line2: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  postal_code: z.string().min(3, 'Postal code is required'),
  country: z.string().min(2, 'Country is required'),
  payment_method: z.enum(['cod', 'bank_transfer']),
})

export const productSchema = z.object({
  name: z.string().min(2, 'Product name is required'),
  short_description: z.string().min(10, 'Short description is required').max(200),
  full_description: z.string().min(20, 'Full description is required'),
  brand: z.string().optional(),
  price: z.coerce.number().positive('Price must be positive'),
  discount_price: z.coerce.number().positive().optional().nullable(),
  stock: z.coerce.number().int().min(0, 'Stock cannot be negative'),
  category_id: z.string().uuid('Please select a category').optional().nullable(),
  featured: z.boolean().default(false),
  is_active: z.boolean().default(true),
  fragrance_notes_top: z.string().optional(),
  fragrance_notes_middle: z.string().optional(),
  fragrance_notes_base: z.string().optional(),
  size_options: z.string().optional(),
})

export const categorySchema = z.object({
  name: z.string().min(2, 'Category name is required'),
  description: z.string().optional(),
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type CheckoutInput = z.infer<typeof checkoutSchema>
export type ProductInput = z.infer<typeof productSchema>
export type CategoryInput = z.infer<typeof categorySchema>
