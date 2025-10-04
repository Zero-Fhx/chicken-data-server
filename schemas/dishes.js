import z from 'zod'

const dishSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  price: z.coerce.number().min(0, 'Price must be a positive number'),
  status: z.enum(['Active', 'Inactive']).optional().nullable()
})

export function ValidateDish (data) {
  return dishSchema.safeParse(data)
}

export function ValidatePartialDish (data) {
  return dishSchema.partial().safeParse(data)
}

export function ValidateDishId (data) {
  return z.object({
    id: z.coerce.number().min(1, 'Invalid ID')
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
