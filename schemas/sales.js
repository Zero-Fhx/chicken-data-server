import z from 'zod'

const saleDetailSchema = z.object({
  dish_id: z.coerce.number().min(1, 'Dish ID must be a positive number'),
  quantity: z.coerce.number().min(1, 'Quantity must be at least 1'),
  unit_price: z.coerce.number().min(0, 'Unit price must be a positive number'),
  discount: z.coerce.number().min(0, 'Discount must be a positive number').optional().default(0)
})

const saleSchema = z.object({
  sale_date: z.iso.date('Sale date must be in YYYY-MM-DD format').optional(),
  customer: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  details: z.array(saleDetailSchema).min(1, 'Sale must have at least one detail item')
})

const partialSaleSchema = z.object({
  sale_date: z.iso.date('Sale date must be in YYYY-MM-DD format').optional(),
  customer: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  details: z.array(saleDetailSchema).min(1, 'Sale must have at least one detail item').optional()
})

export function ValidateSale (data) {
  return saleSchema.safeParse(data)
}

export function ValidatePartialSale (data) {
  return partialSaleSchema.safeParse(data)
}

export function ValidateSaleId (data) {
  return z.object({
    id: z.coerce.number().min(1, 'Invalid ID')
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
