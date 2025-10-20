# 📝 Recetas de Platillos (Dish Ingredients)

Gestión de ingredientes asociados a cada platillo (recetas).

## Descripción

Este recurso permite administrar la relación entre platillos e ingredientes, especificando qué ingredientes se necesitan para preparar cada platillo y en qué cantidades. Esto es esencial para controlar el inventario y calcular costos.

## Endpoints Disponibles

| Método   | Endpoint                                        | Descripción                               |
| -------- | ----------------------------------------------- | ----------------------------------------- |
| `GET`    | `/api/dishes/:dishId/ingredients`               | Obtener la receta completa de un platillo |
| `POST`   | `/api/dishes/:dishId/ingredients`               | Agregar un ingrediente a la receta        |
| `PUT`    | `/api/dishes/:dishId/ingredients`               | Reemplazar toda la receta del platillo    |
| `PUT`    | `/api/dishes/:dishId/ingredients/:ingredientId` | Actualizar cantidad de un ingrediente     |
| `DELETE` | `/api/dishes/:dishId/ingredients/:ingredientId` | Eliminar un ingrediente de la receta      |

---

## GET /api/dishes/:dishId/ingredients

Obtiene la receta completa de un platillo, incluyendo todos los ingredientes y cantidades necesarias.

### Parámetros de Ruta

| Parámetro | Tipo     | Obligatorio | Descripción     |
| --------- | -------- | ----------- | --------------- |
| `dishId`  | `number` | Sí          | ID del platillo |

### Ejemplo de Solicitud

```http
GET /api/dishes/1/ingredients
```

### Ejemplo de Respuesta

```json
{
  "success": true,
  "message": "Dish recipe retrieved successfully",
  "data": [
    {
      "id": 1,
      "dishId": 1,
      "quantityUsed": 1.5,
      "ingredient": {
        "id": 1,
        "name": "Pollo Entero",
        "unit": "kg",
        "stock": 45.5
      }
    },
    {
      "id": 2,
      "dishId": 1,
      "quantityUsed": 0.5,
      "ingredient": {
        "id": 5,
        "name": "Papas",
        "unit": "kg",
        "stock": 30.0
      }
    },
    {
      "id": 3,
      "dishId": 1,
      "quantityUsed": 0.1,
      "ingredient": {
        "id": 8,
        "name": "Ají Especial",
        "unit": "kg",
        "stock": 5.0
      }
    }
  ],
  "timestamp": "2025-10-20T19:28:47.212Z"
}
```

### Códigos de Estado

- `200` - Receta encontrada exitosamente
- `400` - ID del platillo inválido
- `404` - Platillo no encontrado

---

## POST /api/dishes/:dishId/ingredients

Agrega un nuevo ingrediente a la receta de un platillo.

### Parámetros de Ruta

| Parámetro | Tipo     | Obligatorio | Descripción     |
| --------- | -------- | ----------- | --------------- |
| `dishId`  | `number` | Sí          | ID del platillo |

### Cuerpo de la Solicitud

| Campo           | Tipo     | Obligatorio | Descripción                                       |
| --------------- | -------- | ----------- | ------------------------------------------------- |
| `ingredient_id` | `number` | Sí          | ID del ingrediente a agregar                      |
| `quantity_used` | `number` | Sí          | Cantidad necesaria del ingrediente (debe ser > 0) |

### Validaciones y Restricciones

| Campo           | Validación                                           |
| --------------- | ---------------------------------------------------- |
| `ingredient_id` | Requerido, debe ser un número entero positivo válido |
| `quantity_used` | Requerido, debe ser un número > 0                    |

### Ejemplo de Solicitud

```http
POST /api/dishes/1/ingredients
Content-Type: application/json

{
  "ingredient_id": 12,
  "quantity_used": 0.2
}
```

### Ejemplo de Respuesta

```json
{
  "success": true,
  "message": "Ingredient added to dish successfully",
  "data": {
    "id": 4,
    "dishId": 1,
    "quantityUsed": 0.2,
    "ingredient": {
      "id": 12,
      "name": "Limón",
      "unit": "kg"
    }
  },
  "timestamp": "2025-10-20T19:28:47.212Z"
}
```

### Códigos de Estado

- `201` - Ingrediente agregado exitosamente
- `400` - Datos de entrada inválidos o el ingrediente ya existe en la receta
- `404` - Platillo o ingrediente no encontrado

