import z from 'zod'

const purchaseDetailSchema = z.object({
  ingredientId: z.coerce
    .number({ error: 'Ingredient ID must be a number' })
    .int({ error: 'Ingredient ID must be an integer' })
    .min(1, { error: 'Ingredient ID must be a positive number' }),
  quantity: z.coerce
    .number({ error: 'Quantity must be a number' })
    .min(0.01, { error: 'Quantity must be greater than 0' }),
  unitPrice: z.coerce
    .number({ error: 'Unit price must be a number' })
    .min(0, { error: 'Unit price must be a positive number' }),
})

const purchaseSchema = z.object({
  supplierId: z.coerce
    .number({ error: 'Supplier ID must be a number' })
    .int({ error: 'Supplier ID must be an integer' })
    .min(1, { error: 'Supplier ID must be a positive number' })
    .optional()
    .nullable(),
  purchaseDate: z
    .iso.date('Purchase date must be in YYYY-MM-DD format')
    .optional(),
  notes: z
    .string({ error: 'Notes must be string' })
    .optional()
    .nullable(),
  status: z.enum(['Completed', 'Cancelled'], { error: 'Status must be either Completed or Cancelled' })
    .optional()
    .nullable(),
  details: z
    .array(purchaseDetailSchema, { error: 'Details must be an array' })
    .min(1, { error: 'Purchase must have at least one detail item' }),
})

const partialPurchaseSchema = z.object({
  supplierId: z.coerce
    .number({ error: 'Supplier ID must be a number' })
    .int({ error: 'Supplier ID must be an integer' })
    .min(1, { error: 'Supplier ID must be a positive number' })
    .optional()
    .nullable(),
  purchaseDate: z
    .iso.date({ error: 'Purchase date must be in YYYY-MM-DD format' })
    .optional(),
  notes: z
    .string({ error: 'Notes must be string' })
    .optional()
    .nullable(),
  status: z
    .enum(['Completed', 'Cancelled'], { error: 'Status must be either Completed or Cancelled' })
    .optional()
    .default('Completed'),
})

export function ValidatePurchase (data) {
  return purchaseSchema.safeParse(data)
}

export function ValidatePartialPurchase (data) {
  return partialPurchaseSchema.safeParse(data)
}

export function ValidatePurchaseId (data) {
  return z.object({
    id: z.coerce
      .number({ error: 'ID must be a number' })
      .min(1, { error: 'Invalid ID' }),
  }).safeParse(data)
}

export function ValidatePartialIdPurchase (data) {
  const validateId = ValidatePurchaseId(data)
  if (!validateId.success) {
    return validateId
  }
  const validatePartial = ValidatePartialPurchase(data)
  return validatePartial
}
