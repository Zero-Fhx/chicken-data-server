# 📦 Compras (Purchases)

Gestión de compras de ingredientes a proveedores.

## Descripción

Este recurso permite registrar y administrar las compras de ingredientes, actualizando automáticamente el inventario. Cada compra puede incluir múltiples ingredientes con sus respectivas cantidades y precios.

## Endpoints Disponibles

| Método   | Endpoint                     | Descripción                    |
| -------- | ---------------------------- | ------------------------------ |
| `GET`    | `/api/purchases`             | Obtener todas las compras      |
| `GET`    | `/api/purchases/:id`         | Obtener una compra por ID      |
| `GET`    | `/api/purchases/:id/details` | Obtener detalles de una compra |
| `POST`   | `/api/purchases`             | Crear una nueva compra         |
| `PATCH`  | `/api/purchases/:id`         | Actualizar una compra          |
| `DELETE` | `/api/purchases/:id`         | Eliminar una compra            |

---

## GET /api/purchases

Obtiene una lista paginada de todas las compras.

### Parámetros de Consulta

| Parámetro    | Tipo     | Obligatorio | Descripción                                    |
| ------------ | -------- | ----------- | ---------------------------------------------- |
| `page`       | `number` | No          | Número de página (por defecto: `1`)            |
| `pageSize`   | `number` | No          | Elementos por página (por defecto: `10`)       |
| `supplierId` | `number` | No          | Filtrar por ID del proveedor                   |
| `startDate`  | `string` | No          | Fecha inicial (formato: `YYYY-MM-DD`)          |
| `endDate`    | `string` | No          | Fecha final (formato: `YYYY-MM-DD`)            |
| `status`     | `string` | No          | Filtrar por estado (`Completed` o `Cancelled`) |

### Ejemplo de Solicitud

```http
GET /api/purchases?page=1&pageSize=10&status=Completed&startDate=2025-10-01&endDate=2025-10-20
```

### Ejemplo de Respuesta

```json
{
  "success": true,
  "message": "Purchases retrieved successfully",
  "data": [
    {
      "id": 1,
      "purchaseDate": "2025-10-15",
      "total": 250.0,
      "notes": "Compra semanal de pollo",
      "status": "Completed",
      "supplier": {
        "id": 1,
        "name": "Distribuidora Avícola El Pollo Feliz",
        "ruc": "20123456789",
        "phone": "+51-987654321",
        "email": "ventas@pollofeliz.com",
        "address": "Av. Industrial 123, Lima",
        "contactPerson": "Juan Pérez",
        "status": "Active"
      }
    },
    {
      "id": 2,
      "purchaseDate": "2025-10-18",
      "total": 180.5,
      "status": "Completed",
      "supplier": {
        "id": 2,
        "name": "Abarrotes Don José"
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
      "status": "Completed",
      "startDate": "2025-10-01",
      "endDate": "2025-10-20"
    }
  },
  "timestamp": "2025-10-20T19:28:47.212Z"
}
```

---

## GET /api/purchases/:id

Obtiene una compra específica por su ID.

### Parámetros de Ruta

| Parámetro | Tipo     | Obligatorio | Descripción     |
| --------- | -------- | ----------- | --------------- |
| `id`      | `number` | Sí          | ID de la compra |

### Ejemplo de Solicitud

```http
GET /api/purchases/1
```

### Ejemplo de Respuesta

```json
{
  "success": true,
  "message": "Purchase retrieved successfully",
  "data": {
    "id": 1,
    "purchaseDate": "2025-10-15",
    "total": 250.0,
    "notes": "Compra semanal de pollo",
    "status": "Completed",
    "supplier": {
      "id": 1,
      "name": "Distribuidora Avícola El Pollo Feliz",
      "ruc": "20123456789",
      "phone": "+51-987654321",
      "email": "ventas@pollofeliz.com",
      "address": "Av. Industrial 123, Lima",
      "contactPerson": "Juan Pérez",
      "status": "Active"
    }
  },
  "timestamp": "2025-10-20T19:28:47.212Z"
}
```

### Códigos de Estado

- `200` - Compra encontrada exitosamente
- `400` - ID inválido
- `404` - Compra no encontrada

---

## GET /api/purchases/:id/details

Obtiene los detalles completos de una compra, incluyendo todos los ingredientes comprados.

### Parámetros de Ruta

| Parámetro | Tipo     | Obligatorio | Descripción     |
| --------- | -------- | ----------- | --------------- |
| `id`      | `number` | Sí          | ID de la compra |

### Ejemplo de Solicitud

```http
GET /api/purchases/1/details
```

### Ejemplo de Respuesta

