# 🍽️ Platillos (Dishes)

Gestión de platillos del menú del restaurante.

## Descripción

Este recurso permite administrar los platillos disponibles en el menú del restaurante, incluyendo información sobre nombre, descripción, categoría, precio y estado.

## Endpoints Disponibles

| Método   | Endpoint          | Descripción                 |
| -------- | ----------------- | --------------------------- |
| `GET`    | `/api/dishes`     | Obtener todos los platillos |
| `GET`    | `/api/dishes/:id` | Obtener un platillo por ID  |
| `POST`   | `/api/dishes`     | Crear un nuevo platillo     |
| `PATCH`  | `/api/dishes/:id` | Actualizar un platillo      |
| `DELETE` | `/api/dishes/:id` | Eliminar un platillo        |

---

## GET /api/dishes

Obtiene una lista paginada de todos los platillos.

### Parámetros de Consulta

| Parámetro    | Tipo      | Obligatorio | Descripción                                                         |
| ------------ | --------- | ----------- | ------------------------------------------------------------------- |
| `page`       | `number`  | No          | Número de página (por defecto: `1`)                                 |
| `pageSize`   | `number`  | No          | Elementos por página (por defecto: `10`)                            |
| `search`     | `string`  | No          | Buscar por nombre o descripción                                     |
| `categoryId` | `number`  | No          | Filtrar por ID de categoría                                         |
| `minPrice`   | `number`  | No          | Precio mínimo del platillo                                          |
| `maxPrice`   | `number`  | No          | Precio máximo del platillo                                          |
| `status`     | `string`  | No          | Filtrar por estado (`Active` o `Inactive`)                          |
| `checkStock` | `boolean` | No          | Incluir información de stock de ingredientes (por defecto: `false`) |

### Ejemplo de Solicitud

```http
GET /api/dishes?page=1&pageSize=10&status=Active&checkStock=true
```

### Ejemplo de Respuesta

```json
{
  "success": true,
  "message": "Dishes retrieved successfully",
  "data": [
    {
      "id": 1,
      "name": "Pollo a la Brasa",
      "description": "Pollo marinado con especias especiales",
      "price": 25.5,
      "status": "Active",
      "category": {
        "id": 1,
        "name": "Platos Principales"
      },
      "stockInfo": {
        "hasIngredients": true,
        "hasSufficientStock": true
      }
    },
    {
      "id": 2,
      "name": "Arroz con Pollo",
      "description": "Arroz con pollo y vegetales",
      "price": 18.0,
      "status": "Active",
      "category": {
        "id": 1,
        "name": "Platos Principales"
      },
      "stockInfo": {
        "hasIngredients": true,
        "hasSufficientStock": false,
        "insufficientIngredients": [
          {
            "ingredientId": 5,
            "name": "Arroz",
            "required": 0.5,
            "available": 0.2,
            "shortfall": 0.3,
            "unit": "kg"
          }
        ]
      }
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 10,
    "pageCount": 1,
    "total": 2
  },
  "filters": {
    "status": "Active"
  }
}
```

**Nota**: El campo `stockInfo` solo se incluye cuando se usa el parámetro `checkStock=true`. Contiene:

- `hasIngredients`: Indica si el plato tiene ingredientes configurados
- `hasSufficientStock`: Indica si hay stock suficiente para preparar el plato
- `insufficientIngredients`: Lista de ingredientes que no tienen stock suficiente (solo si `hasSufficientStock` es `false`)

---

## GET /api/dishes/:id

Obtiene un platillo específico por su ID.

### Parámetros de Ruta

| Parámetro | Tipo     | Obligatorio | Descripción     |
| --------- | -------- | ----------- | --------------- |
| `id`      | `number` | Sí          | ID del platillo |

### Parámetros de Consulta

| Parámetro    | Tipo      | Obligatorio | Descripción                                                         |
| ------------ | --------- | ----------- | ------------------------------------------------------------------- |
| `checkStock` | `boolean` | No          | Incluir información de stock de ingredientes (por defecto: `false`) |

### Ejemplo de Solicitud

```http
GET /api/dishes/1?checkStock=true
```

### Ejemplo de Respuesta

```json
{
  "success": true,
  "message": "Dish retrieved successfully",
  "data": {
    "id": 1,
    "name": "Pollo a la Brasa",
    "description": "Pollo marinado con especias especiales",
    "price": 25.5,
    "status": "Active",
    "category": {
      "id": 1,
      "name": "Platos Principales"
    }
  },
  "timestamp": "2025-10-20T19:28:47.212Z"
}
```

### Códigos de Estado

- `200` - Platillo encontrado exitosamente
- `400` - ID inválido
- `404` - Platillo no encontrado

---

## POST /api/dishes

Crea un nuevo platillo en el sistema.

### Cuerpo de la Solicitud

| Campo         | Tipo     | Obligatorio | Descripción                                                        |
| ------------- | -------- | ----------- | ------------------------------------------------------------------ |
| `name`        | `string` | Sí          | Nombre del platillo                                                |
| `description` | `string` | No          | Descripción del platillo                                           |
| `categoryId`  | `number` | No          | ID de la categoría (por defecto: `1`)                              |
| `price`       | `number` | Sí          | Precio del platillo (debe ser >= 0)                                |
| `status`      | `string` | No          | Estado del platillo: `Active` o `Inactive` (por defecto: `Active`) |

### Validaciones y Restricciones

| Campo         | Validación                                          |
| ------------- | --------------------------------------------------- |
| `name`        | Requerido, debe ser un string no vacío              |
| `description` | Opcional, debe ser un string o `null`               |
| `categoryId`  | Opcional, debe ser un número entero positivo válido |
| `price`       | Requerido, debe ser un número >= 0                  |
| `status`      | Opcional, debe ser `Active` o `Inactive`            |

