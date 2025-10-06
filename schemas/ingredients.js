import z from 'zod'

const ingredientSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be 100 characters or less'),
  unit: z.string().min(1, 'Unit is required').max(20, 'Unit must be 20 characters or less'),
  categoryId: z.coerce.number().int().min(1, 'Invalid category ID').optional().default(1),
  status: z.enum(['Active', 'Inactive']).optional().nullable(),
  stock: z.coerce.number().min(0, 'Stock must be a positive number').optional().default(0),
  minimumStock: z.coerce.number().min(0, 'Minimum stock must be a positive number').optional().default(0)
})

export function ValidateIngredient (data) {
  return ingredientSchema.safeParse(data)
}

export function ValidatePartialIngredient (data) {
  return ingredientSchema.partial().safeParse(data)
}

export function ValidateIngredientId (data) {
  const id = z.coerce.number().min(1, 'Invalid ID')

  return z.object({ id }).safeParse(data)
}

export function ValidatePartialIdIngredient (data) {
  const validateId = ValidateIngredientId(data)
  if (!validateId.success) {
    return validateId
  }
  const validatePartial = ValidatePartialIngredient(data)
  return validatePartial
}
