# 🥦 Ingredientes (Ingredients)

Gestión del inventario de ingredientes.

## 📋 Estructura del Objeto

| Campo          | Tipo      | Descripción                                         |
| :------------- | :-------- | :-------------------------------------------------- |
| `id`           | `number`  | Identificador único del ingrediente.                |
| `name`         | `string`  | Nombre del ingrediente.                             |
| `unit`         | `string`  | Unidad de medida (ej: kg, unidad, litro).           |
| `stock`        | `number`  | Cantidad actual en inventario.                      |
| `minimumStock` | `number`  | Stock mínimo para alertas.                          |
| `status`       | `string`  | Estado del ingrediente: `Active` o `Inactive`.      |
| `category`     | `object`  | Objeto con `id` y `name` de la categoría.           |
| `isInUse`      | `boolean` | Indica si el ingrediente es usado en alguna receta. |

## 🔗 Endpoints

### 1. Listar Ingredientes

Obtiene una lista paginada de ingredientes.

**URL:** `/api/ingredients`
**Método:** `GET`

**Parámetros de Consulta (Query Params):**

| Parámetro    | Tipo      | Descripción                                           |
| :----------- | :-------- | :---------------------------------------------------- |
| `page`       | `number`  | Número de página (default: 1).                        |
| `pageSize`   | `number`  | Cantidad por página (default: 10).                    |
| `search`     | `string`  | Buscar por nombre.                                    |
| `categoryId` | `number`  | Filtrar por ID de categoría.                          |
| `lowStock`   | `boolean` | Filtrar ingredientes con stock bajo (`true`/`false`). |
| `status`     | `string`  | Filtrar por estado (`Active`/`Inactive`).             |

**Ejemplo de Solicitud:**

```bash
curl -X GET "http://localhost:3000/api/ingredients?page=1&pageSize=10"
```

**Ejemplo de Respuesta:**

```json
{
  "success": true,
  "message": "Ingredients retrieved successfully",
  "data": [
    {
      "id": 40,
      "name": "Servilletas de Papel",
      "unit": "paquete",
      "status": "Active",
      "stock": 200,
      "minimumStock": 50,
      "category": {
        "id": 1,
        "name": "General"
      },
      "isInUse": false
    }
    // ...
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "pageSize": 10,
      "pageCount": 4,
      "total": 40,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  },
  "timestamp": "2025-11-19T16:10:34.195Z"
}
```

### 2. Obtener Ingrediente por ID

Obtiene los detalles de un ingrediente específico.

**URL:** `/api/ingredients/:id`
**Método:** `GET`

**Ejemplo de Solicitud:**

```bash
curl -X GET "http://localhost:3000/api/ingredients/40"
```

**Ejemplo de Respuesta:**

```json
{
  "success": true,
  "message": "Ingredient retrieved successfully",
  "data": {
    "id": 40,
    "name": "Servilletas de Papel",
    "unit": "paquete",
    "status": "Active",
    "stock": 200,
    "minimumStock": 50,
    "category": {
      "id": 1,
      "name": "General"
    },
    "isInUse": false
  },
  "timestamp": "2025-11-19T16:10:34.195Z"
}
```

### 3. Crear Ingrediente

Registra un nuevo ingrediente.

**URL:** `/api/ingredients`
**Método:** `POST`
**Headers:** `Content-Type: application/json`

**Cuerpo de la Solicitud (Body):**

```json
{
  "name": "Nuevo Ingrediente",
  "unit": "kg",
  "stock": 10,
  "minimumStock": 5,
  "categoryId": 1,
  "status": "Active"
}
```

**Ejemplo de Respuesta:**

```json
{
  "success": true,
  "message": "Ingredient created successfully",
  "data": {
    "id": 41,
    "name": "Nuevo Ingrediente",
    "unit": "kg",
    "stock": 10,
    "minimumStock": 5,
    "status": "Active",
    "category": {
      "id": 1,
      "name": "General"
    },
    "isInUse": false
  },
  "timestamp": "2025-11-19T16:10:34.195Z"
}
```

### 4. Actualizar Ingrediente

Actualiza los datos de un ingrediente existente.

**URL:** `/api/ingredients/:id`
**Método:** `PATCH`
**Headers:** `Content-Type: application/json`

**Cuerpo de la Solicitud (Body):**

```json
{
  "stock": 15,
  "minimumStock": 8
}
```

**Ejemplo de Respuesta:**

```json
{
  "success": true,
  "message": "Ingredient updated successfully",
  "data": {
    "id": 40,
    "name": "Servilletas de Papel",
    "unit": "paquete",
    "status": "Active",
    "stock": 15,
    "minimumStock": 8,
    "category": {
      "id": 1,
      "name": "General"
    },
    "isInUse": false
  },
  "timestamp": "2025-11-19T16:10:34.195Z"
}
```

### 5. Eliminar Ingrediente

Marca un ingrediente como eliminado (soft delete).

**URL:** `/api/ingredients/:id`
**Método:** `DELETE`

**Ejemplo de Respuesta:**

```json
{
  "success": true,
  "message": "Ingredient deleted successfully",
  "data": {
    "id": 40,
    "name": "Servilletas de Papel",
    "status": "Inactive"
  },
  "timestamp": "2025-11-19T16:10:34.195Z"
}
```
