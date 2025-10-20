# 💰 Ventas (Sales)

Gestión de ventas de platillos a clientes.

## Descripción

Este recurso permite registrar y administrar las ventas de platillos del restaurante. Cada venta puede incluir múltiples platillos con sus respectivas cantidades, precios y descuentos.

## Endpoints Disponibles

| Método   | Endpoint                 | Descripción                   |
| -------- | ------------------------ | ----------------------------- |
| `GET`    | `/api/sales`             | Obtener todas las ventas      |
| `GET`    | `/api/sales/:id`         | Obtener una venta por ID      |
| `GET`    | `/api/sales/:id/details` | Obtener detalles de una venta |
| `POST`   | `/api/sales`             | Crear una nueva venta         |
| `PATCH`  | `/api/sales/:id`         | Actualizar una venta          |
| `DELETE` | `/api/sales/:id`         | Eliminar una venta            |

---

## GET /api/sales

Obtiene una lista paginada de todas las ventas.

### Parámetros de Consulta

| Parámetro   | Tipo     | Obligatorio | Descripción                                    |
| ----------- | -------- | ----------- | ---------------------------------------------- |
| `page`      | `number` | No          | Número de página (por defecto: `1`)            |
| `pageSize`  | `number` | No          | Elementos por página (por defecto: `10`)       |
| `customer`  | `string` | No          | Filtrar por nombre del cliente                 |
| `startDate` | `string` | No          | Fecha inicial (formato: `YYYY-MM-DD`)          |
| `endDate`   | `string` | No          | Fecha final (formato: `YYYY-MM-DD`)            |
| `status`    | `string` | No          | Filtrar por estado (`Completed` o `Cancelled`) |

### Ejemplo de Solicitud

```http
GET /api/sales?page=1&pageSize=10&status=Completed&startDate=2025-10-01&endDate=2025-10-20
```

### Ejemplo de Respuesta

```json
{
  "success": true,
  "message": "Sales retrieved successfully",
  "data": [
    {
      "id": 1,
      "saleDate": "2025-10-15",
      "customer": "Juan Pérez",
      "total": 75.5,
      "notes": "Mesa 5",
      "status": "Completed"
    },
    {
      "id": 2,
      "saleDate": "2025-10-15",
      "customer": "María García",
      "total": 50.0,
      "notes": "Para llevar",
      "status": "Completed"
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
      "status": "Completed",
      "startDate": "2025-10-01",
      "endDate": "2025-10-20"
    }
  },
  "timestamp": "2025-10-20T19:28:47.212Z"
}
```

---

## GET /api/sales/:id

Obtiene una venta específica por su ID.

### Parámetros de Ruta

| Parámetro | Tipo     | Obligatorio | Descripción    |
| --------- | -------- | ----------- | -------------- |
| `id`      | `number` | Sí          | ID de la venta |

### Ejemplo de Solicitud

```http
GET /api/sales/1
```

### Ejemplo de Respuesta

```json
{
  "success": true,
  "message": "Sale retrieved successfully",
  "data": {
    "id": 1,
    "saleDate": "2025-10-15",
    "customer": "Juan Pérez",
    "total": 75.5,
    "notes": "Mesa 5",
    "status": "Completed"
  },
  "timestamp": "2025-10-20T19:28:47.212Z"
}
```

### Códigos de Estado

- `200` - Venta encontrada exitosamente
- `400` - ID inválido
- `404` - Venta no encontrada

---

## GET /api/sales/:id/details

Obtiene los detalles completos de una venta, incluyendo todos los platillos vendidos.

### Parámetros de Ruta

| Parámetro | Tipo     | Obligatorio | Descripción    |
| --------- | -------- | ----------- | -------------- |
| `id`      | `number` | Sí          | ID de la venta |

### Ejemplo de Solicitud

```http
GET /api/sales/1/details
```

### Ejemplo de Respuesta

```json
{
  "success": true,
  "message": "Sale details retrieved successfully",
  "data": {
    "id": 1,
    "saleDate": "2025-10-15",
    "customer": "Juan Pérez",
    "total": 75.5,
    "notes": "Mesa 5",
    "status": "Completed",
    "details": [
      {
        "id": 1,
        "saleId": 1,
        "quantity": 2,
        "unitPrice": 25.5,
        "discount": 0.0,
        "subtotal": 51.0,
        "dish": {
          "id": 1,
          "name": "Pollo a la Brasa"
        }
      },
      {
        "id": 2,
        "saleId": 1,
        "quantity": 1,
        "unitPrice": 15.0,
        "discount": 0.0,
        "subtotal": 15.0,
        "dish": {
          "id": 3,
          "name": "Alitas Picantes"
        }
      },
      {
        "id": 3,
        "saleId": 1,
        "quantity": 3,
        "unitPrice": 3.5,
        "discount": 0.5,
        "subtotal": 9.5,
        "dish": {
          "id": 5,
          "name": "Gaseosa"
        }
      }
    ]
  },
  "timestamp": "2025-10-20T19:28:47.212Z"
}
```

