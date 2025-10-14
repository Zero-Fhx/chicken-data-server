import z from 'zod'

const categorySchema = z.object({
  name: z
    .string({ error: 'Name must be string' })
    .min(1, { error: 'Name is required' })
    .max(50, { error: 'Name must be 50 characters or less' }),
  description: z
    .string({ error: 'Description must be string' })
    .optional()
    .nullable(),
  status: z
    .enum(['Active', 'Inactive'], { error: 'Status must be either Active or Inactive' })
    .optional()
    .default('Active'),
})

export function ValidateCategory (data) {
  return categorySchema.safeParse(data)
}

export function ValidatePartialCategory (data) {
  return categorySchema.partial().safeParse(data)
}

export function ValidateCategoryId (data) {
  return z.object({
    id: z.coerce
      .number({ error: 'ID must be a number' })
      .min(1, { error: 'Invalid ID' }),
  }).safeParse(data)
}
