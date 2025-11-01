const toNumber = (v) => v === undefined || v === null
  ? v
  : (typeof v === 'number' ? v : Number(v))

export const transformDish = (dish) => {
  if (!dish) return null

  const transformed = {
    id: dish.dish_id,
    name: dish.name || dish.dish_name
  }

  if (dish.description || dish.dish_description) {
    transformed.description = dish.description || dish.dish_description
  }

  if (dish.price || dish.dish_price) {
    transformed.price = toNumber(dish.price || dish.dish_price)
  }

  if (dish.status || dish.dish_status) {
    transformed.status = dish.status || dish.dish_status
  }

  if ((dish.category_id || dish.dish_category_id) && (dish.category_name || dish.dish_category_name)) {
    transformed.category = {
      id: dish.category_id || dish.dish_category_id,
      name: dish.category_name || dish.dish_category_name
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
    name
  }

  if (ruc) transformed.ruc = ruc
  if (phone) transformed.phone = phone
  if (email) transformed.email = email
  if (address) transformed.address = address
  if (contactPerson) transformed.contactPerson = contactPerson
  if (status) transformed.status = status

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
    name
  }

  if (unit) transformed.unit = unit
  if (status) transformed.status = status
  if (stock !== undefined && stock !== null) transformed.stock = toNumber(stock)
  if (minimumStock !== undefined && minimumStock !== null) transformed.minimumStock = toNumber(minimumStock)

  if ((ingredient.category_id || ingredient.ingredient_category_id) && (ingredient.category_name || ingredient.ingredient_category_name)) {
    transformed.category = {
      id: ingredient.category_id || ingredient.ingredient_category_id,
      name: ingredient.category_name || ingredient.ingredient_category_name
    }
  }

  return transformed
}

export const transformPurchaseDetail = (detail) => {
  if (!detail) return null

  const transformed = {
    id: detail.purchase_detail_id,
    quantity: detail.quantity,
    unitPrice: toNumber(detail.unit_price),
    subtotal: toNumber(detail.subtotal)
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
      ingredient_category_name: detail.ingredient_category_name
    }
    transformed.ingredient = transformIngredient(ingredient)
  }

  return transformed
}

export const transformPurchase = (purchase) => {
  if (!purchase) return null

  const transformed = {
    id: purchase.purchase_id,
    purchaseDate: purchase.purchase_date,
    total: toNumber(purchase.total),
    status: purchase.status
  }

  if (purchase.notes) {
    transformed.notes = purchase.notes
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
      supplier_status: purchase.supplier_status
    }
    transformed.supplier = transformSupplier(supplier)
  }

  if (purchase.details && Array.isArray(purchase.details) && purchase.details.length > 0) {
    transformed.details = purchase.details.map(detail => transformPurchaseDetail(detail))
  }

  return transformed
}

export const transformSaleDetail = (detail) => {
  if (!detail) return null

  const transformed = {
    id: detail.sale_detail_id,
    quantity: detail.quantity,
    unitPrice: toNumber(detail.unit_price),
    discount: toNumber(detail.discount),
    subtotal: toNumber(detail.subtotal)
  }

  if (detail.dish_id) {
    const dish = {
      dish_id: detail.dish_id,
      dish_name: detail.dish_name,
      description: detail.dish_description,
      price: detail.dish_price,
      status: detail.dish_status,
      dish_category_id: detail.dish_category_id,
      dish_category_name: detail.dish_category_name
    }
    transformed.dish = transformDish(dish)
  }

  return transformed
}

export const transformSale = (sale) => {
  if (!sale) return null

  const transformed = {
    id: sale.sale_id,
    saleDate: sale.sale_date,
    total: toNumber(sale.total),
    status: sale.status
  }

  if (sale.customer) {
    transformed.customer = sale.customer
  }

  if (sale.notes) {
    transformed.notes = sale.notes
  }

  if (sale.details && Array.isArray(sale.details) && sale.details.length > 0) {
    transformed.details = sale.details.map(detail => transformSaleDetail(detail))
  }

  return transformed
}

export const transformDishCategory = (category) => {
  if (!category) return null

  const transformed = {
    id: category.category_id,
    name: category.name
  }

  if (category.description) {
    transformed.description = category.description
  }

  if (category.status) {
    transformed.status = category.status
  }

  return transformed
}

export const transformIngredientCategory = (category) => {
  if (!category) return null

  const transformed = {
    id: category.category_id,
    name: category.name
  }

  if (category.description) {
    transformed.description = category.description
  }

  if (category.status) {
    transformed.status = category.status
  }

  return transformed
}

export const transformDishIngredient = (dishIngredient) => {
  if (!dishIngredient) return null

  const transformed = {
    id: dishIngredient.dish_ingredient_id,
    dishId: dishIngredient.dish_id,
    quantityUsed: dishIngredient.quantity_used
  }

  transformed.ingredient = {
    id: dishIngredient.ingredient_id,
    name: dishIngredient.ingredient_name,
    unit: dishIngredient.ingredient_unit
  }

  if (dishIngredient.ingredient_stock !== undefined) {
    transformed.ingredient.stock = dishIngredient.ingredient_stock
  }

  if (dishIngredient.ingredient_status) {
    transformed.ingredient.status = dishIngredient.ingredient_status
  }

  if (dishIngredient.ingredient_category_id && dishIngredient.ingredient_category_name) {
    transformed.ingredient.category = {
      id: dishIngredient.ingredient_category_id,
      name: dishIngredient.ingredient_category_name
    }
  }

  return transformed
}
