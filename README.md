# 🍗 Chicken Data API

API REST para la gestión de datos de un restaurante. Permite administrar platillos, ingredientes, proveedores, compras, ventas y sus respectivas categorías.

## 🚀 Inicio Rápido

### Requisitos Previos

- Node.js (v18 o superior)
- PostgreSQL (v13 o superior)
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

# Editar .env y configurar la URL de PostgreSQL
# Ejemplo: DATABASE_URL=postgresql://username:password@localhost:5432/chicken_data_db

# Iniciar el servidor en modo desarrollo
pnpm dev

# O iniciar en modo producción
pnpm start
```

### Configuración de PostgreSQL

1. **Instalar PostgreSQL** en tu sistema si no lo tienes instalado
2. **Crear la base de datos:**
   ```sql
   CREATE DATABASE chicken_data_db;
   ```
3. **Configurar la variable de entorno** `DATABASE_URL` en tu archivo `.env`:
   ```bash
   DATABASE_URL=postgresql://username:password@localhost:5432/chicken_data_db
   ```
4. **Para producción con SSL** (como Supabase):
   ```bash
   DATABASE_URL=postgresql://username:password@host:5432/database?sslmode=require
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

| Recurso                        | Endpoints agrupados                                                | Descripción                            |
| ------------------------------ | ------------------------------------------------------------------ | -------------------------------------- |
| **Platillos**                  | `/api/dishes`<br>`/api/dishes/:id`<br>`/api/dishes/:dishId/recipe` | Gestión de platillos y recetas         |
| **Categorías de Platillos**    | `/api/dish-categories`<br>`/api/dish-categories/:id`               | Categorías para organizar platillos    |
| **Ingredientes**               | `/api/ingredients`<br>`/api/ingredients/:id`                       | Gestión de ingredientes                |
| **Categorías de Ingredientes** | `/api/ingredient-categories`<br>`/api/ingredient-categories/:id`   | Categorías para organizar ingredientes |
| **Proveedores**                | `/api/suppliers`<br>`/api/suppliers/:id`                           | Gestión de proveedores                 |
| **Compras**                    | `/api/purchases`<br>`/api/purchases/:id`                           | Registro de compras de ingredientes    |
| **Ventas**                     | `/api/sales`<br>`/api/sales/:id`                                   | Registro de ventas de platillos        |

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

### Índice de Endpoints agrupados

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
    "dishes": {
      "list": "/api/dishes",
      "categories": "/api/dish-categories"
    },
    "suppliers": { "list": "/api/suppliers" },
    "ingredients": {
      "list": "/api/ingredients",
      "categories": "/api/ingredient-categories"
    },
    "purchases": { "list": "/api/purchases" },
    "sales": { "list": "/api/sales" }
  },
  "reference": {
    "health": {
      "GET /health": "Estado del servidor y base de datos"
    },
    "dishes": {
      "main": {
        "GET /api/dishes": "Lista de platillos (incluye detalles, sin receta)",
        "GET /api/dishes/:id": "Obtener un platillo (solo datos principales, sin receta)",
        "POST /api/dishes": "Crear platillo",
        "PATCH /api/dishes/:id": "Actualizar platillo",
        "DELETE /api/dishes/:id": "Eliminar platillo"
      },
      "recipe": {
        "GET /api/dishes/:dishId/recipe": "Obtener receta de platillo",
        "PUT /api/dishes/:dishId/recipe": "Reemplazar receta de platillo",
        "POST /api/dishes/:dishId/recipe": "Agregar ingrediente a receta",
        "PATCH /api/dishes/:dishId/recipe/:ingredientId": "Actualizar cantidad de ingrediente en receta",
        "DELETE /api/dishes/:dishId/recipe/:ingredientId": "Eliminar ingrediente de receta"
      },
      "categories": {
        "GET /api/dish-categories": "Lista de categorías de platillos",
        "GET /api/dish-categories/:id": "Obtener una categoría de platillo",
        "POST /api/dish-categories": "Crear categoría de platillo",
        "PATCH /api/dish-categories/:id": "Actualizar categoría de platillo",
        "DELETE /api/dish-categories/:id": "Eliminar categoría de platillo"
      }
    },
    "ingredients": {
      "main": {
        "GET /api/ingredients": "Lista de ingredientes (incluye detalles)",
        "GET /api/ingredients/:id": "Obtener un ingrediente (solo datos principales)",
        "POST /api/ingredients": "Crear ingrediente",
        "PATCH /api/ingredients/:id": "Actualizar ingrediente",
        "DELETE /api/ingredients/:id": "Eliminar ingrediente"
      },
      "categories": {
        "GET /api/ingredient-categories": "Lista de categorías de ingredientes",
        "GET /api/ingredient-categories/:id": "Obtener una categoría de ingrediente",
        "POST /api/ingredient-categories": "Crear categoría de ingrediente",
        "PATCH /api/ingredient-categories/:id": "Actualizar categoría de ingrediente",
        "DELETE /api/ingredient-categories/:id": "Eliminar categoría de ingrediente"
      }
    },
    "suppliers": {
      "GET /api/suppliers": "Lista de proveedores",
      "GET /api/suppliers/:id": "Obtener un proveedor",
      "POST /api/suppliers": "Crear proveedor",
      "PATCH /api/suppliers/:id": "Actualizar proveedor",
      "DELETE /api/suppliers/:id": "Eliminar proveedor"
    },
    "purchases": {
      "GET /api/purchases": "Lista de compras",
      "GET /api/purchases/:id": "Obtener una compra",
      "POST /api/purchases": "Registrar compra",
      "PATCH /api/purchases/:id": "Actualizar compra",
      "DELETE /api/purchases/:id": "Eliminar compra"
    },
    "sales": {
      "GET /api/sales": "Lista de ventas",
      "GET /api/sales/:id": "Obtener una venta",
      "POST /api/sales": "Registrar venta",
      "PATCH /api/sales/:id": "Actualizar venta",
      "DELETE /api/sales/:id": "Eliminar venta"
    }
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
- **PostgreSQL (pg)** - Cliente de base de datos
- **Zod** - Validación de esquemas
- **CORS** - Habilitación de CORS
- **Morgan** - Logger de peticiones HTTP

## 📝 Notas Importantes

- Todos los endpoints requieren el header `Content-Type: application/json` para las solicitudes POST y PATCH.
- Los campos de tipo fecha deben estar en formato ISO 8601 (`YYYY-MM-DD`).
- Los valores de estado (`status`) son sensibles a mayúsculas: `Active` o `Inactive`.
- Los IDs son numéricos y autoincrementales.
- Las respuestas incluyen transformación de nombres de campos de snake_case a camelCase.
- La base de datos PostgreSQL usa tablas en minúsculas con snake_case (ej: `dishes`, `ingredient_categories`).

## 🔗 Enlaces Útiles

- [Documentación de Express](https://expressjs.com/)
- [Documentación de Zod](https://zod.dev/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

---

**Versión:** 2.0.0
**Descripción:** Migración a PostgreSQL completada, mejora en la estructura de endpoints y documentación.
**Última actualización:** Octubre 2025
