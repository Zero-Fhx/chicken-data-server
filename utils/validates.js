import { ValidateCategory, ValidateCategoryId, ValidatePartialCategory } from '../schemas/categories.js'
import { ValidateDish, ValidateDishId, ValidatePartialDish, ValidatePartialIdDish } from '../schemas/dishes.js'
import { ValidateIngredient, ValidateIngredientId, ValidatePartialIdIngredient, ValidatePartialIngredient } from '../schemas/ingredients.js'
import { ValidatePartialIdPurchase, ValidatePartialPurchase, ValidatePurchase, ValidatePurchaseId } from '../schemas/purchases.js'
import { ValidatePartialIdSale, ValidatePartialSale, ValidateSale, ValidateSaleId } from '../schemas/sales.js'
import { ValidatePartialIdSupplier, ValidatePartialSupplier, ValidateSupplier, ValidateSupplierId } from '../schemas/suppliers.js'

export const DishValidates = {

  Dish: (data) => {
    return ValidateDish(data)
  },

  DishId: (data) => {
    return ValidateDishId(data)
  },

  PartialDish: (data) => {
    return ValidatePartialDish(data)
  },

  PartialIdDish: (data) => {
    return ValidatePartialIdDish(data)
  }
}

export const CategoryValidates = {

  Category: (data) => {
    return ValidateCategory(data)
  },

  CategoryId: (data) => {
    return ValidateCategoryId(data)
  },

  PartialCategory: (data) => {
    return ValidatePartialCategory(data)
  }
}

export const SupplierValidates = {

  Supplier: (data) => {
    return ValidateSupplier(data)
  },

  SupplierId: (data) => {
    return ValidateSupplierId(data)
  },

  PartialSupplier: (data) => {
    return ValidatePartialSupplier(data)
  },

  PartialIdSupplier: (data) => {
    return ValidatePartialIdSupplier(data)
  }
}

export const IngredientValidates = {

  Ingredient: (data) => {
    return ValidateIngredient(data)
  },

  IngredientId: (data) => {
    return ValidateIngredientId(data)
  },

  PartialIngredient: (data) => {
    return ValidatePartialIngredient(data)
  },

  PartialIdIngredient: (data) => {
    return ValidatePartialIdIngredient(data)
  }
}

export const PurchaseValidates = {

  Purchase: (data) => {
    return ValidatePurchase(data)
  },

  PurchaseId: (data) => {
    return ValidatePurchaseId(data)
  },

  PartialPurchase: (data) => {
    return ValidatePartialPurchase(data)
  },

  PartialIdPurchase: (data) => {
    return ValidatePartialIdPurchase(data)
  }
}

export const SaleValidates = {

  Sale: (data) => {
    return ValidateSale(data)
  },

  SaleId: (data) => {
    return ValidateSaleId(data)
  },

  PartialSale: (data) => {
    return ValidatePartialSale(data)
  },

  PartialIdSale: (data) => {
    return ValidatePartialIdSale(data)
  }
}
