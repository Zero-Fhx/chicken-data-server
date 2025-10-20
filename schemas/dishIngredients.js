import z from 'zod'

const dishIngredientSchema = z.object({
  ingredient_id: z
    .number({ error: 'Ingredient ID is required' })
    .int({ error: 'Ingredient ID must be an integer' })
    .positive({ error: 'Ingredient ID must be a positive number' }),
  quantity_used: z
    .number({ error: 'Quantity used is required' })
    .positive({ error: 'Quantity used must be a positive number' })
})

const quantityUsedSchema = z.object({
  quantity_used: z
    .number({ error: 'Quantity used is required' })
    .positive({ error: 'Quantity used must be a positive number' })
})

const dishIngredientsSchema = z.object({
  ingredients: z
    .array(dishIngredientSchema)
    .optional()
    .default([])
})

const dishIdSchema = z.object({
  dishId: z
    .string()
    .transform(val => parseInt(val))
    .pipe(
      z.number()
        .int({ error: 'Dish ID must be an integer' })
        .positive({ error: 'Dish ID must be a positive number' })
    )
})

const dishIngredientIdsSchema = z.object({
  dishId: z
    .string()
    .transform(val => parseInt(val))
    .pipe(
      z.number()
        .int({ error: 'Dish ID must be an integer' })
        .positive({ error: 'Dish ID must be a positive number' })
    ),
  ingredientId: z
    .string()
    .transform(val => parseInt(val))
    .pipe(
      z.number()
        .int({ error: 'Ingredient ID must be an integer' })
        .positive({ error: 'Ingredient ID must be a positive number' })
    )
})

export function ValidateDishIngredient (data) {
  return dishIngredientSchema.safeParse(data)
}

export function ValidateDishIngredients (data) {
  return dishIngredientsSchema.safeParse(data)
}

export function ValidateDishIdParam (data) {
  return dishIdSchema.safeParse(data)
}

export function ValidateDishIngredientIds (data) {
  return dishIngredientIdsSchema.safeParse(data)
}

export function ValidateQuantityUsed (data) {
  return quantityUsedSchema.safeParse(data)
}