---

## PUT /api/dishes/:dishId/ingredients

Reemplaza completamente la receta de un platillo con una nueva lista de ingredientes.

### Parámetros de Ruta

| Parámetro | Tipo     | Obligatorio | Descripción     |
| --------- | -------- | ----------- | --------------- |
| `dishId`  | `number` | Sí          | ID del platillo |

### Cuerpo de la Solicitud

| Campo         | Tipo    | Obligatorio | Descripción                                                      |
| ------------- | ------- | ----------- | ---------------------------------------------------------------- |
| `ingredients` | `array` | No          | Array de ingredientes (puede estar vacío para limpiar la receta) |

#### Estructura de `ingredients`

| Campo           | Tipo     | Obligatorio | Descripción                       |
| --------------- | -------- | ----------- | --------------------------------- |
| `ingredient_id` | `number` | Sí          | ID del ingrediente                |
| `quantity_used` | `number` | Sí          | Cantidad necesaria (debe ser > 0) |

### Validaciones y Restricciones

| Campo                         | Validación                                           |
| ----------------------------- | ---------------------------------------------------- |
| `ingredients`                 | Opcional, array de objetos                           |
| `ingredients[].ingredient_id` | Requerido, debe ser un número entero positivo válido |
| `ingredients[].quantity_used` | Requerido, debe ser un número > 0                    |

### Ejemplo de Solicitud

```http
PUT /api/dishes/1/ingredients
Content-Type: application/json

{
  "ingredients": [
    {
      "ingredient_id": 1,
      "quantity_used": 1.5
    },
    {
      "ingredient_id": 5,
      "quantity_used": 0.5
    },
    {
      "ingredient_id": 8,
      "quantity_used": 0.1
    },
    {
      "ingredient_id": 12,
      "quantity_used": 0.2
    }
  ]
}
```

### Ejemplo de Respuesta

```json
{
  "success": true,
  "message": "Dish recipe replaced successfully",
  "data": [
    {
      "id": 1,
      "dishId": 1,
      "quantityUsed": 1.5,
      "ingredient": {
        "id": 1,
        "name": "Pollo Entero",
        "unit": "kg"
      }
    },
    {
      "id": 2,
      "dishId": 1,
      "quantityUsed": 0.5,
      "ingredient": {
        "id": 5,
        "name": "Papas",
        "unit": "kg"
      }
    },
    {
      "id": 3,
      "dishId": 1,
      "quantityUsed": 0.1,
      "ingredient": {
        "id": 8,
        "name": "Ají Especial",
        "unit": "kg"
      }
    },
    {
      "id": 4,
      "dishId": 1,
      "quantityUsed": 0.2,
      "ingredient": {
        "id": 12,
        "name": "Limón",
        "unit": "kg"
      }
    }
  ],
  "timestamp": "2025-10-20T19:28:47.212Z"
}
```

### Códigos de Estado

- `200` - Receta reemplazada exitosamente
- `400` - Datos de entrada inválidos o ingredientes duplicados
- `404` - Platillo o ingrediente no encontrado

---

## PUT /api/dishes/:dishId/ingredients/:ingredientId

Actualiza la cantidad necesaria de un ingrediente específico en la receta.

### Parámetros de Ruta

| Parámetro      | Tipo     | Obligatorio | Descripción        |
| -------------- | -------- | ----------- | ------------------ |
| `dishId`       | `number` | Sí          | ID del platillo    |
| `ingredientId` | `number` | Sí          | ID del ingrediente |

### Cuerpo de la Solicitud

| Campo           | Tipo     | Obligatorio | Descripción                             |
| --------------- | -------- | ----------- | --------------------------------------- |
| `quantity_used` | `number` | Sí          | Nueva cantidad necesaria (debe ser > 0) |

### Validaciones y Restricciones

| Campo           | Validación                        |
| --------------- | --------------------------------- |
| `quantity_used` | Requerido, debe ser un número > 0 |

### Ejemplo de Solicitud

```http
PUT /api/dishes/1/ingredients/5
Content-Type: application/json

{
  "quantity_used": 0.6
}
```

### Ejemplo de Respuesta

