# 📂 Categorías de Platillos (Dish Categories)

Gestión de categorías para organizar los platillos.

## 📋 Estructura del Objeto

| Campo         | Tipo     | Descripción                                    |
| :------------ | :------- | :--------------------------------------------- |
| `id`          | `number` | Identificador único de la categoría.           |
| `name`        | `string` | Nombre de la categoría.                        |
| `description` | `string` | Descripción de la categoría.                   |
| `status`      | `string` | Estado de la categoría: `Active` o `Inactive`. |

## 🔗 Endpoints

### 1. Listar Categorías

Obtiene una lista paginada de categorías de platillos.

**URL:** `/api/dish-categories`
**Método:** `GET`

**Parámetros de Consulta (Query Params):**

| Parámetro  | Tipo     | Descripción                               |
| :--------- | :------- | :---------------------------------------- |
| `page`     | `number` | Número de página (default: 1).            |
| `pageSize` | `number` | Cantidad por página (default: 10).        |
| `search`   | `string` | Buscar por nombre o descripción.          |
| `status`   | `string` | Filtrar por estado (`Active`/`Inactive`). |

**Ejemplo de Solicitud:**

```bash
curl -X GET "http://localhost:3000/api/dish-categories?page=1&pageSize=10"
```

**Ejemplo de Respuesta:**

```json
{
  "success": true,
  "message": "Dish categories retrieved successfully",
  "data": [
    {
      "id": 1,
      "name": "General",
      "description": "Platos que no encajan en otras categorías o son de tipo misceláneo.",
      "status": "Active"
    }
    // ...
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "pageSize": 10,
      "pageCount": 1,
      "total": 10,
      "hasNextPage": false,
      "hasPrevPage": false
    }
  },
  "timestamp": "2025-11-19T16:10:56.479Z"
}
```

### 2. Obtener Categoría por ID

Obtiene los detalles de una categoría específica.

**URL:** `/api/dish-categories/:id`
**Método:** `GET`

**Ejemplo de Solicitud:**

```bash
curl -X GET "http://localhost:3000/api/dish-categories/1"
```

**Ejemplo de Respuesta:**

```json
{
  "success": true,
  "message": "Dish category retrieved successfully",
  "data": {
    "id": 1,
    "name": "General",
    "description": "Platos que no encajan en otras categorías o son de tipo misceláneo.",
    "status": "Active"
  },
  "timestamp": "2025-11-19T16:10:56.479Z"
}
```

### 3. Crear Categoría

Registra una nueva categoría.

**URL:** `/api/dish-categories`
**Método:** `POST`
**Headers:** `Content-Type: application/json`

**Cuerpo de la Solicitud (Body):**

```json
{
  "name": "Nueva Categoría",
  "description": "Descripción de la nueva categoría",
  "status": "Active"
}
```

**Ejemplo de Respuesta:**

```json
{
  "success": true,
  "message": "Dish category created successfully",
  "data": {
    "id": 11,
    "name": "Nueva Categoría",
    "description": "Descripción de la nueva categoría",
    "status": "Active"
  },
  "timestamp": "2025-11-19T16:10:56.479Z"
}
```

### 4. Actualizar Categoría

Actualiza los datos de una categoría existente.

**URL:** `/api/dish-categories/:id`
**Método:** `PATCH`
**Headers:** `Content-Type: application/json`

**Cuerpo de la Solicitud (Body):**

```json
{
  "description": "Descripción actualizada"
}
```

**Ejemplo de Respuesta:**

```json
{
  "success": true,
  "message": "Dish category updated successfully",
  "data": {
    "id": 1,
    "name": "General",
    "description": "Descripción actualizada",
    "status": "Active"
  },
  "timestamp": "2025-11-19T16:10:56.479Z"
}
```

### 5. Eliminar Categoría

Marca una categoría como eliminada (soft delete).

**URL:** `/api/dish-categories/:id`
**Método:** `DELETE`

**Ejemplo de Respuesta:**

```json
{
  "success": true,
  "message": "Dish category deleted successfully",
  "data": {
    "id": 1,
    "name": "General",
    "status": "Inactive"
  },
  "timestamp": "2025-11-19T16:10:56.479Z"
}
```
