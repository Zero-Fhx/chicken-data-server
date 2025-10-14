import z from 'zod'

const dishSchema = z.object({
  name: z
    .string({ error: 'Name must be string' })
    .min(1, { error: 'Name is required' }),
  description: z
    .string({ error: 'Description must be string' })
    .optional()
    .nullable(),
  categoryId: z.coerce
    .number({ error: 'Category ID must be a number' })
    .int({ error: 'Category ID must be an integer' })
    .min(1, { error: 'Invalid category ID' })
    .optional()
    .default(1),
  price: z.coerce
    .number({ error: 'Price must be a number' })
    .min(0, { error: 'Price must be a positive number' }),
  status: z
    .enum(['Active', 'Inactive'], { error: 'Status must be either Active or Inactive' })
    .optional()
    .default('Active'),
})

export function ValidateDish (data) {
  return dishSchema.safeParse(data)
}

export function ValidatePartialDish (data) {
  return dishSchema.partial().safeParse(data)
}

export function ValidateDishId (data) {
  return z.object({
    id: z.coerce
      .number({ error: 'ID must be a number' })
      .min(1, { error: 'Invalid ID' }),
  }).safeParse(data)
}

export function ValidatePartialIdDish (data) {
  const validateId = ValidateDishId(data)
  if (!validateId.success) {
    return validateId
  }
  const validatePartial = ValidatePartialDish(data)
  return validatePartial
}
