# 💰 Ventas (Sales)

Gestión de ventas de platillos a clientes.

## Descripción

Este recurso permite registrar y administrar las ventas de platillos del restaurante. Cada venta puede incluir múltiples platillos con sus respectivas cantidades, precios y descuentos.

## Endpoints Disponibles

| Método   | Endpoint         | Descripción                           |
| -------- | ---------------- | ------------------------------------- |
| `GET`    | `/api/sales`     | Obtener todas las ventas con detalles |
| `GET`    | `/api/sales/:id` | Obtener una venta por ID con detalles |
| `POST`   | `/api/sales`     | Crear una nueva venta                 |
| `PATCH`  | `/api/sales/:id` | Actualizar metadatos de una venta     |
| `DELETE` | `/api/sales/:id` | Eliminar una venta                    |

---

## GET /api/sales

Obtiene una lista paginada de todas las ventas con sus detalles completos (platillos incluidos).

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
GET /api/sales?page=1&pageSize=10&status=Completed
```

### Ejemplo de Respuesta

```json
{
  "success": true,
  "message": "Sales retrieved successfully",
  "data": [
    {
      "id": 1,
      "saleDate": "2025-10-15T05:00:00.000Z",
      "customer": "Juan Pérez",
      "total": 75.5,
      "notes": "Mesa 5",
      "status": "Completed",
      "details": [
        {
          "id": 1,
          "quantity": 2,
          "unitPrice": 25.5,
          "discount": 0,
          "subtotal": 51,
          "dish": {
            "id": 1,
            "name": "Pollo a la Brasa",
            "description": "Pollo marinado con especias especiales",
            "price": 25.5,
            "status": "Active",
            "category": {
              "id": 1,
              "name": "Platos Principales"
            }
          }
        },
        {
          "id": 2,
          "quantity": 1,
          "unitPrice": 18,
          "discount": 0,
          "subtotal": 18,
          "dish": {
            "id": 2,
            "name": "Arroz con Pollo",
            "description": "Arroz con pollo y vegetales",
            "price": 18,
            "status": "Active",
            "category": {
              "id": 1,
              "name": "Platos Principales"
            }
          }
        }
      ]
    },
    {
      "id": 2,
      "saleDate": "2025-10-15T05:00:00.000Z",
      "customer": "María García",
      "total": 50,
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
    }
  },
  "timestamp": "2025-10-20T19:28:47.212Z"
}
```

---

## GET /api/sales/:id

Obtiene una venta específica por su ID con todos sus detalles (platillos incluidos).

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
    "saleDate": "2025-10-15T05:00:00.000Z",
    "customer": "Juan Pérez",
    "total": 75.5,
    "notes": "Mesa 5",
    "status": "Completed",
    "details": [
      {
        "id": 1,
        "quantity": 2,
        "unitPrice": 25.5,
        "discount": 0,
        "subtotal": 51,
        "dish": {
          "id": 1,
          "name": "Pollo a la Brasa",
          "description": "Pollo marinado con especias especiales",
          "price": 25.5,
          "status": "Active",
          "category": {
            "id": 1,
            "name": "Platos Principales"
          }
        }
      },
      {
        "id": 2,
        "quantity": 1,
        "unitPrice": 24.5,
        "discount": 0,
        "subtotal": 24.5,
        "dish": {
          "id": 3,
          "name": "Ensalada César",
          "description": "Lechuga romana con aderezo césar",
          "price": 12,
          "status": "Active",
          "category": {
            "id": 2,
            "name": "Ensaladas"
          }
        }
      }
    ]
  },
  "timestamp": "2025-10-20T19:28:47.212Z"
}
```

### Códigos de Estado

- `200` - Venta encontrada exitosamente
- `400` - ID inválido
- `404` - Venta no encontrada

---

## POST /api/sales

Crea una nueva venta en el sistema.

### Cuerpo de la Solicitud

