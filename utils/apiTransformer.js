export const transformDish = (dish) => {
  if (!dish) return null

  const transformed = {
    id: dish.dish_id,
    type: 'dish',
    attributes: {
      name: dish.name || dish.dish_name,
      ...((dish.description || dish.dish_description) && { description: dish.description || dish.dish_description }),
      ...((dish.category_id || dish.dish_category_id) && (dish.category_name || dish.dish_category_name) && {
        category: {
          id: dish.category_id || dish.dish_category_id,
          name: dish.category_name || dish.dish_category_name
        }
      }),
      ...((dish.price || dish.dish_price) && { price: dish.price || dish.dish_price }),
      ...((dish.status || dish.dish_status) && { status: dish.status || dish.dish_status })
    }
  }

  const createdAt = dish.created_at || dish.dish_created_at
  const updatedAt = dish.updated_at || dish.dish_updated_at

  if (createdAt || updatedAt) {
    transformed.meta = {
      ...(createdAt && { createdAt }),
      ...(updatedAt && { updatedAt })
    }
  }

  return transformed
}

export const transformSupplier = (supplier) => {
  if (!supplier) return null

  const name = supplier.name || supplier.supplier_name
  const ruc = supplier.ruc || supplier.supplier_ruc
  const phone = supplier.phone || supplier.supplier_phone
  const email = supplier.email || supplier.supplier_email
  const address = supplier.address || supplier.supplier_address
  const contactPerson = supplier.contact_person || supplier.supplier_contact_person
  const status = supplier.status || supplier.supplier_status

  const transformed = {
    id: supplier.supplier_id,
    type: 'supplier',
    attributes: {
      name,
      ...(ruc && { ruc }),
      ...(phone && { phone }),
      ...(email && { email }),
      ...(address && { address }),
      ...(contactPerson && { contactPerson }),
      ...(status && { status })
    }
  }

  const createdAt = supplier.created_at || supplier.supplier_created_at
  const updatedAt = supplier.updated_at || supplier.supplier_updated_at

  if (createdAt || updatedAt) {
    transformed.meta = {
      ...(createdAt && { createdAt }),
      ...(updatedAt && { updatedAt })
    }
  }

  return transformed
}

export const transformIngredient = (ingredient) => {
  if (!ingredient) return null

  const name = ingredient.name || ingredient.ingredient_name
  const unit = ingredient.unit || ingredient.ingredient_unit
  const status = ingredient.status || ingredient.ingredient_status
  const stock = ingredient.stock !== undefined ? ingredient.stock : ingredient.ingredient_stock
  const minimumStock = ingredient.minimum_stock !== undefined ? ingredient.minimum_stock : ingredient.ingredient_minimum_stock

  const transformed = {
    id: ingredient.ingredient_id,
    type: 'ingredient',
    attributes: {
      name,
      ...(unit && { unit }),
      ...((ingredient.category_id || ingredient.ingredient_category_id) && (ingredient.category_name || ingredient.ingredient_category_name) && {
        category: {
          id: ingredient.category_id || ingredient.ingredient_category_id,
          name: ingredient.category_name || ingredient.ingredient_category_name
        }
      }),
      ...(status && { status }),
      ...(stock !== undefined && stock !== null && { stock }),
      ...(minimumStock !== undefined && minimumStock !== null && { minimumStock })
    }
  }

  const createdAt = ingredient.created_at || ingredient.ingredient_created_at
  const updatedAt = ingredient.updated_at || ingredient.ingredient_updated_at

  if (createdAt || updatedAt) {
    transformed.meta = {
      ...(createdAt && { createdAt }),
      ...(updatedAt && { updatedAt })
    }
  }

  return transformed
}