### Códigos de Estado

- `200` - Detalles de venta encontrados exitosamente
- `400` - ID inválido
- `404` - Venta no encontrada

---

## POST /api/sales

Crea una nueva venta en el sistema.

### Cuerpo de la Solicitud

| Campo      | Tipo     | Obligatorio | Descripción                                                          |
| ---------- | -------- | ----------- | -------------------------------------------------------------------- |
| `saleDate` | `string` | No          | Fecha de la venta (formato: `YYYY-MM-DD`, por defecto: fecha actual) |
| `customer` | `string` | No          | Nombre del cliente                                                   |
| `notes`    | `string` | No          | Notas o comentarios adicionales                                      |
| `status`   | `string` | No          | Estado: `Completed` o `Cancelled` (por defecto: `Completed`)         |
| `details`  | `array`  | Sí          | Array de detalles de platillos (mínimo 1 elemento)                   |

#### Estructura de `details`

| Campo        | Tipo     | Obligatorio | Descripción                           |
| ------------ | -------- | ----------- | ------------------------------------- |
| `dish_id`    | `number` | Sí          | ID del platillo vendido               |
| `quantity`   | `number` | Sí          | Cantidad vendida (debe ser >= 1)      |
| `unit_price` | `number` | Sí          | Precio unitario (debe ser >= 0)       |
| `discount`   | `number` | No          | Descuento aplicado (por defecto: `0`) |

### Validaciones y Restricciones

| Campo                  | Validación                                           |
| ---------------------- | ---------------------------------------------------- |
| `saleDate`             | Opcional, debe estar en formato `YYYY-MM-DD`         |
| `customer`             | Opcional, puede ser `null`                           |
| `notes`                | Opcional, puede ser `null`                           |
| `status`               | Opcional, debe ser `Completed` o `Cancelled`         |
| `details`              | Requerido, debe ser un array con al menos 1 elemento |
| `details[].dish_id`    | Requerido, debe ser un número entero positivo válido |
| `details[].quantity`   | Requerido, debe ser un número entero >= 1            |
| `details[].unit_price` | Requerido, debe ser un número >= 0                   |
| `details[].discount`   | Opcional, debe ser un número >= 0                    |

### Ejemplo de Solicitud

```http
POST /api/sales
Content-Type: application/json

{
  "saleDate": "2025-10-20",
  "customer": "Carlos Ruiz",
  "notes": "Mesa 10 - Aniversario",
  "status": "Completed",
  "details": [
    {
      "dish_id": 1,
      "quantity": 2,
      "unit_price": 25.50,
      "discount": 0.00
    },
    {
      "dish_id": 3,
      "quantity": 1,
      "unit_price": 15.00,
      "discount": 1.00
    }
  ]
}
```

### Ejemplo de Respuesta

```json
{
  "success": true,
  "message": "Sale created successfully",
  "data": {
    "id": 10,
    "saleDate": "2025-10-20",
    "customer": "Carlos Ruiz",
    "total": 65.0,
    "notes": "Mesa 10 - Aniversario",
    "status": "Completed",
    "details": [
      {
        "id": 20,
        "saleId": 10,
        "quantity": 2,
        "unitPrice": 25.5,
        "discount": 0.0,
        "subtotal": 51.0,
        "dish": {
          "id": 1,
          "name": "Pollo a la Brasa"
        }
      },
      {
        "id": 21,
        "saleId": 10,
        "quantity": 1,
        "unitPrice": 15.0,
        "discount": 1.0,
        "subtotal": 14.0,
        "dish": {
          "id": 3,
          "name": "Alitas Picantes"
        }
      }
    ]
  },
  "timestamp": "2025-10-20T19:28:47.212Z"
}
```

### Códigos de Estado

- `201` - Venta creada exitosamente
- `400` - Datos de entrada inválidos
- `404` - Platillo no encontrado

---

## PATCH /api/sales/:id

Actualiza una venta existente. Solo se actualizan los campos proporcionados.

### Parámetros de Ruta

| Parámetro | Tipo     | Obligatorio | Descripción                 |
| --------- | -------- | ----------- | --------------------------- |
| `id`      | `number` | Sí          | ID de la venta a actualizar |

### Cuerpo de la Solicitud