| Campo       | Tipo      | Obligatorio | Descripción                                                           |
| ----------- | --------- | ----------- | --------------------------------------------------------------------- |
| `saleDate`  | `string`  | No          | Fecha de la venta (formato: `YYYY-MM-DD`, por defecto: fecha actual)  |
| `customer`  | `string`  | No          | Nombre del cliente                                                    |
| `notes`     | `string`  | No          | Notas o comentarios adicionales                                       |
| `status`    | `string`  | No          | Estado: `Completed` o `Cancelled` (por defecto: `Completed`)          |
| `forceSale` | `boolean` | No          | Forzar venta sin validar stock de ingredientes (por defecto: `false`) |
| `details`   | `array`   | Sí          | Array de detalles de platillos (mínimo 1 elemento)                    |

#### Estructura de `details`

| Campo       | Tipo     | Obligatorio | Descripción                           |
| ----------- | -------- | ----------- | ------------------------------------- |
| `dishId`    | `number` | Sí          | ID del platillo vendido               |
| `quantity`  | `number` | Sí          | Cantidad vendida (debe ser >= 1)      |
| `unitPrice` | `number` | Sí          | Precio unitario (debe ser >= 0)       |
| `discount`  | `number` | No          | Descuento aplicado (por defecto: `0`) |

### Validaciones y Restricciones

| Campo                 | Validación                                           |
| --------------------- | ---------------------------------------------------- |
| `saleDate`            | Opcional, debe estar en formato `YYYY-MM-DD`         |
| `customer`            | Opcional, puede ser `null`                           |
| `notes`               | Opcional, puede ser `null`                           |
| `status`              | Opcional, debe ser `Completed` o `Cancelled`         |
| `forceSale`           | Opcional, debe ser un booleano                       |
| `details`             | Requerido, debe ser un array con al menos 1 elemento |
| `details[].dishId`    | Requerido, debe ser un número entero positivo válido |
| `details[].quantity`  | Requerido, debe ser un número entero >= 1            |
| `details[].unitPrice` | Requerido, debe ser un número >= 0                   |
| `details[].discount`  | Opcional, debe ser un número >= 0                    |

**Nota sobre `forceSale`**:

