# 🚚 Proveedores (Suppliers)

Gestión de proveedores de insumos.

## 📋 Estructura del Objeto

| Campo           | Tipo     | Descripción                                  |
| :-------------- | :------- | :------------------------------------------- |
| `id`            | `number` | Identificador único del proveedor.           |
| `name`          | `string` | Razón social o nombre del proveedor.         |
| `ruc`           | `string` | Registro Único de Contribuyentes (opcional). |
| `phone`         | `string` | Teléfono de contacto.                        |
| `email`         | `string` | Correo electrónico.                          |
| `address`       | `string` | Dirección física.                            |
| `contactPerson` | `string` | Nombre de la persona de contacto.            |
| `status`        | `string` | Estado del proveedor: `Active` o `Inactive`. |

## 🔗 Endpoints

### 1. Listar Proveedores

Obtiene una lista paginada de proveedores.

**URL:** `/api/suppliers`
**Método:** `GET`

**Parámetros de Consulta (Query Params):**

| Parámetro  | Tipo     | Descripción                                   |
| :--------- | :------- | :-------------------------------------------- |
| `page`     | `number` | Número de página (default: 1).                |
| `pageSize` | `number` | Cantidad por página (default: 10).            |
| `search`   | `string` | Buscar por nombre, RUC o persona de contacto. |
| `status`   | `string` | Filtrar por estado (`Active`/`Inactive`).     |

**Ejemplo de Solicitud:**

```bash
curl -X GET "http://localhost:3000/api/suppliers?page=1&pageSize=10"
```

**Ejemplo de Respuesta:**

```json
{
  "success": true,
  "message": "Suppliers retrieved successfully",
  "data": [
    {
      "id": 10,
      "name": "Pescados y Mariscos del Pacífico",
      "ruc": "20012345670",
      "phone": "909876543",
      "email": "contacto@mariscos-pacifico.com",
      "address": "Muelle Pesquero 707, Chucuito",
      "contactPerson": "Javier Ramos",
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
  "timestamp": "2025-11-19T16:10:40.432Z"
}
```

### 2. Obtener Proveedor por ID

Obtiene los detalles de un proveedor específico.

**URL:** `/api/suppliers/:id`
**Método:** `GET`

**Ejemplo de Solicitud:**

```bash
curl -X GET "http://localhost:3000/api/suppliers/10"
```

**Ejemplo de Respuesta:**

```json
{
  "success": true,
  "message": "Supplier retrieved successfully",
  "data": {
    "id": 10,
    "name": "Pescados y Mariscos del Pacífico",
    "ruc": "20012345670",
    "phone": "909876543",
    "email": "contacto@mariscos-pacifico.com",
    "address": "Muelle Pesquero 707, Chucuito",
    "contactPerson": "Javier Ramos",
    "status": "Active"
  },
  "timestamp": "2025-11-19T16:10:40.432Z"
}
```

### 3. Crear Proveedor

Registra un nuevo proveedor.

**URL:** `/api/suppliers`
**Método:** `POST`
**Headers:** `Content-Type: application/json`

**Cuerpo de la Solicitud (Body):**

```json
{
  "name": "Nuevo Proveedor S.A.C.",
  "ruc": "20123456789",
  "phone": "987654321",
  "email": "ventas@nuevoproveedor.com",
  "address": "Av. Principal 123",
  "contactPerson": "Juan Pérez",
  "status": "Active"
}
```

**Ejemplo de Respuesta:**

```json
{
  "success": true,
  "message": "Supplier created successfully",
  "data": {
    "id": 11,
    "name": "Nuevo Proveedor S.A.C.",
    "ruc": "20123456789",
    "phone": "987654321",
    "email": "ventas@nuevoproveedor.com",
    "address": "Av. Principal 123",
    "contactPerson": "Juan Pérez",
    "status": "Active"
  },
  "timestamp": "2025-11-19T16:10:40.432Z"
}
```

### 4. Actualizar Proveedor

Actualiza los datos de un proveedor existente.

**URL:** `/api/suppliers/:id`
**Método:** `PATCH`
**Headers:** `Content-Type: application/json`

**Cuerpo de la Solicitud (Body):**

```json
{
  "phone": "999888777",
  "contactPerson": "María López"
}
```

**Ejemplo de Respuesta:**

```json
{
  "success": true,
  "message": "Supplier updated successfully",
  "data": {
    "id": 10,
    "name": "Pescados y Mariscos del Pacífico",
    "ruc": "20012345670",
    "phone": "999888777",
    "email": "contacto@mariscos-pacifico.com",
    "address": "Muelle Pesquero 707, Chucuito",
    "contactPerson": "María López",
    "status": "Active"
  },
  "timestamp": "2025-11-19T16:10:40.432Z"
}
```

### 5. Eliminar Proveedor

Marca un proveedor como eliminado (soft delete).

**URL:** `/api/suppliers/:id`
**Método:** `DELETE`

**Ejemplo de Respuesta:**

```json
{
  "success": true,
  "message": "Supplier deleted successfully",
  "data": {
    "id": 10,
    "name": "Pescados y Mariscos del Pacífico",
    "status": "Inactive"
  },
  "timestamp": "2025-11-19T16:10:40.432Z"
}
```