```json
{
  "success": true,
  "message": "Purchase details retrieved successfully",
  "data": {
    "id": 1,
    "purchaseDate": "2025-10-15",
    "total": 250.0,
    "notes": "Compra semanal de pollo",
    "status": "Completed",
    "supplier": {
      "id": 1,
      "name": "Distribuidora Avícola El Pollo Feliz"
    },
    "details": [
      {
        "id": 1,
        "purchaseId": 1,
        "quantity": 50.0,
        "unitPrice": 5.0,
        "subtotal": 250.0,
        "ingredient": {
          "id": 1,
          "name": "Pollo Entero",
          "unit": "kg"
        }
      }
    ]
  },
  "timestamp": "2025-10-20T19:28:47.212Z"
}
```

### Códigos de Estado

- `200` - Detalles de compra encontrados exitosamente
- `400` - ID inválido
- `404` - Compra no encontrada

---

## POST /api/purchases

Crea una nueva compra en el sistema y actualiza el stock de los ingredientes.

### Cuerpo de la Solicitud

| Campo          | Tipo     | Obligatorio | Descripción                                                           |
| -------------- | -------- | ----------- | --------------------------------------------------------------------- |
| `supplierId`   | `number` | No          | ID del proveedor (puede ser `null`)                                   |
| `purchaseDate` | `string` | No          | Fecha de la compra (formato: `YYYY-MM-DD`, por defecto: fecha actual) |
| `notes`        | `string` | No          | Notas o comentarios adicionales                                       |
| `status`       | `string` | No          | Estado: `Completed` o `Cancelled` (por defecto: `Completed`)          |
| `details`      | `array`  | Sí          | Array de detalles de ingredientes (mínimo 1 elemento)                 |

#### Estructura de `details`

| Campo           | Tipo     | Obligatorio | Descripción                      |
| --------------- | -------- | ----------- | -------------------------------- |
| `ingredient_id` | `number` | Sí          | ID del ingrediente comprado      |
| `quantity`      | `number` | Sí          | Cantidad comprada (debe ser > 0) |
| `unit_price`    | `number` | Sí          | Precio unitario (debe ser >= 0)  |

### Validaciones y Restricciones

| Campo                     | Validación                                                   |
| ------------------------- | ------------------------------------------------------------ |
| `supplierId`              | Opcional, debe ser un número entero positivo válido o `null` |
| `purchaseDate`            | Opcional, debe estar en formato `YYYY-MM-DD`                 |
| `notes`                   | Opcional, puede ser `null`                                   |
| `status`                  | Opcional, debe ser `Completed` o `Cancelled`                 |
| `details`                 | Requerido, debe ser un array con al menos 1 elemento         |
| `details[].ingredient_id` | Requerido, debe ser un número entero positivo válido         |
| `details[].quantity`      | Requerido, debe ser un número > 0                            |
| `details[].unit_price`    | Requerido, debe ser un número >= 0                           |

### Ejemplo de Solicitud

```http
POST /api/purchases
Content-Type: application/json

{
  "supplierId": 1,
  "purchaseDate": "2025-10-20",
  "notes": "Compra urgente de ingredientes",
  "status": "Completed",
  "details": [
    {
      "ingredient_id": 1,
      "quantity": 30.0,
      "unit_price": 5.00
    },
    {
      "ingredient_id": 2,
      "quantity": 20.0,
      "unit_price": 2.50
    }
  ]
}
```

### Ejemplo de Respuesta

```json
{
  "success": true,
  "message": "Purchase created successfully",
  "data": {
    "id": 5,
    "purchaseDate": "2025-10-20",
    "total": 200.0,
    "notes": "Compra urgente de ingredientes",
    "status": "Completed",
    "supplier": {
      "id": 1,
      "name": "Distribuidora Avícola El Pollo Feliz"
    },
    "details": [
      {
        "id": 10,
        "purchaseId": 5,
        "quantity": 30.0,
        "unitPrice": 5.0,
        "subtotal": 150.0,
        "ingredient": {
          "id": 1,
          "name": "Pollo Entero",
          "unit": "kg"
        }
      },
      {
        "id": 11,
        "purchaseId": 5,
        "quantity": 20.0,
        "unitPrice": 2.5,
        "subtotal": 50.0,
        "ingredient": {
          "id": 2,
          "name": "Arroz",
          "unit": "kg"
        }
      }
    ]
  },
  "timestamp": "2025-10-20T19:28:47.212Z"
}
```

### Códigos de Estado

- `201` - Compra creada exitosamente
- `400` - Datos de entrada inválidos
- `404` - Proveedor o ingrediente no encontrado

---

## PATCH /api/purchases/:id

Actualiza una compra existente. Solo se actualizan los campos proporcionados.

### Parámetros de Ruta

| Parámetro | Tipo     | Obligatorio | Descripción                  |
| --------- | -------- | ----------- | ---------------------------- |
| `id`      | `number` | Sí          | ID de la compra a actualizar |

### Cuerpo de la Solicitud

| Campo          | Tipo     | Obligatorio | Descripción                             |
| -------------- | -------- | ----------- | --------------------------------------- |
| `supplierId`   | `number` | No          | Nuevo ID del proveedor                  |
| `purchaseDate` | `string` | No          | Nueva fecha de compra                   |
| `notes`        | `string` | No          | Nuevas notas                            |
| `status`       | `string` | No          | Nuevo estado: `Completed` o `Cancelled` |

