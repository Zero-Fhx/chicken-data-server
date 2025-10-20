# 🏪 Proveedores (Suppliers)

Gestión de proveedores de ingredientes.

## Descripción

Este recurso permite administrar la información de los proveedores que abastecen ingredientes al restaurante, incluyendo datos de contacto y estado.

## Endpoints Disponibles

| Método   | Endpoint             | Descripción                   |
| -------- | -------------------- | ----------------------------- |
| `GET`    | `/api/suppliers`     | Obtener todos los proveedores |
| `GET`    | `/api/suppliers/:id` | Obtener un proveedor por ID   |
| `POST`   | `/api/suppliers`     | Crear un nuevo proveedor      |
| `PATCH`  | `/api/suppliers/:id` | Actualizar un proveedor       |
| `DELETE` | `/api/suppliers/:id` | Eliminar un proveedor         |

---

## GET /api/suppliers

Obtiene una lista paginada de todos los proveedores.

### Parámetros de Consulta

| Parámetro  | Tipo     | Obligatorio | Descripción                                  |
| ---------- | -------- | ----------- | -------------------------------------------- |
| `page`     | `number` | No          | Número de página (por defecto: `1`)          |
| `pageSize` | `number` | No          | Elementos por página (por defecto: `10`)     |
| `search`   | `string` | No          | Buscar por nombre, RUC o persona de contacto |
| `status`   | `string` | No          | Filtrar por estado (`Active` o `Inactive`)   |

### Ejemplo de Solicitud

```http
GET /api/suppliers?page=1&pageSize=10&status=Active
```

### Ejemplo de Respuesta

```json
{
  "success": true,
  "message": "Suppliers retrieved successfully",
  "data": [
    {
      "id": 1,
      "name": "Distribuidora Avícola El Pollo Feliz",
      "ruc": "20123456789",
      "phone": "+51-987654321",
      "email": "ventas@pollofeliz.com",
      "address": "Av. Industrial 123, Lima",
      "contactPerson": "Juan Pérez",
      "status": "Active"
    },
    {
      "id": 2,
      "name": "Abarrotes Don José",
      "ruc": "20987654321",
      "phone": "+51-912345678",
      "email": "contacto@donjose.com",
      "address": "Jr. Comercio 456, Lima",
      "contactPerson": "María García",
      "status": "Active"
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
      "status": "Active"
    }
  },
  "timestamp": "2025-10-20T19:28:47.212Z"
}
```

---

## GET /api/suppliers/:id

Obtiene un proveedor específico por su ID.

### Parámetros de Ruta

| Parámetro | Tipo     | Obligatorio | Descripción      |
| --------- | -------- | ----------- | ---------------- |
| `id`      | `number` | Sí          | ID del proveedor |

### Ejemplo de Solicitud

```http
GET /api/suppliers/1
```

### Ejemplo de Respuesta

```json
{
  "success": true,
  "message": "Supplier retrieved successfully",
  "data": {
    "id": 1,
    "name": "Distribuidora Avícola El Pollo Feliz",
    "ruc": "20123456789",
    "phone": "+51-987654321",
    "email": "ventas@pollofeliz.com",
    "address": "Av. Industrial 123, Lima",
    "contactPerson": "Juan Pérez",
    "status": "Active"
  },
  "timestamp": "2025-10-20T19:28:47.212Z"
}
```

### Códigos de Estado

- `200` - Proveedor encontrado exitosamente
- `400` - ID inválido
- `404` - Proveedor no encontrado

---

## POST /api/suppliers

Crea un nuevo proveedor en el sistema.

### Cuerpo de la Solicitud

| Campo           | Tipo     | Obligatorio | Descripción                                            |
| --------------- | -------- | ----------- | ------------------------------------------------------ |
| `name`          | `string` | Sí          | Nombre del proveedor                                   |
| `ruc`           | `string` | No          | RUC o identificación fiscal (máx. 20 caracteres)       |
| `phone`         | `string` | No          | Número de teléfono (máx. 20 caracteres)                |
| `email`         | `string` | No          | Correo electrónico (debe ser formato válido)           |
| `address`       | `string` | No          | Dirección física (máx. 150 caracteres)                 |
| `contactPerson` | `string` | No          | Nombre de la persona de contacto (máx. 100 caracteres) |
| `status`        | `string` | No          | Estado: `Active` o `Inactive` (por defecto: `Active`)  |

### Validaciones y Restricciones

| Campo           | Validación                                                   |
| --------------- | ------------------------------------------------------------ |
| `name`          | Requerido, debe ser un string no vacío                       |
| `ruc`           | Opcional, máximo 20 caracteres, puede ser `null`             |
| `phone`         | Opcional, máximo 20 caracteres, puede ser `null`             |
| `email`         | Opcional, debe ser formato de email válido, puede ser `null` |
| `address`       | Opcional, máximo 150 caracteres, puede ser `null`            |
| `contactPerson` | Opcional, máximo 100 caracteres, puede ser `null`            |
| `status`        | Opcional, debe ser `Active` o `Inactive`                     |

### Ejemplo de Solicitud

```http
POST /api/suppliers
Content-Type: application/json

{
  "name": "Verduras Frescas SAC",
  "ruc": "20111222333",
  "phone": "+51-998877665",
  "email": "ventas@verdurasfrescas.com",
  "address": "Av. Agrícola 789, Lima",
  "contactPerson": "Carlos Mendoza",
  "status": "Active"
}
```

### Ejemplo de Respuesta

