export const transformDish = (dish) => {
  if (!dish) return null

  return {
    id: dish.dish_id,
    type: 'dish',
    attributes: {
      name: dish.name,
      description: dish.description,
      category: {
        id: dish.category_id,
        name: dish.category_name
      },
      price: dish.price,
      status: dish.status,
      createdAt: dish.created_at,
      updatedAt: dish.updated_at
    }
  }
}

export const transformSupplier = (supplier) => {
  if (!supplier) return null

  return {
    id: supplier.supplier_id,
    type: 'supplier',
    attributes: {
      name: supplier.name,
      ruc: supplier.ruc,
      phone: supplier.phone,
      email: supplier.email,
      address: supplier.address,
      contactPerson: supplier.contact_person,
      status: supplier.status,
      createdAt: supplier.created_at,
      updatedAt: supplier.updated_at
    }
  }
}

export const transformIngredient = (ingredient) => {
  if (!ingredient) return null

  return {
    id: ingredient.ingredient_id,
    type: 'ingredient',
    attributes: {
      name: ingredient.name,
      unit: ingredient.unit,
      category: {
        id: ingredient.category_id,
        name: ingredient.category_name
      },
      status: ingredient.status,
      stock: ingredient.stock,
      minimumStock: ingredient.minimum_stock,
      createdAt: ingredient.created_at,
      updatedAt: ingredient.updated_at
    }
  }
}

export const transformPurchaseDetail = (detail) => {
  if (!detail) return null

  const transformed = {
    id: detail.purchase_detail_id,
    type: 'purchaseDetail',
    attributes: {
      quantity: detail.quantity,
      unitPrice: detail.unit_price,
      subtotal: detail.subtotal,
      createdAt: detail.created_at,
      updatedAt: detail.updated_at
    }
  }

  if (detail.ingredient_id) {
    const ingredient = {
      ingredient_id: detail.ingredient_id,
      name: detail.ingredient_name,
      unit: detail.ingredient_unit,
      category_id: detail.ingredient_category_id,
      category_name: detail.ingredient_category_name
    }
    transformed.attributes.ingredient = transformIngredient(ingredient)
  }

  return transformed
}

export const transformPurchase = (purchase) => {
  if (!purchase) return null

  const transformed = {
    id: purchase.purchase_id,
    type: 'purchase',
    attributes: {
      purchaseDate: purchase.purchase_date,
      notes: purchase.notes,
      total: purchase.total,
      status: purchase.status,
      createdAt: purchase.created_at,
      updatedAt: purchase.updated_at
    }
  }

  if (purchase.supplier_id) {
    const supplier = {
      supplier_id: purchase.supplier_id,
      name: purchase.supplier_name,
      ruc: purchase.ruc,
      phone: purchase.phone,
      email: purchase.email,
      address: purchase.address,
      contact_person: purchase.contact_person,
      status: purchase.supplier_status,
      created_at: purchase.supplier_created_at,
      updated_at: purchase.supplier_updated_at
    }
    transformed.attributes.supplier = transformSupplier(supplier)
  }

  if (purchase.details && Array.isArray(purchase.details) && purchase.details.length > 0) {
    transformed.attributes.details = purchase.details.map(detail => transformPurchaseDetail(detail))
  }

  return transformed
}

export const transformSaleDetail = (detail) => {
  if (!detail) return null

  const transformed = {
    id: detail.sale_detail_id,
    type: 'saleDetail',
    attributes: {
      quantity: detail.quantity,
      unitPrice: detail.unit_price,
      discount: detail.discount,
      subtotal: detail.subtotal,
      createdAt: detail.created_at,
      updatedAt: detail.updated_at
    }
  }

  if (detail.dish_id) {
    const dish = {
      dish_id: detail.dish_id,
      name: detail.dish_name,
      category_id: detail.dish_category_id,
      category_name: detail.dish_category_name
    }
    transformed.attributes.dish = transformDish(dish)
  }

  return transformed
}

export const transformSale = (sale) => {
  if (!sale) return null

  const transformed = {
    id: sale.sale_id,
    type: 'sale',
    attributes: {
      saleDate: sale.sale_date,
      customer: sale.customer,
      notes: sale.notes,
      total: sale.total,
      status: sale.status,
      createdAt: sale.created_at,
      updatedAt: sale.updated_at
    }
  }

  if (sale.details && Array.isArray(sale.details) && sale.details.length > 0) {
    transformed.attributes.details = sale.details.map(detail => transformSaleDetail(detail))
  }

  return transformed
}

export const transformDishCategory = (category) => {
  if (!category) return null

  return {
    id: category.category_id,
    type: 'dishCategory',
    attributes: {
      name: category.name,
      description: category.description,
      status: category.status,
      createdAt: category.created_at,
      updatedAt: category.updated_at
    }
  }
}

export const transformIngredientCategory = (category) => {
  if (!category) return null

  return {
    id: category.category_id,
    type: 'ingredientCategory',
    attributes: {
      name: category.name,
      description: category.description,
      status: category.status,
      createdAt: category.created_at,
      updatedAt: category.updated_at
    }
  }
}