### Ejemplo de Solicitud

```http
POST /api/dishes
Content-Type: application/json

{
  "name": "Alitas Picantes",
  "description": "Alitas de pollo con salsa picante",
  "categoryId": 2,
  "price": 15.00,
  "status": "Active"
}
```

### Ejemplo de Respuesta

```json
{
  "success": true,
  "message": "Dish created successfully",
  "data": {
    "id": 3,
    "name": "Alitas Picantes",
    "description": "Alitas de pollo con salsa picante",
    "price": 15.0,
    "status": "Active",
    "category": {
      "id": 2,
      "name": "Entradas"
    }
  },
  "timestamp": "2025-10-20T19:28:47.212Z"
}
```

### Códigos de Estado

- `201` - Platillo creado exitosamente
- `400` - Datos de entrada inválidos
- `404` - Categoría no encontrada

---

## PATCH /api/dishes/:id

Actualiza un platillo existente. Solo se actualizan los campos proporcionados.

### Parámetros de Ruta

| Parámetro | Tipo     | Obligatorio | Descripción                  |
| --------- | -------- | ----------- | ---------------------------- |
| `id`      | `number` | Sí          | ID del platillo a actualizar |

### Cuerpo de la Solicitud

| Campo         | Tipo     | Obligatorio | Descripción                         |
| ------------- | -------- | ----------- | ----------------------------------- |
| `name`        | `string` | No          | Nuevo nombre del platillo           |
| `description` | `string` | No          | Nueva descripción del platillo      |
| `categoryId`  | `number` | No          | Nuevo ID de la categoría            |
| `price`       | `number` | No          | Nuevo precio del platillo           |
| `status`      | `string` | No          | Nuevo estado: `Active` o `Inactive` |

### Validaciones y Restricciones

| Campo         | Validación                                                   |
| ------------- | ------------------------------------------------------------ |
| `name`        | Si se proporciona, debe ser un string no vacío               |
| `description` | Si se proporciona, debe ser un string o `null`               |
| `categoryId`  | Si se proporciona, debe ser un número entero positivo válido |
| `price`       | Si se proporciona, debe ser un número >= 0                   |
| `status`      | Si se proporciona, debe ser `Active` o `Inactive`            |

### Ejemplo de Solicitud

```http
PATCH /api/dishes/3
Content-Type: application/json

{
  "price": 16.50,
  "status": "Inactive"
}
```

### Ejemplo de Respuesta

```json
{
  "success": true,
  "message": "Dish updated successfully",
  "data": {
    "id": 3,
    "name": "Alitas Picantes",
    "description": "Alitas de pollo con salsa picante",
    "price": 16.5,
    "status": "Inactive",
    "category": {
      "id": 2,
      "name": "Entradas"
    }
  },
  "timestamp": "2025-10-20T19:28:47.212Z"
}
```

### Códigos de Estado

- `200` - Platillo actualizado exitosamente
- `400` - Datos de entrada inválidos o ID inválido
- `404` - Platillo o categoría no encontrada

---

## DELETE /api/dishes/:id

Elimina un platillo del sistema.

### Parámetros de Ruta

| Parámetro | Tipo     | Obligatorio | Descripción                |
| --------- | -------- | ----------- | -------------------------- |
| `id`      | `number` | Sí          | ID del platillo a eliminar |

### Ejemplo de Solicitud

```http
DELETE /api/dishes/3
```

### Ejemplo de Respuesta

```json
{
  "success": true,
  "message": "Dish deleted successfully",
  "data": {
    "id": 3,
    "name": "Alitas Picantes",
    "description": "Alitas de pollo con salsa picante",
    "price": 16.5,
    "status": "Inactive",
    "category": {
      "id": 2,
      "name": "Entradas"
    }
  },
  "timestamp": "2025-10-20T19:28:47.212Z"
}
```

### Códigos de Estado

- `200` - Platillo eliminado exitosamente
- `400` - ID inválido
- `404` - Platillo no encontrado

---

## Estructura de Datos

### Objeto Dish

```typescript
{
  id: number                 // ID único del platillo
  name: string               // Nombre del platillo
  description?: string       // Descripción detallada (opcional)
  price: number              // Precio en la moneda local
  status: "Active" | "Inactive" // Estado del platillo
  category?: {               // Categoría del platillo (opcional)
    id: number               // ID de la categoría
    name: string             // Nombre de la categoría
  }
}
```

---

## Relaciones con Otros Recursos

- **Categorías de Platillos**: Un platillo pertenece a una categoría → [Ver documentación](./dish-categories.md)
- **Recetas**: Un platillo puede tener múltiples ingredientes asociados → [Ver documentación](./dish-ingredients.md)
- **Ventas**: Los platillos se pueden vender en las transacciones de venta → [Ver documentación](./sales.md)

---

## Notas Adicionales

- La información de la categoría se incluye como un objeto anidado `category` con `id` y `name`.
- Si no se especifica un `categoryId` al crear un platillo, se asigna la categoría por defecto (ID: 1).
- El campo `description` es opcional y puede omitirse si no se proporciona información adicional.
- Los precios deben ser números positivos o cero.
- **Los datos no se eliminan físicamente**: Al eliminar un platillo, se marca con `deleted_at` (soft delete) pero permanece en la base de datos para mantener el historial.
- Los campos `createdAt`, `updatedAt` y `deleted_at` no se incluyen en las respuestas de la API.

---

[← Volver al índice](../README.md)