- Si `forceSale = false` (por defecto): Se valida que haya stock suficiente de todos los ingredientes antes de procesar la venta
- Si `forceSale = true`: Se omite la validación de stock y se procesa la venta de todas formas. Los ingredientes se descontarán normalmente, y si alguno queda con stock negativo, se establecerá en 0

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
      "dishId": 1,
      "quantity": 2,
      "unitPrice": 25.50,
      "discount": 0.00
    },
    {
      "dishId": 3,
      "quantity": 1,
      "unitPrice": 15.00,
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

### Ejemplo de Solicitud con `forceSale`

```http
POST /api/sales
Content-Type: application/json

{
  "saleDate": "2025-10-20",
  "customer": "María López",
  "forceSale": true,
  "details": [
    {
      "dish_id": 2,
      "quantity": 5,
      "unit_price": 18.00,
      "discount": 0.00
    }
  ]
}
```

### Ejemplo de Error: Stock Insuficiente

Cuando `forceSale = false` y no hay stock suficiente de ingredientes:

```json
{
  "success": false,
  "message": "Insufficient ingredients stock for sale",
  "data": [
    {
      "dishId": 2,
      "dishName": "Arroz con Pollo",
      "quantity": 5,
      "insufficientIngredients": [
        {
          "ingredientId": 5,
          "name": "Arroz",
          "required": 2.5,
          "available": 1.0,
          "shortfall": 1.5,
          "unit": "kg"
        },
        {
          "ingredientId": 3,
          "name": "Pollo",
          "required": 5.0,
          "available": 2.0,
          "shortfall": 3.0,
          "unit": "kg"
        }
      ]
    }
  ],
  "timestamp": "2025-10-20T19:28:47.212Z"
}
```

### Códigos de Estado

- `201` - Venta creada exitosamente
- `400` - Datos de entrada inválidos o stock insuficiente
- `404` - Platillo no encontrado

---

## PATCH /api/sales/:id

Actualiza los metadatos de una venta existente. **No se pueden modificar los detalles (platillos) de la venta.**

### Parámetros de Ruta

| Parámetro | Tipo     | Obligatorio | Descripción                 |
| --------- | -------- | ----------- | --------------------------- |
| `id`      | `number` | Sí          | ID de la venta a actualizar |

### Cuerpo de la Solicitud

| Campo      | Tipo     | Obligatorio | Descripción                             |
| ---------- | -------- | ----------- | --------------------------------------- |
| `saleDate` | `string` | No          | Nueva fecha de venta (`YYYY-MM-DD`)     |
| `customer` | `string` | No          | Nuevo nombre del cliente                |
| `notes`    | `string` | No          | Nuevas notas                            |
| `status`   | `string` | No          | Nuevo estado: `Completed` o `Cancelled` |

**Nota:** Los detalles de la venta (platillos, cantidades, precios, descuentos) **NO pueden modificarse** después de crear la venta. Para cambiar platillos, debe eliminar y crear una nueva venta.

### Ejemplo de Solicitud

```http
PATCH /api/sales/10
Content-Type: application/json

{
  "customer": "Carlos Ruiz Gómez",
  "notes": "Mesa 10 - Aniversario - Cliente frecuente",
  "saleDate": "2025-10-21"
}
```

### Ejemplo de Respuesta

```json
{
  "success": true,
  "message": "Sale updated successfully",
  "data": {
    "id": 10,
    "saleDate": "2025-10-21T05:00:00.000Z",
    "customer": "Carlos Ruiz Gómez",
    "total": 65,
    "notes": "Mesa 10 - Aniversario - Cliente frecuente",
    "status": "Completed",
    "details": [
      {
        "id": 20,
        "quantity": 2,
        "unitPrice": 25.5,
        "discount": 0,
        "subtotal": 51,
        "dish": {
          "id": 1,
          "name": "Pollo a la Brasa",
          "description": "Pollo marinado con especias especiales",
          "price": 25.5,
          "status": "Active",
          "category": {
            "id": 1,
            "name": "Platos Principales"
          }
        }
      }
    ]
  },
  "timestamp": "2025-11-04T22:40:00.000Z"
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

### Sistema de Validación de Stock

- **Validación automática**: Por defecto, al crear una venta se valida que haya stock suficiente de todos los ingredientes necesarios para los platillos solicitados.
- **Platos sin ingredientes**: Los platos que no tienen ingredientes configurados en el sistema pueden venderse sin restricciones de stock.
- **Descuento automático de stock**: Cuando se crea una venta, los triggers de la base de datos descuentan automáticamente el stock de los ingredientes utilizados.
- **Parámetro `forceSale`**:
  - `false` (por defecto): Valida stock antes de procesar la venta. Si no hay suficientes ingredientes, retorna error 400 con detalles de qué falta.
  - `true`: Omite la validación y procesa la venta de todas formas. Los ingredientes se descontarán normalmente, y si alguno queda con stock negativo, se corregirá automáticamente a 0.
- **Casos de uso de `forceSale`**: Útil cuando se necesita procesar una venta urgente y se sabe que habrá reabastecimiento pronto, o cuando se usa un método de preparación alternativo.

### Otros

- **Los datos no se eliminan físicamente**: Al eliminar una venta, se marca con `deleted_at` (soft delete) pero permanece en la base de datos para mantener el historial.
- Las ventas canceladas (`Cancelled`) se mantienen para fines de auditoría.
- Los detalles de venta incluyen objetos completos de platillos con su información anidada.
- Los campos `createdAt`, `updatedAt` y `deleted_at` no se incluyen en las respuestas de la API.

---

[← Volver al índice](../README.md)

```

```