```json
{
  "success": true,
  "message": "Supplier created successfully",
  "data": {
    "id": 3,
    "name": "Verduras Frescas SAC",
    "ruc": "20111222333",
    "phone": "+51-998877665",
    "email": "ventas@verdurasfrescas.com",
    "address": "Av. Agrícola 789, Lima",
    "contactPerson": "Carlos Mendoza",
    "status": "Active"
  },
  "timestamp": "2025-10-20T19:28:47.212Z"
}
```

### Códigos de Estado

- `201` - Proveedor creado exitosamente
- `400` - Datos de entrada inválidos

---

## PATCH /api/suppliers/:id

Actualiza un proveedor existente. Solo se actualizan los campos proporcionados.

### Parámetros de Ruta

| Parámetro | Tipo     | Obligatorio | Descripción                   |
| --------- | -------- | ----------- | ----------------------------- |
| `id`      | `number` | Sí          | ID del proveedor a actualizar |

### Cuerpo de la Solicitud

| Campo           | Tipo     | Obligatorio | Descripción                         |
| --------------- | -------- | ----------- | ----------------------------------- |
| `name`          | `string` | No          | Nuevo nombre del proveedor          |
| `ruc`           | `string` | No          | Nuevo RUC                           |
| `phone`         | `string` | No          | Nuevo teléfono                      |
| `email`         | `string` | No          | Nuevo email                         |
| `address`       | `string` | No          | Nueva dirección                     |
| `contactPerson` | `string` | No          | Nueva persona de contacto           |
| `status`        | `string` | No          | Nuevo estado: `Active` o `Inactive` |

### Validaciones y Restricciones

| Campo           | Validación                                                            |
| --------------- | --------------------------------------------------------------------- |
| `name`          | Si se proporciona, debe ser un string no vacío                        |
| `ruc`           | Si se proporciona, máximo 20 caracteres, puede ser `null`             |
| `phone`         | Si se proporciona, máximo 20 caracteres, puede ser `null`             |
| `email`         | Si se proporciona, debe ser formato de email válido, puede ser `null` |
| `address`       | Si se proporciona, máximo 150 caracteres, puede ser `null`            |
| `contactPerson` | Si se proporciona, máximo 100 caracteres, puede ser `null`            |
| `status`        | Si se proporciona, debe ser `Active` o `Inactive`                     |

### Ejemplo de Solicitud

```http
PATCH /api/suppliers/3
Content-Type: application/json

{
  "phone": "+51-999888777",
  "email": "nuevoemail@verdurasfrescas.com"
}
```

### Ejemplo de Respuesta

```json
{
  "success": true,
  "message": "Supplier updated successfully",
  "data": {
    "id": 3,
    "name": "Verduras Frescas SAC",
    "ruc": "20111222333",
    "phone": "+51-999888777",
    "email": "nuevoemail@verdurasfrescas.com",
    "address": "Av. Agrícola 789, Lima",
    "contactPerson": "Carlos Mendoza",
    "status": "Active"
  },
  "timestamp": "2025-10-20T19:28:47.212Z"
}
```

### Códigos de Estado

- `200` - Proveedor actualizado exitosamente
- `400` - Datos de entrada inválidos o ID inválido
- `404` - Proveedor no encontrado

---

## DELETE /api/suppliers/:id

Elimina un proveedor del sistema.

### Parámetros de Ruta

| Parámetro | Tipo     | Obligatorio | Descripción                 |
| --------- | -------- | ----------- | --------------------------- |
| `id`      | `number` | Sí          | ID del proveedor a eliminar |

### Ejemplo de Solicitud

```http
DELETE /api/suppliers/3
```

### Ejemplo de Respuesta

```json
{
  "success": true,
  "message": "Supplier deleted successfully",
  "data": {
    "id": 3,
    "name": "Verduras Frescas SAC",
    "ruc": "20111222333",
    "phone": "+51-999888777",
    "email": "nuevoemail@verdurasfrescas.com",
    "address": "Av. Agrícola 789, Lima",
    "contactPerson": "Carlos Mendoza",
    "status": "Active"
  },
  "timestamp": "2025-10-20T19:28:47.212Z"
}
```

### Códigos de Estado

- `200` - Proveedor eliminado exitosamente
- `400` - ID inválido
- `404` - Proveedor no encontrado

---

## Estructura de Datos

### Objeto Supplier

```typescript
{
  id: number; // ID único del proveedor
  name: string; // Nombre o razón social del proveedor
  ruc?: string; // RUC o identificación fiscal (opcional)
  phone?: string; // Número de teléfono (opcional)
  email?: string; // Correo electrónico (opcional)
  address?: string; // Dirección física (opcional)
  contactPerson?: string; // Nombre de persona de contacto (opcional)
  status: "Active" | "Inactive"; // Estado del proveedor
}
```

---

## Relaciones con Otros Recursos

- **Compras**: Un proveedor puede tener múltiples compras asociadas → [Ver documentación](./purchases.md)

---

## Notas Adicionales

- Los campos opcionales solo se incluyen en la respuesta si tienen valores.
- El campo `email` debe tener un formato válido si se proporciona.
- Se recomienda incluir al menos un método de contacto (teléfono o email).
- El campo `contactPerson` es útil para identificar rápidamente con quién coordinar pedidos.
- Los proveedores pueden marcarse como `Inactive` sin eliminarlos para mantener el historial de compras.
- **Los datos no se eliminan físicamente**: Al eliminar un proveedor, se marca con `deleted_at` (soft delete) pero permanece en la base de datos para mantener el historial.
- Los campos `createdAt`, `updatedAt` y `deleted_at` no se incluyen en las respuestas de la API.

---

[← Volver al índice](../README.md)
