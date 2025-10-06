import z from 'zod'

const purchaseDetailSchema = z.object({
  ingredient_id: z.coerce.number().min(1, 'Ingredient ID must be a positive number'),
  quantity: z.coerce.number().min(0.01, 'Quantity must be greater than 0'),
  unit_price: z.coerce.number().min(0, 'Unit price must be a positive number')
})

const purchaseSchema = z.object({
  supplier_id: z.coerce.number().min(1, 'Supplier ID must be a positive number').optional().nullable(),
  purchase_date: z.iso.date('Purchase date must be in YYYY-MM-DD format').optional(),
  notes: z.string().optional().nullable(),
  status: z.enum(['Completed', 'Cancelled']).optional().nullable(),
  details: z.array(purchaseDetailSchema).min(1, 'Purchase must have at least one detail item')
})

const partialPurchaseSchema = z.object({
  supplier_id: z.coerce.number().min(1, 'Supplier ID must be a positive number').optional().nullable(),
  purchase_date: z.iso.date('Purchase date must be in YYYY-MM-DD format').optional(),
  notes: z.string().optional().nullable(),
  status: z.enum(['Completed', 'Cancelled']).optional().nullable(),
  details: z.array(purchaseDetailSchema).min(1, 'Purchase must have at least one detail item').optional()
})

export function ValidatePurchase (data) {
  return purchaseSchema.safeParse(data)
}

export function ValidatePartialPurchase (data) {
  return partialPurchaseSchema.safeParse(data)
}

export function ValidatePurchaseId (data) {
  return z.object({
    id: z.coerce.number().min(1, 'Invalid ID')
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