```json
{
  "success": true,
  "message": "Ingredient quantity updated successfully",
  "data": {
    "id": 2,
    "dishId": 1,
    "quantityUsed": 0.6,
    "ingredient": {
      "id": 5,
      "name": "Papas",
      "unit": "kg"
    }
  },
  "timestamp": "2025-10-20T19:28:47.212Z"
}
```

### Códigos de Estado

- `200` - Cantidad actualizada exitosamente
- `400` - Datos de entrada inválidos o IDs inválidos
- `404` - Platillo, ingrediente o relación no encontrada

---

## DELETE /api/dishes/:dishId/ingredients/:ingredientId

Elimina un ingrediente de la receta de un platillo.

### Parámetros de Ruta

| Parámetro      | Tipo     | Obligatorio | Descripción                   |
| -------------- | -------- | ----------- | ----------------------------- |
| `dishId`       | `number` | Sí          | ID del platillo               |
| `ingredientId` | `number` | Sí          | ID del ingrediente a eliminar |

### Ejemplo de Solicitud

```http
DELETE /api/dishes/1/ingredients/12
```

### Ejemplo de Respuesta

```json
{
  "success": true,
  "message": "Ingredient removed from dish successfully",
  "data": {
    "id": 4,
    "dishId": 1,
    "quantityUsed": 0.2,
    "ingredient": {
      "id": 12,
      "name": "Limón",
      "unit": "kg"
    }
  },
  "timestamp": "2025-10-20T19:28:47.212Z"
}
```

### Códigos de Estado

- `200` - Ingrediente eliminado exitosamente
- `400` - IDs inválidos
- `404` - Platillo, ingrediente o relación no encontrada

---

## Estructura de Datos

### Objeto DishIngredient (Relación Platillo-Ingrediente)

```typescript
{
  id: number; // ID de la relación
  dishId: number; // ID del platillo
  quantityUsed: number; // Cantidad necesaria
  ingredient: {
    id: number; // ID del ingrediente
    name: string; // Nombre del ingrediente
    unit: string; // Unidad de medida
    stock?: number; // Stock disponible (solo en GET)
    status?: "Available" | "Out of Stock"; // Estado (solo en algunos casos)
    category?: {
      id: number; // ID de la categoría
      name: string; // Nombre de la categoría
    };
  };
}
```

---

## Relaciones con Otros Recursos

- **Platillos**: Las recetas pertenecen a platillos → [Ver documentación](./dishes.md)
- **Ingredientes**: Las recetas utilizan ingredientes del inventario → [Ver documentación](./ingredients.md)

---

## Notas Adicionales

- La información del ingrediente se incluye como un objeto anidado `ingredient` con `id`, `name` y `unit`.
- Al obtener la receta de un platillo, se incluye el `stock` actual del ingrediente para facilitar la planificación.
- El campo `category` del ingrediente puede estar presente con información anidada de la categoría.
- Un platillo puede tener cero o más ingredientes en su receta.
- No se pueden agregar ingredientes duplicados a la misma receta.
- La cantidad (`quantityUsed`) representa la cantidad necesaria por porción o unidad del platillo.
- El endpoint PUT para reemplazar la receta elimina todos los ingredientes existentes y agrega los nuevos.
- Si se envía un array vacío en PUT, se eliminarán todos los ingredientes de la receta.
- Las unidades de medida se obtienen automáticamente de la configuración del ingrediente.
- **Las relaciones se eliminan físicamente**: Al eliminar un ingrediente de la receta, la relación se elimina permanentemente de la base de datos (no usa soft delete).
- Esta información es útil para calcular costos de platillos y gestionar el inventario.
- Los campos `createdAt` y `updatedAt` no se incluyen en las respuestas de la API.

---

## Ejemplo de Caso de Uso

### Crear una receta completa para un nuevo platillo

1. Primero, crear el platillo:

```http
POST /api/dishes
{
  "name": "Sopa de Pollo",
  "price": 12.00
}
```

2. Luego, agregar la receta completa:

```http
PUT /api/dishes/10/ingredients
{
  "ingredients": [
    { "ingredient_id": 1, "quantity_used": 0.5 },
    { "ingredient_id": 2, "quantity_used": 0.2 },
    { "ingredient_id": 7, "quantity_used": 0.1 }
  ]
}
```

3. Verificar la receta:

```http
GET /api/dishes/10/ingredients
```

---

[← Volver al índice](../README.md)
