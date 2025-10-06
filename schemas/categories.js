import z from 'zod'

const categorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Name must be 50 characters or less'),
  description: z.string().optional().nullable(),
  status: z.enum(['Active', 'Inactive']).optional().nullable()
})

export function ValidateCategory (data) {
  return categorySchema.safeParse(data)
}

export function ValidatePartialCategory (data) {
  return categorySchema.partial().safeParse(data)
}

export function ValidateCategoryId (data) {
  return z.object({
    id: z.coerce.number().min(1, 'Invalid ID')
  }).safeParse(data)
}
