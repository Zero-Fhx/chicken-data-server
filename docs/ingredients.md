# 🥕 Ingredientes (Ingredients)

Gestión de ingredientes utilizados en la preparación de platillos.

## Descripción

Este recurso permite administrar los ingredientes disponibles en el inventario, incluyendo información sobre nombre, unidad de medida, categoría, stock y estado.

## Endpoints Disponibles

| Método   | Endpoint               | Descripción                    |
| -------- | ---------------------- | ------------------------------ |
| `GET`    | `/api/ingredients`     | Obtener todos los ingredientes |
| `GET`    | `/api/ingredients/:id` | Obtener un ingrediente por ID  |
| `POST`   | `/api/ingredients`     | Crear un nuevo ingrediente     |
| `PATCH`  | `/api/ingredients/:id` | Actualizar un ingrediente      |
| `DELETE` | `/api/ingredients/:id` | Eliminar un ingrediente        |

---

## GET /api/ingredients

Obtiene una lista paginada de todos los ingredientes.

### Parámetros de Consulta

| Parámetro    | Tipo      | Obligatorio | Descripción                                                |
| ------------ | --------- | ----------- | ---------------------------------------------------------- |
| `page`       | `number`  | No          | Número de página (por defecto: `1`)                        |
| `pageSize`   | `number`  | No          | Elementos por página (por defecto: `10`)                   |
| `search`     | `string`  | No          | Buscar por nombre                                          |
| `categoryId` | `number`  | No          | Filtrar por ID de categoría                                |
| `status`     | `string`  | No          | Filtrar por estado (`Active` o `Inactive`)                 |
| `lowStock`   | `boolean` | No          | Filtrar ingredientes con stock bajo (stock < minimumStock) |

### Ejemplo de Solicitud

```http
GET /api/ingredients?page=1&pageSize=10&status=Active&lowStock=true
```

### Ejemplo de Respuesta

```json
{
  "success": true,
  "message": "Ingredients retrieved successfully",
  "data": [
    {
      "id": 1,
      "name": "Pollo Entero",
      "unit": "kg",
      "status": "Available",
      "stock": 15.5,
      "minimumStock": 20.0,
      "category": {
        "id": 1,
        "name": "Carnes"
      }
    },
    {
      "id": 2,
      "name": "Arroz",
      "unit": "kg",
      "status": "Out of Stock",
      "stock": 8.0,
      "minimumStock": 10.0,
      "category": {
        "id": 2,
        "name": "Granos"
      }
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "pageSize": 10,
      "pageCount": 1,
      "total": 2,
      "hasNextPage": false,
      "hasPrevPage": false
    },
    "filters": {
      "status": "Active",
      "lowStock": true
    }
  },
  "timestamp": "2025-10-20T19:28:47.212Z"
}
```

---

## GET /api/ingredients/:id

Obtiene un ingrediente específico por su ID.

### Parámetros de Ruta

| Parámetro | Tipo     | Obligatorio | Descripción        |
| --------- | -------- | ----------- | ------------------ |
| `id`      | `number` | Sí          | ID del ingrediente |

### Ejemplo de Solicitud

```http
GET /api/ingredients/1
```

### Ejemplo de Respuesta

```json
{
  "success": true,
  "message": "Ingredient retrieved successfully",
  "data": {
    "id": 1,
    "name": "Pollo Entero",
    "unit": "kg",
    "status": "Available",
    "stock": 15.5,
    "minimumStock": 20.0,
    "category": {
      "id": 1,
      "name": "Carnes"
    }
  },
  "timestamp": "2025-10-20T19:28:47.212Z"
}
```

### Códigos de Estado

- `200` - Ingrediente encontrado exitosamente
- `400` - ID inválido
- `404` - Ingrediente no encontrado

---

## POST /api/ingredients

Crea un nuevo ingrediente en el sistema.

### Cuerpo de la Solicitud

| Campo          | Tipo     | Obligatorio | Descripción                                           |
| -------------- | -------- | ----------- | ----------------------------------------------------- |
| `name`         | `string` | Sí          | Nombre del ingrediente (máx. 100 caracteres)          |
| `unit`         | `string` | Sí          | Unidad de medida (máx. 20 caracteres)                 |
| `categoryId`   | `number` | No          | ID de la categoría (por defecto: `1`)                 |
| `status`       | `string` | No          | Estado: `Active` o `Inactive` (por defecto: `Active`) |
| `stock`        | `number` | No          | Cantidad en stock (por defecto: `0`)                  |
| `minimumStock` | `number` | No          | Stock mínimo recomendado (por defecto: `0`)           |

### Validaciones y Restricciones

| Campo          | Validación                                                                 |
| -------------- | -------------------------------------------------------------------------- |
| `name`         | Requerido, string no vacío, máximo 100 caracteres                          |
| `unit`         | Requerido, string no vacío, máximo 20 caracteres (ej: `kg`, `L`, `unidad`) |
| `categoryId`   | Opcional, debe ser un número entero positivo válido                        |
| `status`       | Opcional, debe ser `Active` o `Inactive`                                   |
| `stock`        | Opcional, debe ser un número >= 0                                          |
| `minimumStock` | Opcional, debe ser un número >= 0                                          |

### Ejemplo de Solicitud

```http
POST /api/ingredients
Content-Type: application/json

{
  "name": "Papas",
  "unit": "kg",
  "categoryId": 3,
  "status": "Active",
  "stock": 50.0,
  "minimumStock": 30.0
}
```

### Ejemplo de Respuesta

