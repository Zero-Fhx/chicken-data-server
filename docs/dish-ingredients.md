# 🍲 Recetas de Platillos (Dish Ingredients)

Gestión de los ingredientes que componen un platillo (Receta).

## 🔗 Endpoints

### 1. Obtener Receta

Obtiene la lista de ingredientes asociados a un platillo.

**URL:** `/api/dishes/:dishId/recipe`
**Método:** `GET`

**Ejemplo de Solicitud:**

```bash
curl -X GET "http://localhost:3000/api/dishes/35/recipe"
```

**Ejemplo de Respuesta:**

```json
{
  "success": true,
  "message": "Recipe retrieved successfully",
  "data": [
    {
      "dishIngredientId": 101,
      "ingredientId": 1,
      "name": "Pollo Entero (2.0kg)",
      "quantityUsed": 0.5,
      "unit": "unidad"
    }
  ],
  "timestamp": "2025-11-19T16:10:30.188Z"
}
```

### 2. Agregar Ingrediente a Receta

Agrega un ingrediente a la receta de un platillo.

**URL:** `/api/dishes/:dishId/recipe`
**Método:** `POST`
**Headers:** `Content-Type: application/json`

**Cuerpo de la Solicitud (Body):**

```json
{
  "ingredientId": 1,
  "quantityUsed": 0.5
}
```

**Ejemplo de Respuesta:**

```json
{
  "success": true,
  "message": "Ingredient added to recipe successfully",
  "data": {
    "dishIngredientId": 102,
    "dishId": 35,
    "ingredientId": 1,
    "quantityUsed": 0.5
  },
  "timestamp": "2025-11-19T16:10:30.188Z"
}
```

### 3. Reemplazar Receta Completa

Reemplaza todos los ingredientes de la receta de un platillo.

**URL:** `/api/dishes/:dishId/recipe`
**Método:** `PUT`
**Headers:** `Content-Type: application/json`

**Cuerpo de la Solicitud (Body):**

```json
{
  "ingredients": [
    { "ingredientId": 1, "quantityUsed": 0.5 },
    { "ingredientId": 13, "quantityUsed": 0.2 }
  ]
}
```

**Ejemplo de Respuesta:**

```json
{
  "success": true,
  "message": "Recipe replaced successfully",
  "data": [
    { "dishIngredientId": 103, "ingredientId": 1, "quantityUsed": 0.5 },
    { "dishIngredientId": 104, "ingredientId": 13, "quantityUsed": 0.2 }
  ],
  "timestamp": "2025-11-19T16:10:30.188Z"
}
```

### 4. Actualizar Cantidad de Ingrediente

Actualiza la cantidad usada de un ingrediente específico en la receta.

**URL:** `/api/dishes/:dishId/recipe/:ingredientId`
**Método:** `PATCH`
**Headers:** `Content-Type: application/json`

**Cuerpo de la Solicitud (Body):**

```json
{
  "quantityUsed": 0.75
}
```

**Ejemplo de Respuesta:**

```json
{
  "success": true,
  "message": "Ingredient quantity updated successfully",
  "data": {
    "dishIngredientId": 103,
    "dishId": 35,
    "ingredientId": 1,
    "quantityUsed": 0.75
  },
  "timestamp": "2025-11-19T16:10:30.188Z"
}
```

### 5. Eliminar Ingrediente de Receta

Elimina un ingrediente de la receta de un platillo.

**URL:** `/api/dishes/:dishId/recipe/:ingredientId`
**Método:** `DELETE`

**Ejemplo de Respuesta:**

```json
{
  "success": true,
  "message": "Ingredient removed from recipe successfully",
  "timestamp": "2025-11-19T16:10:30.188Z"
}
```