| Campo      | Tipo     | Obligatorio | Descripción                             |
| ---------- | -------- | ----------- | --------------------------------------- |
| `saleDate` | `string` | No          | Nueva fecha de venta                    |
| `customer` | `string` | No          | Nuevo nombre del cliente                |
| `notes`    | `string` | No          | Nuevas notas                            |
| `status`   | `string` | No          | Nuevo estado: `Completed` o `Cancelled` |

**Nota:** Los detalles de la venta no pueden actualizarse mediante PATCH. Para modificar platillos, elimine y cree una nueva venta.

### Ejemplo de Solicitud

```http
PATCH /api/sales/10
Content-Type: application/json

{
  "customer": "Carlos Ruiz Gómez",
  "notes": "Mesa 10 - Aniversario - Cliente frecuente"
}
```

### Ejemplo de Respuesta

```json
{
  "success": true,
  "message": "Sale updated successfully",
  "data": {
    "id": 10,
    "saleDate": "2025-10-20",
    "customer": "Carlos Ruiz Gómez",
    "total": 65.0,
    "notes": "Mesa 10 - Aniversario - Cliente frecuente",
    "status": "Completed"
  },
  "timestamp": "2025-10-20T19:28:47.212Z"
}
```

### Códigos de Estado

- `200` - Venta actualizada exitosamente
- `400` - Datos de entrada inválidos o ID inválido
- `404` - Venta no encontrada

---

## DELETE /api/sales/:id

Elimina una venta del sistema.

### Parámetros de Ruta

| Parámetro | Tipo     | Obligatorio | Descripción               |
| --------- | -------- | ----------- | ------------------------- |
| `id`      | `number` | Sí          | ID de la venta a eliminar |

### Ejemplo de Solicitud

```http
DELETE /api/sales/10
```

### Ejemplo de Respuesta

```json
{
  "success": true,
  "message": "Sale deleted successfully",
  "data": {
    "id": 10,
    "saleDate": "2025-10-20",
    "customer": "Carlos Ruiz Gómez",
    "total": 65.0,
    "notes": "Mesa 10 - Aniversario - Cliente frecuente",
    "status": "Completed"
  },
  "timestamp": "2025-10-20T19:28:47.212Z"
}
```

### Códigos de Estado

- `200` - Venta eliminada exitosamente
- `400` - ID inválido
- `404` - Venta no encontrada

---

## Estructura de Datos

### Objeto Sale

```typescript
{
  id: number                 // ID único de la venta
  saleDate: string           // Fecha de la venta (YYYY-MM-DD)
  customer?: string          // Nombre del cliente
  total: number              // Monto total de la venta (calculado)
  notes?: string             // Notas o comentarios
  status: "Completed" | "Cancelled" // Estado de la venta
  details?: SaleDetail[]     // Detalles de la venta (solo en GET /details y POST)
}
```

### Objeto Sale Detail

```typescript
{
  id: number                 // ID único del detalle
  quantity: number           // Cantidad vendida
  unitPrice: number          // Precio unitario
  discount: number           // Descuento aplicado
  subtotal: number           // Subtotal ((unitPrice * quantity) - discount)
  dish: {                    // Información del platillo
    id: number               // ID del platillo
    name: string             // Nombre del platillo
    description?: string     // Descripción del platillo
    price?: number           // Precio del platillo
    status?: string          // Estado del platillo
    category?: {             // Categoría del platillo
      id: number             // ID de la categoría
      name: string           // Nombre de la categoría
    }
  }
}
```

---

## Relaciones con Otros Recursos

- **Platillos**: Los detalles de venta incluyen platillos del menú → [Ver documentación](./dishes.md)

---

## Notas Adicionales

- El campo `total` se calcula automáticamente sumando todos los subtotales de los detalles.
- El subtotal de cada detalle se calcula como: `(unitPrice * quantity) - discount`.
- El campo `customer` es opcional y puede usarse para identificar al cliente o la mesa. Si no se proporciona, se asigna "Público general".
- La fecha de venta por defecto es la fecha actual del sistema.
- Se requiere al menos un platillo en los detalles para crear una venta.
- Los descuentos se aplican por cada línea de detalle, no sobre el total.
- El campo `discount` representa un monto fijo, no un porcentaje.
- **Los datos no se eliminan físicamente**: Al eliminar una venta, se marca con `deleted_at` (soft delete) pero permanece en la base de datos para mantener el historial.
- Las ventas canceladas (`Cancelled`) se mantienen para fines de auditoría.
- Los detalles de venta incluyen objetos completos de platillos con su información anidada.
- Los campos `createdAt`, `updatedAt` y `deleted_at` no se incluyen en las respuestas de la API.

---

[← Volver al índice](../README.md)

```

```
