# 📂 Categorías de Platillos (Dish Categories)

Gestión de categorías para organizar los platillos del menú.

## Descripción

Este recurso permite administrar las categorías que se utilizan para clasificar y organizar los platillos del restaurante (por ejemplo: Platos Principales, Entradas, Postres, Bebidas, etc.).

## Endpoints Disponibles

| Método   | Endpoint                   | Descripción                  |
| -------- | -------------------------- | ---------------------------- |
| `GET`    | `/api/dish-categories`     | Obtener todas las categorías |
| `GET`    | `/api/dish-categories/:id` | Obtener una categoría por ID |
| `POST`   | `/api/dish-categories`     | Crear una nueva categoría    |
| `PATCH`  | `/api/dish-categories/:id` | Actualizar una categoría     |
| `DELETE` | `/api/dish-categories/:id` | Eliminar una categoría       |

---

## GET /api/dish-categories

Obtiene una lista paginada de todas las categorías de platillos.

### Parámetros de Consulta

| Parámetro  | Tipo     | Obligatorio | Descripción                                |
| ---------- | -------- | ----------- | ------------------------------------------ |
| `page`     | `number` | No          | Número de página (por defecto: `1`)        |
| `pageSize` | `number` | No          | Elementos por página (por defecto: `10`)   |
| `search`   | `string` | No          | Buscar por nombre o descripción            |
| `status`   | `string` | No          | Filtrar por estado (`Active` o `Inactive`) |

### Ejemplo de Solicitud

```http
GET /api/dish-categories?page=1&pageSize=10&status=Active
```

### Ejemplo de Respuesta

```json
{
  "success": true,
  "message": "Dish categories retrieved successfully",
  "data": [
    {
      "id": 1,
      "name": "Platos Principales",
      "description": "Platos principales del menú",
      "status": "Active"
    },
    {
      "id": 2,
      "name": "Entradas",
      "description": "Entradas y aperitivos",
      "status": "Active"
    },
    {
      "id": 3,
      "name": "Bebidas",
      "description": "Bebidas frías y calientes",
      "status": "Active"
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "pageSize": 10,
      "pageCount": 1,
      "total": 3,
      "hasNextPage": false,
      "hasPrevPage": false
    },
    "filters": {
      "status": "Active"
    }
  },
  "timestamp": "2025-10-20T19:28:47.212Z"
}
```

---

## GET /api/dish-categories/:id

Obtiene una categoría específica por su ID.

### Parámetros de Ruta

| Parámetro | Tipo     | Obligatorio | Descripción        |
| --------- | -------- | ----------- | ------------------ |
| `id`      | `number` | Sí          | ID de la categoría |

### Ejemplo de Solicitud

```http
GET /api/dish-categories/1
```

### Ejemplo de Respuesta

```json
{
  "success": true,
  "message": "Dish category retrieved successfully",
  "data": {
    "id": 1,
    "name": "Platos Principales",
    "description": "Platos principales del menú",
    "status": "Active"
  },
  "timestamp": "2025-10-20T19:28:47.212Z"
}
```

### Códigos de Estado

- `200` - Categoría encontrada exitosamente
- `400` - ID inválido
- `404` - Categoría no encontrada

---

## POST /api/dish-categories

Crea una nueva categoría de platillos.

### Cuerpo de la Solicitud

| Campo         | Tipo     | Obligatorio | Descripción                                           |
| ------------- | -------- | ----------- | ----------------------------------------------------- |
| `name`        | `string` | Sí          | Nombre de la categoría (máx. 50 caracteres)           |
| `description` | `string` | No          | Descripción de la categoría                           |
| `status`      | `string` | No          | Estado: `Active` o `Inactive` (por defecto: `Active`) |

### Validaciones y Restricciones

| Campo         | Validación                                       |
| ------------- | ------------------------------------------------ |
| `name`        | Requerido, string no vacío, máximo 50 caracteres |
| `description` | Opcional, puede ser `null`                       |
| `status`      | Opcional, debe ser `Active` o `Inactive`         |

### Ejemplo de Solicitud

```http
POST /api/dish-categories
Content-Type: application/json

{
  "name": "Postres",
  "description": "Postres y dulces",
  "status": "Active"
}
```

