# 🍗 Platillos (Dishes)

Gestión de los platillos del menú.

## 📋 Estructura del Objeto

| Campo         | Tipo     | Descripción                                         |
| :------------ | :------- | :-------------------------------------------------- |
| `id`          | `number` | Identificador único del platillo (autoincremental). |
| `name`        | `string` | Nombre del platillo.                                |
| `description` | `string` | Descripción detallada del platillo.                 |
| `price`       | `number` | Precio de venta unitario.                           |
| `status`      | `string` | Estado del platillo: `Active` o `Inactive`.         |
| `category`    | `object` | Objeto con `id` y `name` de la categoría.           |

## 🔗 Endpoints

### 1. Listar Platillos

Obtiene una lista paginada de platillos.

**URL:** `/api/dishes`
**Método:** `GET`

**Parámetros de Consulta (Query Params):**

| Parámetro    | Tipo      | Descripción                                           |
| :----------- | :-------- | :---------------------------------------------------- |
| `page`       | `number`  | Número de página (default: 1).                        |
| `pageSize`   | `number`  | Cantidad por página (default: 10).                    |
| `search`     | `string`  | Buscar por nombre o descripción.                      |
| `categoryId` | `number`  | Filtrar por ID de categoría.                          |
| `minPrice`   | `number`  | Precio mínimo.                                        |
| `maxPrice`   | `number`  | Precio máximo.                                        |
| `hasStock`   | `boolean` | Filtrar por disponibilidad de stock (`true`/`false`). |
| `status`     | `string`  | Filtrar por estado (`Active`/`Inactive`).             |

**Ejemplo de Solicitud:**

```bash
curl -X GET "http://localhost:3000/api/dishes?page=1&pageSize=10"
```

**Ejemplo de Respuesta:**

```json
{
  "success": true,
  "message": "Dishes retrieved successfully",
  "data": [
    {
      "id": 35,
      "name": "Alitas BBQ (6und)",
      "description": "Alitas de pollo bañadas en salsa BBQ.",
      "price": 21,
      "status": "Active",
      "category": {
        "id": 1,
        "name": "General"
      },
      "hasSufficientStock": true
    }
    // ...
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "pageSize": 10,
      "pageCount": 4,
      "total": 35,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  },
  "timestamp": "2025-11-19T16:10:30.188Z"
}
```

### 2. Obtener Platillo por ID

Obtiene los detalles de un platillo específico.

**URL:** `/api/dishes/:id`
**Método:** `GET`

**Parámetros de Consulta (Query Params):**

| Parámetro    | Tipo      | Descripción                                         |
| :----------- | :-------- | :-------------------------------------------------- |
| `checkStock` | `boolean` | Verificar si hay stock suficiente (`true`/`false`). |

**Ejemplo de Solicitud:**

```bash
curl -X GET "http://localhost:3000/api/dishes/35"
```

**Ejemplo de Respuesta:**

```json
{
  "success": true,
  "message": "Dish retrieved successfully",
  "data": {
    "id": 35,
    "name": "Alitas BBQ (6und)",
    "description": "Alitas de pollo bañadas en salsa BBQ.",
    "price": 21,
    "status": "Active",
    "category": {
      "id": 1,
      "name": "General"
    },
    "hasSufficientStock": true
  },
  "timestamp": "2025-11-19T16:10:30.188Z"
}
```

### 3. Crear Platillo

Registra un nuevo platillo.

**URL:** `/api/dishes`
**Método:** `POST`
**Headers:** `Content-Type: application/json`

**Cuerpo de la Solicitud (Body):**

```json
{
  "name": "Nuevo Platillo",
  "description": "Descripción del nuevo platillo",
  "price": 25.5,
  "categoryId": 1,
  "status": "Active"
}
```

**Ejemplo de Respuesta:**

```json
{
  "success": true,
  "message": "Dish created successfully",
  "data": {
    "id": 36,
    "name": "Nuevo Platillo",
    "description": "Descripción del nuevo platillo",
    "price": 25.5,
    "status": "Active",
    "category": {
      "id": 1,
      "name": "General"
    }
  },
  "timestamp": "2025-11-19T16:10:30.188Z"
}
```

### 4. Actualizar Platillo

Actualiza los datos de un platillo existente.

**URL:** `/api/dishes/:id`
**Método:** `PATCH`
**Headers:** `Content-Type: application/json`

**Cuerpo de la Solicitud (Body):**

```json
{
  "price": 28.0,
  "status": "Inactive"
}
```

**Ejemplo de Respuesta:**

```json
{
  "success": true,
  "message": "Dish updated successfully",
  "data": {
    "id": 35,
    "name": "Alitas BBQ (6und)",
    "description": "Alitas de pollo bañadas en salsa BBQ.",
    "price": 28.0,
    "status": "Inactive",
    "category": {
      "id": 1,
      "name": "General"
    }
  },
  "timestamp": "2025-11-19T16:10:30.188Z"
}
```

### 5. Eliminar Platillo

Marca un platillo como eliminado (soft delete).

**URL:** `/api/dishes/:id`
**Método:** `DELETE`

**Ejemplo de Respuesta:**

```json
{
  "success": true,
  "message": "Dish deleted successfully",
  "data": {
    "id": 35,
    "name": "Alitas BBQ (6und)",
    "status": "Inactive"
  },
  "timestamp": "2025-11-19T16:10:30.188Z"
}
```
