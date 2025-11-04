import z from 'zod'

const saleDetailSchema = z.object({
  dishId: z.coerce
    .number({ error: 'Dish ID must be a number' })
    .int({ error: 'Dish ID must be an integer' })
    .min(1, { error: 'Dish ID must be a positive number' }),
  quantity: z.coerce
    .number({ error: 'Quantity must be a number' })
    .min(1, { error: 'Quantity must be at least 1' }),
  unitPrice: z.coerce
    .number({ error: 'Unit price must be a number' })
    .min(0, { error: 'Unit price must be a positive number' }),
  discount: z.coerce
    .number({ error: 'Discount must be a number' })
    .min(0, { error: 'Discount must be a positive number' })
    .optional()
    .default(0),
})

const saleSchema = z.object({
  saleDate: z
    .iso.date({ error: 'Sale date must be in YYYY-MM-DD format' })
    .optional(),
  customer: z
    .string({ error: 'Customer must be string' })
    .optional()
    .nullable(),
  notes: z
    .string({ error: 'Notes must be string' })
    .optional()
    .nullable(),
  status: z
    .enum(['Completed', 'Cancelled'], { error: 'Status must be either Completed or Cancelled' })
    .optional()
    .nullable(),
  forceSale: z
    .boolean({ error: 'forceSale must be a boolean' })
    .optional()
    .default(false),
  details: z
    .array(saleDetailSchema, { error: 'Details must be an array' })
    .min(1, { error: 'Sale must have at least one detail item' }),
})

const partialSaleSchema = z.object({
  saleDate: z
    .iso.date({ error: 'Sale date must be in YYYY-MM-DD format' })
    .optional(),
  customer: z
    .string({ error: 'Customer must be string' })
    .optional()
    .nullable(),
  notes: z
    .string({ error: 'Notes must be string' })
    .optional()
    .nullable(),
  status: z
    .enum(['Completed', 'Cancelled'], { error: 'Status must be either Completed or Cancelled' })
    .optional()
    .nullable(),
})

export function ValidateSale (data) {
  return saleSchema.safeParse(data)
}

export function ValidatePartialSale (data) {
  return partialSaleSchema.safeParse(data)
}

export function ValidateSaleId (data) {
  return z.object({
    id: z.coerce
      .number({ error: 'ID must be a number' })
      .min(1, { error: 'Invalid ID' }),
  }).safeParse(data)
}

export function ValidatePartialIdSale (data) {
  const validateId = ValidateSaleId(data)
  if (!validateId.success) {
    return validateId
  }
  const validatePartial = ValidatePartialSale(data)
  return validatePartial
}