```json
{
  "success": true,
  "message": "Ingredient created successfully",
  "data": {
    "id": 5,
    "name": "Papas",
    "unit": "kg",
    "status": "Available",
    "stock": 50.0,
    "minimumStock": 30.0,
    "category": {
      "id": 3,
      "name": "Vegetales"
    }
  },
  "timestamp": "2025-10-20T19:28:47.212Z"
}
```

### Códigos de Estado

- `201` - Ingrediente creado exitosamente
- `400` - Datos de entrada inválidos
- `404` - Categoría no encontrada

---

## PATCH /api/ingredients/:id

Actualiza un ingrediente existente. Solo se actualizan los campos proporcionados.

### Parámetros de Ruta

| Parámetro | Tipo     | Obligatorio | Descripción                     |
| --------- | -------- | ----------- | ------------------------------- |
| `id`      | `number` | Sí          | ID del ingrediente a actualizar |

### Cuerpo de la Solicitud

| Campo          | Tipo     | Obligatorio | Descripción                         |
| -------------- | -------- | ----------- | ----------------------------------- |
| `name`         | `string` | No          | Nuevo nombre del ingrediente        |
| `unit`         | `string` | No          | Nueva unidad de medida              |
| `categoryId`   | `number` | No          | Nuevo ID de la categoría            |
| `status`       | `string` | No          | Nuevo estado: `Active` o `Inactive` |
| `stock`        | `number` | No          | Nueva cantidad en stock             |
| `minimumStock` | `number` | No          | Nuevo stock mínimo                  |

### Validaciones y Restricciones

| Campo          | Validación                                                            |
| -------------- | --------------------------------------------------------------------- |
| `name`         | Si se proporciona, debe ser un string no vacío, máximo 100 caracteres |
| `unit`         | Si se proporciona, debe ser un string no vacío, máximo 20 caracteres  |
| `categoryId`   | Si se proporciona, debe ser un número entero positivo válido          |
| `status`       | Si se proporciona, debe ser `Active` o `Inactive`                     |
| `stock`        | Si se proporciona, debe ser un número >= 0                            |
| `minimumStock` | Si se proporciona, debe ser un número >= 0                            |

### Ejemplo de Solicitud

```http
PATCH /api/ingredients/5
Content-Type: application/json

{
  "stock": 45.0,
  "minimumStock": 25.0
}
```

### Ejemplo de Respuesta

```json
{
  "success": true,
  "message": "Ingredient updated successfully",
  "data": {
    "id": 5,
    "name": "Papas",
    "unit": "kg",
    "status": "Available",
    "stock": 45.0,
    "minimumStock": 25.0,
    "category": {
      "id": 3,
      "name": "Vegetales"
    }
  },
  "timestamp": "2025-10-20T19:28:47.212Z"
}
```

### Códigos de Estado

- `200` - Ingrediente actualizado exitosamente
- `400` - Datos de entrada inválidos o ID inválido
- `404` - Ingrediente o categoría no encontrada

---

## DELETE /api/ingredients/:id

Elimina un ingrediente del sistema.

### Parámetros de Ruta

| Parámetro | Tipo     | Obligatorio | Descripción                   |
| --------- | -------- | ----------- | ----------------------------- |
| `id`      | `number` | Sí          | ID del ingrediente a eliminar |

### Ejemplo de Solicitud

```http
DELETE /api/ingredients/5
```

### Ejemplo de Respuesta

```json
{
  "success": true,
  "message": "Ingredient deleted successfully",
  "data": {
    "id": 5,
    "name": "Papas",
    "unit": "kg",
    "status": "Available",
    "stock": 45.0,
    "minimumStock": 25.0,
    "category": {
      "id": 3,
      "name": "Vegetales"
    }
  },
  "timestamp": "2025-10-20T19:28:47.212Z"
}
```

### Códigos de Estado

- `200` - Ingrediente eliminado exitosamente
- `400` - ID inválido
- `404` - Ingrediente no encontrado

---

## Estructura de Datos

### Objeto Ingredient

```typescript
{
  id: number; // ID único del ingrediente
  name: string; // Nombre del ingrediente
  unit: string; // Unidad de medida (kg, L, unidad, etc.)
  status: "Available" | "Out of Stock"; // Estado del ingrediente
  stock: number; // Cantidad disponible en inventario
  minimumStock: number; // Stock mínimo recomendado
  category: {
    id: number; // ID de la categoría
    name: string; // Nombre de la categoría
  }
}
```

---

## Relaciones con Otros Recursos

- **Categorías de Ingredientes**: Un ingrediente pertenece a una categoría → [Ver documentación](./ingredient-categories.md)
- **Recetas de Platillos**: Los ingredientes se asocian a platillos mediante recetas → [Ver documentación](./dish-ingredients.md)
- **Compras**: Los ingredientes se adquieren mediante compras que actualizan el stock → [Ver documentación](./purchases.md)

---

## Notas Adicionales

- La información de la categoría se incluye como un objeto anidado `category` con `id` y `name`.
- Si no se especifica un `categoryId` al crear un ingrediente, se asigna la categoría por defecto (ID: 1).
- El stock se actualiza automáticamente al registrar compras de ingredientes.
- El filtro `lowStock=true` permite identificar ingredientes que necesitan reabastecimiento.
- Las unidades de medida son texto libre, se recomienda usar unidades estándar como `kg`, `L`, `g`, `ml`, `unidad`, etc.
- **Los datos no se eliminan físicamente**: Al eliminar un ingrediente, se marca con `deleted_at` (soft delete) pero permanece en la base de datos para mantener el historial.
- Los campos `createdAt`, `updatedAt` y `deleted_at` no se incluyen en las respuestas de la API.

---

[← Volver al índice](../README.md)
