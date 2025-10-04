import z from 'zod'

const supplierSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  ruc: z.string().max(20, 'RUC must be 20 characters or less').optional().nullable(),
  phone: z.string().max(20, 'Phone must be 20 characters or less').optional().nullable(),
  email: z.email('Invalid email format').optional().nullable(),
  address: z.string().max(150, 'Address must be 150 characters or less').optional().nullable(),
  contact_person: z.string().max(100, 'Contact person must be 100 characters or less').optional().nullable()
})

export function ValidateSupplier (data) {
  return supplierSchema.safeParse(data)
}

export function ValidatePartialSupplier (data) {
  return supplierSchema.partial().safeParse(data)
}

export function ValidateSupplierId (data) {
  const id = z.coerce.number().min(1, 'Invalid ID')

  return z.object({ id }).safeParse(data)
}

export function ValidatePartialIdSupplier (data) {
  const validateId = ValidateSupplierId(data)
  if (!validateId.success) {
    return validateId
  }
  const validatePartial = ValidatePartialSupplier(data)
  return validatePartial
}
