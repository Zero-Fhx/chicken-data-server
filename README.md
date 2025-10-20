# 🍗 Chicken Data API

API REST para la gestión de datos de un restaurante. Permite administrar platillos, ingredientes, proveedores, compras, ventas y sus respectivas categorías.

## 🚀 Inicio Rápido

### Requisitos Previos

- Node.js (v18 o superior)
- MySQL (v8.0 o superior)
- pnpm (v10.16.1 o superior)

### Instalación

```bash
# Clonar el repositorio
git clone <repository-url>
cd chicken-data-server

# Instalar dependencias
pnpm install

# Configurar variables de entorno
cp .env.example .env

# Iniciar el servidor en modo desarrollo
pnpm dev

# O iniciar en modo producción
pnpm start
```

### Verificación de Estado

Verifica que la API esté funcionando correctamente:

**Request:**

```http
GET /health
```

**Response:**

```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "2025-10-20T12:00:00.000Z"
}
```

## 📚 Recursos de la API

### Recursos Principales

| Recurso                        | Endpoint Base                | Descripción                            |
| ------------------------------ | ---------------------------- | -------------------------------------- |
| **Platillos**                  | `/api/dishes`                | Gestión de platillos del menú          |
| **Categorías de Platillos**    | `/api/dish-categories`       | Categorías para organizar platillos    |
| **Ingredientes**               | `/api/ingredients`           | Gestión de ingredientes                |
| **Categorías de Ingredientes** | `/api/ingredient-categories` | Categorías para organizar ingredientes |
| **Proveedores**                | `/api/suppliers`             | Gestión de proveedores                 |
| **Compras**                    | `/api/purchases`             | Registro de compras de ingredientes    |
| **Ventas**                     | `/api/sales`                 | Registro de ventas de platillos        |

### Documentación Detallada

- [📖 Platillos (Dishes)](./docs/dishes.md)
- [📖 Categorías de Platillos (Dish Categories)](./docs/dish-categories.md)
- [📖 Recetas de Platillos (Dish Ingredients)](./docs/dish-ingredients.md)
- [📖 Ingredientes (Ingredients)](./docs/ingredients.md)
- [📖 Categorías de Ingredientes (Ingredient Categories)](./docs/ingredient-categories.md)
- [📖 Proveedores (Suppliers)](./docs/suppliers.md)
- [📖 Compras (Purchases)](./docs/purchases.md)
- [📖 Ventas (Sales)](./docs/sales.md)

## 🔗 Endpoints Principales

### Índice de Endpoints

**Request:**

```http
GET /
```

**Response:**

```json
{
  "message": "Chicken Data API",
  "endpoints": {
    "health": "/health",
    "dishes": "/api/dishes",
    "dishCategories": "/api/dish-categories",
    "suppliers": "/api/suppliers",
    "ingredients": "/api/ingredients",
    "ingredientCategories": "/api/ingredient-categories",
    "purchases": "/api/purchases",
    "sales": "/api/sales"
  }
}
```

## 📋 Formato de Respuesta

Todas las respuestas de la API siguen un formato JSON consistente:

### Respuesta Exitosa (con paginación)

```json
{
  "success": true,
  "message": "Operación completada exitosamente",
  "data": [
    { "id": 1, "name": "Item 1" },
    { "id": 2, "name": "Item 2" }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "pageSize": 10,
      "pageCount": 5,
      "total": 50,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  },
  "timestamp": "2025-10-20T19:28:47.212Z"
}
```

### Respuesta Exitosa (sin paginación)

```json
{
  "success": true,
  "message": "Operación completada exitosamente",
  "data": {
    "id": 1,
    "name": "Item"
  },
  "timestamp": "2025-10-20T19:28:47.212Z"
}
```

### Respuesta de Error

```json
{
  "success": false,
  "message": "Descripción del error",
  "error": "Detalles adicionales del error",
  "timestamp": "2025-10-20T19:28:47.212Z"
}
```

### Errores de Validación

```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "name",
      "message": "Name is required"
    }
  ],
  "timestamp": "2025-10-20T19:28:47.212Z"
}
```

## 📄 Paginación

La mayoría de los endpoints que retornan listas soportan paginación mediante parámetros de consulta:

| Parámetro  | Tipo     | Por Defecto | Descripción                      |
| ---------- | -------- | ----------- | -------------------------------- |
| `page`     | `number` | `1`         | Número de página a obtener       |
| `pageSize` | `number` | `10`        | Cantidad de elementos por página |

La información de paginación se incluye en `meta.pagination` con los siguientes campos:

- `page`: Página actual
- `pageSize`: Elementos por página
- `pageCount`: Total de páginas disponibles
- `total`: Total de elementos
- `hasNextPage`: Indica si hay una página siguiente (`true`/`false`)
- `hasPrevPage`: Indica si hay una página anterior (`true`/`false`)

**Ejemplo:**

```http
GET /api/dishes?page=2&pageSize=20
```

## 🔍 Filtros

Muchos endpoints soportan filtros específicos. Consulta la documentación de cada recurso para conocer los filtros disponibles.

**Ejemplo:**

```http
GET /api/dishes?status=Active&minPrice=10&maxPrice=50
```

## 📊 Códigos de Estado HTTP

| Código | Descripción                                        |
| ------ | -------------------------------------------------- |
| `200`  | OK - Solicitud exitosa                             |
| `201`  | Created - Recurso creado exitosamente              |
| `400`  | Bad Request - Error en los datos enviados          |
| `404`  | Not Found - Recurso no encontrado                  |
| `500`  | Internal Server Error - Error interno del servidor |

## 🛠️ Tecnologías

- **Node.js** - Entorno de ejecución
- **Express** - Framework web
- **MySQL2** - Cliente de base de datos
- **Zod** - Validación de esquemas
- **CORS** - Habilitación de CORS
- **Morgan** - Logger de peticiones HTTP

## 📝 Notas Importantes

- Todos los endpoints requieren el header `Content-Type: application/json` para las solicitudes POST y PATCH.
- Los campos de tipo fecha deben estar en formato ISO 8601 (`YYYY-MM-DD`).
- Los valores de estado (`status`) son sensibles a mayúsculas: `Active` o `Inactive`.
- Los IDs son numéricos y autoincrementales.
- Las respuestas incluyen transformación de nombres de campos de snake_case a camelCase.

## 🔗 Enlaces Útiles

- [Documentación de Express](https://expressjs.com/)
- [Documentación de Zod](https://zod.dev/)
- [MySQL Documentation](https://dev.mysql.com/doc/)

---

**Versión:** 1.0.0  
**Última actualización:** Octubre 2025
