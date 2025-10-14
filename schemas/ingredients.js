import z from 'zod'

const ingredientSchema = z.object({
  name: z
    .string({ error: 'Name must be string' })
    .min(1, { error: 'Name is required' })
    .max(100, { error: 'Name must be 100 characters or less' }),
  unit: z
    .string({ error: 'Unit must be string' })
    .min(1, { error: 'Unit is required' })
    .max(20, { error: 'Unit must be 20 characters or less' }),
  categoryId: z.coerce
    .number({ error: 'Category ID must be a number' })
    .int({ error: 'Category ID must be an integer' })
    .min(1, { error: 'Invalid category ID' })
    .optional()
    .default(1),
  status: z
    .enum(['Active', 'Inactive'], { error: 'Status must be either Active or Inactive' })
    .optional()
    .default('Active'),
  stock: z.coerce
    .number({ error: 'Stock must be a number' })
    .min(0, { error: 'Stock must be a positive number' })
    .optional()
    .default(0),
  minimumStock: z.coerce
    .number({ error: 'Minimum stock must be a number' })
    .min(0, { error: 'Minimum stock must be a positive number' })
    .optional()
    .default(0),
})

export function ValidateIngredient (data) {
  return ingredientSchema.safeParse(data)
}

export function ValidatePartialIngredient (data) {
  return ingredientSchema.partial().safeParse(data)
}

export function ValidateIngredientId (data) {
  return z.object({
    id: z.coerce
      .number({ error: 'ID must be a number' })
      .min(1, { error: 'Invalid ID' }),
  }).safeParse(data)
}

export function ValidatePartialIdIngredient (data) {
  const validateId = ValidateIngredientId(data)
  if (!validateId.success) {
    return validateId
  }
  const validatePartial = ValidatePartialIngredient(data)
  return validatePartial
}
