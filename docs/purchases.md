# 🛒 Compras (Purchases)

Gestión de compras de ingredientes a proveedores.

## 📋 Estructura del Objeto

| Campo          | Tipo     | Descripción                                     |
| :------------- | :------- | :---------------------------------------------- |
| `id`           | `number` | Identificador único de la compra.               |
| `purchaseDate` | `string` | Fecha de la compra (ISO 8601).                  |
| `total`        | `number` | Monto total de la compra.                       |
| `status`       | `string` | Estado de la compra: `Completed` o `Cancelled`. |
| `notes`        | `string` | Notas adicionales sobre la compra.              |
| `supplier`     | `object` | Datos del proveedor (`id`, `name`, etc.).       |
| `details`      | `array`  | Lista de detalles de la compra (ingredientes).  |

### Detalle de Compra (Item en `details`)

| Campo        | Tipo     | Descripción                                         |
| :----------- | :------- | :-------------------------------------------------- |
| `id`         | `number` | Identificador del detalle.                          |
| `quantity`   | `number` | Cantidad comprada.                                  |
| `unitPrice`  | `number` | Precio unitario.                                    |
| `subtotal`   | `number` | Subtotal (cantidad \* precio unitario).             |
| `ingredient` | `object` | Datos del ingrediente (`id`, `name`, `unit`, etc.). |

## 🔗 Endpoints

### 1. Listar Compras

Obtiene una lista paginada de compras.

**URL:** `/api/purchases`
**Método:** `GET`

**Parámetros de Consulta (Query Params):**

| Parámetro    | Tipo     | Descripción                                   |
| :----------- | :------- | :-------------------------------------------- |
| `page`       | `number` | Número de página (default: 1).                |
| `pageSize`   | `number` | Cantidad por página (default: 10).            |
| `startDate`  | `string` | Filtrar por fecha inicio (YYYY-MM-DD).        |
| `endDate`    | `string` | Filtrar por fecha fin (YYYY-MM-DD).           |
| `supplierId` | `number` | Filtrar por proveedor.                        |
| `status`     | `string` | Filtrar por estado (`Completed`/`Cancelled`). |

**Ejemplo de Solicitud:**

```bash
curl -X GET "http://localhost:3000/api/purchases?page=1&pageSize=10"
```

**Ejemplo de Respuesta:**

```json
{
  "success": true,
  "message": "Purchases retrieved successfully",
  "data": [
    {
      "id": 137,
      "purchaseDate": "2025-11-08T05:00:00.000Z",
      "total": 481.21,
      "status": "Completed",
      "notes": "Stock de seguridad de ingredientes principales.",
      "supplier": {
        "id": 9,
        "name": "Panadería y Postres Finos",
        "ruc": "20901234569",
        "phone": "910987654",
        "email": "info@postresfinos.com",
        "address": "Av. Los Hornos 606, Breña",
        "contactPerson": "Sofía Vidal",
        "status": "Active"
      },
      "details": [
        {
          "id": 1915,
          "quantity": 171,
          "unitPrice": 1.61,
          "subtotal": 275.31,
          "ingredient": {
            "id": 1,
            "name": "Pollo Entero (2.0kg)",
            "unit": "unidad",
            "status": "Active",
            "stock": 15,
            "minimumStock": 50,
            "category": {
              "id": 2,
              "name": "Carnes de Ave"
            }
          }
        }
      ]
    }
    // ...
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "pageSize": 10,
      "pageCount": 14,
      "total": 137,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  },
  "timestamp": "2025-11-19T16:10:46.820Z"
}
```

### 2. Obtener Compra por ID

Obtiene los detalles de una compra específica.

**URL:** `/api/purchases/:id`
**Método:** `GET`

**Ejemplo de Solicitud:**

```bash
curl -X GET "http://localhost:3000/api/purchases/137"
```

**Ejemplo de Respuesta:**

```json
{
  "success": true,
  "message": "Purchase retrieved successfully",
  "data": {
    "id": 137,
    "purchaseDate": "2025-11-08T05:00:00.000Z",
    "total": 481.21,
    "status": "Completed",
    "notes": "Stock de seguridad de ingredientes principales.",
    "supplier": {
      "id": 9,
      "name": "Panadería y Postres Finos",
      "status": "Active"
    },
    "details": [
      {
        "id": 1915,
        "quantity": 171,
        "unitPrice": 1.61,
        "subtotal": 275.31,
        "ingredient": {
          "id": 1,
          "name": "Pollo Entero (2.0kg)",
          "unit": "unidad"
        }
      }
    ]
  },
  "timestamp": "2025-11-19T16:10:46.820Z"
}
```

### 3. Registrar Compra

Registra una nueva compra y actualiza el stock de los ingredientes.

**URL:** `/api/purchases`
**Método:** `POST`
**Headers:** `Content-Type: application/json`

**Cuerpo de la Solicitud (Body):**

```json
{
  "supplierId": 9,
  "purchaseDate": "2025-11-20",
  "notes": "Compra de prueba",
  "details": [
    {
      "ingredientId": 1,
      "quantity": 10,
      "unitPrice": 5.5
    },
    {
      "ingredientId": 13,
      "quantity": 5,
      "unitPrice": 2.0
    }
  ]
}
```

**Ejemplo de Respuesta:**

```json
{
  "success": true,
  "message": "Purchase created successfully",
  "data": {
    "id": 138,
    "purchaseDate": "2025-11-20T00:00:00.000Z",
    "total": 65.0,
    "status": "Completed",
    "supplier": { "id": 9, "name": "Panadería y Postres Finos" },
    "details": [
      { "ingredientId": 1, "quantity": 10, "unitPrice": 5.5, "subtotal": 55.0 },
      { "ingredientId": 13, "quantity": 5, "unitPrice": 2.0, "subtotal": 10.0 }
    ]
  },
  "timestamp": "2025-11-19T16:10:46.820Z"
}
```

### 4. Anular Compra

Anula una compra y revierte el stock de los ingredientes.

**URL:** `/api/purchases/:id`
**Método:** `DELETE`

**Ejemplo de Respuesta:**

```json
{
  "success": true,
  "message": "Purchase cancelled successfully",
  "data": {
    "id": 137,
    "status": "Cancelled"
  },
  "timestamp": "2025-11-19T16:10:46.820Z"
}
```
