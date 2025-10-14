import z from 'zod'

const supplierSchema = z.object({
  name: z
    .string({ error: 'Name must be string' })
    .min(1, { error: 'Name is required' }),
  ruc: z
    .string({ error: 'RUC must be string' })
    .max(20, { error: 'RUC must be 20 characters or less' })
    .optional()
    .nullable(),
  phone: z
    .string({ error: 'Phone must be string' })
    .max(20, { error: 'Phone must be 20 characters or less' })
    .optional()
    .nullable(),
  email: z
    .email({ error: 'Invalid email format' })
    .optional()
    .nullable(),
  address: z
    .string({ error: 'Address must be string' })
    .max(150, { error: 'Address must be 150 characters or less' })
    .optional()
    .nullable(),
  contact_person: z
    .string({ error: 'Contact person must be string' })
    .max(100, { error: 'Contact person must be 100 characters or less' })
    .optional()
    .nullable(),
  status: z
    .enum(['Active', 'Inactive'], { error: 'Status must be either Active or Inactive' })
    .optional()
    .default('Active'),
})

export function ValidateSupplier (data) {
  return supplierSchema.safeParse(data)
}

export function ValidatePartialSupplier (data) {
  return supplierSchema.partial().safeParse(data)
}

export function ValidateSupplierId (data) {
  return z.object({
    id: z.coerce
      .number({ error: 'ID must be a number' })
      .min(1, { error: 'Invalid ID' }),
  }).safeParse(data)
}

export function ValidatePartialIdSupplier (data) {
  const validateId = ValidateSupplierId(data)
  if (!validateId.success) {
    return validateId
  }
  const validatePartial = ValidatePartialSupplier(data)
  return validatePartial
}
