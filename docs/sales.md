# 💰 Ventas (Sales)

Gestión de ventas de platillos.

## 📋 Estructura del Objeto

| Campo      | Tipo     | Descripción                                    |
| :--------- | :------- | :--------------------------------------------- |
| `id`       | `number` | Identificador único de la venta.               |
| `saleDate` | `string` | Fecha de la venta (ISO 8601).                  |
| `total`    | `number` | Monto total de la venta.                       |
| `status`   | `string` | Estado de la venta: `Completed` o `Cancelled`. |
| `customer` | `string` | Nombre del cliente (opcional).                 |
| `notes`    | `string` | Notas adicionales sobre la venta.              |
| `details`  | `array`  | Lista de detalles de la venta (platillos).     |

### Detalle de Venta (Item en `details`)

| Campo       | Tipo     | Descripción                                       |
| :---------- | :------- | :------------------------------------------------ |
| `id`        | `number` | Identificador del detalle.                        |
| `quantity`  | `number` | Cantidad vendida.                                 |
| `unitPrice` | `number` | Precio unitario.                                  |
| `discount`  | `number` | Descuento aplicado.                               |
| `subtotal`  | `number` | Subtotal (cantidad \* precio - descuento).        |
| `dish`      | `object` | Datos del platillo (`id`, `name`, `price`, etc.). |

## 🔗 Endpoints

### 1. Listar Ventas

Obtiene una lista paginada de ventas.

**URL:** `/api/sales`
**Método:** `GET`

**Parámetros de Consulta (Query Params):**

| Parámetro   | Tipo     | Descripción                                   |
| :---------- | :------- | :-------------------------------------------- |
| `page`      | `number` | Número de página (default: 1).                |
| `pageSize`  | `number` | Cantidad por página (default: 10).            |
| `startDate` | `string` | Filtrar por fecha inicio (YYYY-MM-DD).        |
| `endDate`   | `string` | Filtrar por fecha fin (YYYY-MM-DD).           |
| `minTotal`  | `number` | Monto mínimo.                                 |
| `maxTotal`  | `number` | Monto máximo.                                 |
| `status`    | `string` | Filtrar por estado (`Completed`/`Cancelled`). |

**Ejemplo de Solicitud:**

```bash
curl -X GET "http://localhost:3000/api/sales?page=1&pageSize=10"
```

**Ejemplo de Respuesta:**

```json
{
  "success": true,
  "message": "Sales retrieved successfully",
  "data": [
    {
      "id": 1266,
      "saleDate": "2025-11-13T05:00:00.000Z",
      "total": 33.5,
      "status": "Completed",
      "customer": "Doña Rosaura",
      "notes": "Venta diaria #3",
      "details": [
        {
          "id": 4449,
          "quantity": 1,
          "unitPrice": 25.5,
          "discount": 0,
          "subtotal": 25.5,
          "dish": {
            "id": 3,
            "name": "Cuarto de Pollo a la Brasa",
            "description": "Una porción (cuarto) de Pollo a la Brasa. Incluye papas, ensalada y cremas.",
            "price": 25.5,
            "status": "Active",
            "category": {
              "id": 2,
              "name": "Pollos a la Brasa"
            }
          }
        },
        {
          "id": 4450,
          "quantity": 1,
          "unitPrice": 8,
          "discount": 0,
          "subtotal": 8,
          "dish": {
            "id": 6,
            "name": "Ensalada Clásica",
            "description": "Lechuga, tomate y cebolla con aderezo de la casa.",
            "price": 8,
            "status": "Active",
            "category": {
              "id": 3,
              "name": "Guarniciones Clásicas"
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
      "pageCount": 127,
      "total": 1266,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  },
  "timestamp": "2025-11-19T16:10:52.476Z"
}
```

### 2. Obtener Venta por ID

Obtiene los detalles de una venta específica.

**URL:** `/api/sales/:id`
**Método:** `GET`

**Ejemplo de Solicitud:**

```bash
curl -X GET "http://localhost:3000/api/sales/1266"
```

**Ejemplo de Respuesta:**

```json
{
  "success": true,
  "message": "Sale retrieved successfully",
  "data": {
    "id": 1266,
    "saleDate": "2025-11-13T05:00:00.000Z",
    "total": 33.5,
    "status": "Completed",
    "customer": "Doña Rosaura",
    "notes": "Venta diaria #3",
    "details": [
      {
        "id": 4449,
        "quantity": 1,
        "unitPrice": 25.5,
        "subtotal": 25.5,
        "dish": {
          "id": 3,
          "name": "Cuarto de Pollo a la Brasa"
        }
      }
    ]
  },
  "timestamp": "2025-11-19T16:10:52.476Z"
}
```

### 3. Registrar Venta

Registra una nueva venta y descuenta el stock de los ingredientes asociados a los platillos (si aplica).

**URL:** `/api/sales`
**Método:** `POST`
**Headers:** `Content-Type: application/json`

**Cuerpo de la Solicitud (Body):**

```json
{
  "customer": "Cliente Casual",
  "saleDate": "2025-11-20",
  "notes": "Venta rápida",
  "details": [
    {
      "dishId": 3,
      "quantity": 2,
      "unitPrice": 25.5,
      "discount": 0
    }
  ]
}
```

**Ejemplo de Respuesta:**

```json
{
  "success": true,
  "message": "Sale created successfully",
  "data": {
    "id": 1267,
    "saleDate": "2025-11-20T00:00:00.000Z",
    "total": 51.0,
    "status": "Completed",
    "customer": "Cliente Casual",
    "details": [
      { "dishId": 3, "quantity": 2, "unitPrice": 25.5, "subtotal": 51.0 }
    ]
  },
  "timestamp": "2025-11-19T16:10:52.476Z"
}
```

### 4. Anular Venta

Anula una venta y revierte el stock de los ingredientes (si aplica).

**URL:** `/api/sales/:id`
**Método:** `DELETE`

**Ejemplo de Respuesta:**

```json
{
  "success": true,
  "message": "Sale cancelled successfully",
  "data": {
    "id": 1266,
    "status": "Cancelled"
  },
  "timestamp": "2025-11-19T16:10:52.476Z"
}
```
