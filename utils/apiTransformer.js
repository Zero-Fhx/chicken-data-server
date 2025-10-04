export const transformDish = (dish) => {
  if (!dish) return null

  return {
    id: dish.dish_id,
    type: 'dish',
    attributes: {
      name: dish.name,
      description: dish.description,
      category: dish.category,
      price: dish.price,
      status: dish.status
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
      contact_person: supplier.contact_person
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
      category: ingredient.category,
      status: ingredient.status,
      stock: ingredient.stock,
      minimum_stock: ingredient.minimum_stock
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
      unit_price: detail.unit_price,
      subtotal: detail.subtotal
    }
  }

  if (detail.ingredient_id) {
    const ingredient = {
      ingredient_id: detail.ingredient_id,
      name: detail.ingredient_name,
      unit: detail.ingredient_unit
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
      purchase_date: purchase.purchase_date,
      notes: purchase.notes,
      total: purchase.total
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
      contact_person: purchase.contact_person
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
      unit_price: detail.unit_price,
      discount: detail.discount,
      subtotal: detail.subtotal
    }
  }

  if (detail.dish_id) {
    const dish = {
      dish_id: detail.dish_id,
      name: detail.dish_name,
      category: detail.dish_category
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
      sale_date: sale.sale_date,
      customer: sale.customer,
      notes: sale.notes,
      total: sale.total
    }
  }

  if (sale.details && Array.isArray(sale.details) && sale.details.length > 0) {
    transformed.attributes.details = sale.details.map(detail => transformSaleDetail(detail))
  }

  return transformed
}