export const transformPurchaseDetail = (detail) => {
  if (!detail) return null

  const transformed = {
    id: detail.purchase_detail_id,
    type: 'purchaseDetail',
    attributes: {
      quantity: detail.quantity,
      unitPrice: detail.unit_price,
      subtotal: detail.subtotal
    }
  }

  if (detail.ingredient_id) {
    const ingredient = {
      ingredient_id: detail.ingredient_id,
      ingredient_name: detail.ingredient_name,
      unit: detail.ingredient_unit,
      status: detail.ingredient_status,
      stock: detail.ingredient_stock,
      minimum_stock: detail.ingredient_minimum_stock,
      ingredient_category_id: detail.ingredient_category_id,
      ingredient_category_name: detail.ingredient_category_name,
      ingredient_created_at: detail.ingredient_created_at,
      ingredient_updated_at: detail.ingredient_updated_at
    }
    transformed.attributes.ingredient = transformIngredient(ingredient)
  }

  if (detail.created_at || detail.updated_at) {
    transformed.meta = {
      ...(detail.created_at && { createdAt: detail.created_at }),
      ...(detail.updated_at && { updatedAt: detail.updated_at })
    }
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
      ...(purchase.notes && { notes: purchase.notes }),
      total: purchase.total,
      status: purchase.status
    }
  }

  if (purchase.supplier_id) {
    const supplier = {
      supplier_id: purchase.supplier_id,
      supplier_name: purchase.supplier_name,
      ruc: purchase.supplier_ruc,
      phone: purchase.supplier_phone,
      email: purchase.supplier_email,
      address: purchase.supplier_address,
      contact_person: purchase.supplier_contact_person,
      supplier_status: purchase.supplier_status,
      supplier_created_at: purchase.supplier_created_at,
      supplier_updated_at: purchase.supplier_updated_at
    }
    transformed.attributes.supplier = transformSupplier(supplier)
  }

  if (purchase.details && Array.isArray(purchase.details) && purchase.details.length > 0) {
    transformed.attributes.details = purchase.details.map(detail => transformPurchaseDetail(detail))
  }

  if (purchase.created_at || purchase.updated_at) {
    transformed.meta = {
      ...(purchase.created_at && { createdAt: purchase.created_at }),
      ...(purchase.updated_at && { updatedAt: purchase.updated_at })
    }
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
      subtotal: detail.subtotal
    }
  }

  if (detail.dish_id) {
    const dish = {
      dish_id: detail.dish_id,
      dish_name: detail.dish_name,
      description: detail.dish_description,
      price: detail.dish_price,
      status: detail.dish_status,
      dish_category_id: detail.dish_category_id,
      dish_category_name: detail.dish_category_name,
      dish_created_at: detail.dish_created_at,
      dish_updated_at: detail.dish_updated_at
    }
    transformed.attributes.dish = transformDish(dish)
  }

  if (detail.created_at || detail.updated_at) {
    transformed.meta = {
      ...(detail.created_at && { createdAt: detail.created_at }),
      ...(detail.updated_at && { updatedAt: detail.updated_at })
    }
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
      ...(sale.customer && { customer: sale.customer }),
      ...(sale.notes && { notes: sale.notes }),
      total: sale.total,
      status: sale.status
    }
  }

  if (sale.details && Array.isArray(sale.details) && sale.details.length > 0) {
    transformed.attributes.details = sale.details.map(detail => transformSaleDetail(detail))
  }

  if (sale.created_at || sale.updated_at) {
    transformed.meta = {
      ...(sale.created_at && { createdAt: sale.created_at }),
      ...(sale.updated_at && { updatedAt: sale.updated_at })
    }
  }

  return transformed
}

export const transformDishCategory = (category) => {
  if (!category) return null

  const transformed = {
    id: category.category_id,
    type: 'dishCategory',
    attributes: {
      name: category.name,
      ...(category.description && { description: category.description }),
      ...(category.status && { status: category.status })
    }
  }

  if (category.created_at || category.updated_at) {
    transformed.meta = {
      ...(category.created_at && { createdAt: category.created_at }),
      ...(category.updated_at && { updatedAt: category.updated_at })
    }
  }

  return transformed
}

export const transformIngredientCategory = (category) => {
  if (!category) return null

  const transformed = {
    id: category.category_id,
    type: 'ingredientCategory',
    attributes: {
      name: category.name,
      ...(category.description && { description: category.description }),
      ...(category.status && { status: category.status })
    }
  }

  if (category.created_at || category.updated_at) {
    transformed.meta = {
      ...(category.created_at && { createdAt: category.created_at }),
      ...(category.updated_at && { updatedAt: category.updated_at })
    }
  }

  return transformed
}