### Ejemplo de Respuesta

```json
{
  "success": true,
  "message": "Dish category created successfully",
  "data": {
    "id": 4,
    "name": "Postres",
    "description": "Postres y dulces",
    "status": "Active"
  },
  "timestamp": "2025-10-20T19:28:47.212Z"
}
```

### Códigos de Estado

- `201` - Categoría creada exitosamente
- `400` - Datos de entrada inválidos

---

## PATCH /api/dish-categories/:id

Actualiza una categoría existente. Solo se actualizan los campos proporcionados.

### Parámetros de Ruta

| Parámetro | Tipo     | Obligatorio | Descripción                     |
| --------- | -------- | ----------- | ------------------------------- |
| `id`      | `number` | Sí          | ID de la categoría a actualizar |

### Cuerpo de la Solicitud

| Campo         | Tipo     | Obligatorio | Descripción                         |
| ------------- | -------- | ----------- | ----------------------------------- |
| `name`        | `string` | No          | Nuevo nombre de la categoría        |
| `description` | `string` | No          | Nueva descripción                   |
| `status`      | `string` | No          | Nuevo estado: `Active` o `Inactive` |

### Validaciones y Restricciones

| Campo         | Validación                                                           |
| ------------- | -------------------------------------------------------------------- |
| `name`        | Si se proporciona, debe ser un string no vacío, máximo 50 caracteres |
| `description` | Si se proporciona, puede ser `null`                                  |
| `status`      | Si se proporciona, debe ser `Active` o `Inactive`                    |

### Ejemplo de Solicitud

```http
PATCH /api/dish-categories/4
Content-Type: application/json

{
  "description": "Postres caseros y helados"
}
```

### Ejemplo de Respuesta

```json
{
  "success": true,
  "message": "Dish category updated successfully",
  "data": {
    "id": 4,
    "name": "Postres",
    "description": "Postres caseros y helados",
    "status": "Active"
  },
  "timestamp": "2025-10-20T19:28:47.212Z"
}
```

### Códigos de Estado

- `200` - Categoría actualizada exitosamente
- `400` - Datos de entrada inválidos o ID inválido
- `404` - Categoría no encontrada

---

## DELETE /api/dish-categories/:id

Elimina una categoría del sistema.

### Parámetros de Ruta

| Parámetro | Tipo     | Obligatorio | Descripción                   |
| --------- | -------- | ----------- | ----------------------------- |
| `id`      | `number` | Sí          | ID de la categoría a eliminar |

### Ejemplo de Solicitud

```http
DELETE /api/dish-categories/4
```

### Ejemplo de Respuesta

```json
{
  "success": true,
  "message": "Dish category deleted successfully",
  "data": {
    "id": 4,
    "name": "Postres",
    "description": "Postres caseros y helados",
    "status": "Active"
  },
  "timestamp": "2025-10-20T19:28:47.212Z"
}
```

### Códigos de Estado

- `200` - Categoría eliminada exitosamente
- `400` - ID inválido
- `404` - Categoría no encontrada

---

## Estructura de Datos

### Objeto DishCategory

```typescript
{
  id: number; // ID único de la categoría
  name: string; // Nombre de la categoría
  description: string | null; // Descripción detallada
  status: "Active" | "Inactive"; // Estado de la categoría
}
```

---

## Relaciones con Otros Recursos

- **Platillos**: Los platillos pertenecen a categorías → [Ver documentación](./dishes.md)

---

## Notas Adicionales

- El campo `description` puede ser `null` si no se proporciona.
- Existe una categoría por defecto con ID: 1 que se asigna a los platillos sin categoría específica.
- Al eliminar una categoría, los platillos asociados no se eliminan, pero quedarán sin categoría válida.
- Se recomienda marcar categorías como `Inactive` en lugar de eliminarlas para mantener la integridad de los datos.
- Las categorías activas se pueden usar para filtrar y organizar el menú del restaurante.
- **Los datos no se eliminan físicamente**: Al eliminar una categoría, se marca con `deleted_at` (soft delete) pero permanece en la base de datos para mantener el historial.
- Los campos `createdAt`, `updatedAt` y `deleted_at` no se incluyen en las respuestas de la API.

---

[← Volver al índice](../README.md)