**Nota:** Los detalles de la compra no pueden actualizarse mediante PATCH. Para modificar ingredientes, elimine y cree una nueva compra.

### Ejemplo de Solicitud

```http
PATCH /api/purchases/5
Content-Type: application/json

{
  "notes": "Compra modificada - prioridad alta",
  "status": "Completed"
}
```

### Ejemplo de Respuesta

```json
{
  "success": true,
  "message": "Purchase updated successfully",
  "data": {
    "id": 5,
    "purchaseDate": "2025-10-20",
    "total": 200.0,
    "notes": "Compra modificada - prioridad alta",
    "status": "Completed",
    "supplier": {
      "id": 1,
      "name": "Distribuidora Avícola El Pollo Feliz"
    }
  },
  "timestamp": "2025-10-20T19:28:47.212Z"
}
```

### Códigos de Estado

- `200` - Compra actualizada exitosamente
- `400` - Datos de entrada inválidos o ID inválido
- `404` - Compra o proveedor no encontrado

---

## DELETE /api/purchases/:id

Elimina una compra del sistema y revierte el stock de los ingredientes.

### Parámetros de Ruta

| Parámetro | Tipo     | Obligatorio | Descripción                |
| --------- | -------- | ----------- | -------------------------- |
| `id`      | `number` | Sí          | ID de la compra a eliminar |

### Ejemplo de Solicitud

```http
DELETE /api/purchases/5
```

### Ejemplo de Respuesta

```json
{
  "success": true,
  "message": "Purchase deleted successfully",
  "data": {
    "id": 5,
    "purchaseDate": "2025-10-20",
    "total": 200.0,
    "notes": "Compra modificada - prioridad alta",
    "status": "Completed",
    "supplier": {
      "id": 1,
      "name": "Distribuidora Avícola El Pollo Feliz"
    }
  },
  "timestamp": "2025-10-20T19:28:47.212Z"
}
```

### Códigos de Estado

- `200` - Compra eliminada exitosamente
- `400` - ID inválido
- `404` - Compra no encontrada

---

## Estructura de Datos

### Objeto Purchase

```typescript
{
  id: number                 // ID único de la compra
  purchaseDate: string       // Fecha de la compra (YYYY-MM-DD)
  total: number              // Monto total de la compra (calculado)
  notes?: string             // Notas o comentarios
  status: "Completed" | "Cancelled" // Estado de la compra
  supplier?: {               // Información del proveedor (opcional)
    id: number               // ID del proveedor
    name: string             // Nombre del proveedor
    ruc?: string             // RUC del proveedor
    phone?: string           // Teléfono del proveedor
    email?: string           // Email del proveedor
    address?: string         // Dirección del proveedor
    contactPerson?: string   // Persona de contacto
    status?: string          // Estado del proveedor
  }
  details?: PurchaseDetail[] // Detalles de la compra (solo en GET /details y POST)
}
```

### Objeto Purchase Detail

```typescript
{
  id: number                 // ID único del detalle
  quantity: number           // Cantidad comprada
  unitPrice: number          // Precio unitario
  subtotal: number           // Subtotal (quantity * unitPrice)
  ingredient: {              // Información del ingrediente
    id: number               // ID del ingrediente
    name: string             // Nombre del ingrediente
    unit: string             // Unidad de medida
    status?: string          // Estado del ingrediente
    stock?: number           // Stock actual
    minimumStock?: number    // Stock mínimo
    category?: {             // Categoría del ingrediente
      id: number             // ID de la categoría
      name: string           // Nombre de la categoría
    }
  }
}
```

---

## Relaciones con Otros Recursos

- **Proveedores**: Cada compra puede estar asociada a un proveedor → [Ver documentación](./suppliers.md)
- **Ingredientes**: Los detalles de compra incluyen ingredientes que se agregan al inventario → [Ver documentación](./ingredients.md)

---

## Notas Adicionales

- El campo `total` se calcula automáticamente sumando todos los subtotales de los detalles.
- Al crear una compra con estado `Completed`, el stock de los ingredientes se actualiza automáticamente.
- Si una compra se crea con estado `Cancelled`, no se actualiza el stock.
- La información del proveedor se incluye como un objeto anidado `supplier` con todos sus datos.
- Los detalles incluyen objetos completos de ingredientes con su información anidada.
- Al eliminar una compra, el stock de los ingredientes se revierte restando las cantidades.
- La fecha de compra por defecto es la fecha actual del sistema.
- Se requiere al menos un ingrediente en los detalles para crear una compra.
- **Los datos no se eliminan físicamente**: Al eliminar una compra, se marca con `deleted_at` (soft delete) pero permanece en la base de datos para mantener el historial.
- Los campos `createdAt`, `updatedAt` y `deleted_at` no se incluyen en las respuestas de la API.

---

[← Volver al índice](../README.md)
