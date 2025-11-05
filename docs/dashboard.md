# Dashboard Statistics API

## Endpoint: Get Dashboard Statistics

Obtiene todas las estadísticas agregadas del dashboard en un solo request, optimizado para mostrar un resumen ejecutivo completo del negocio.

### Request

**URL**: `/api/dashboard/stats`

**Method**: `GET`

**Authentication**: No requiere autenticación

### Response

**Status Code**: `200 OK`

**Response Body**:

```json
{
  "success": true,
  "data": {
    "sales": {
      "today": {
        "total": "1250.50",
        "count": 15,
        "average": "83.37",
        "growth": 12.5
      },
      "week": {
        "total": "8500.00",
        "count": 95,
        "average": "89.47",
        "growth": 8.2
      },
      "month": {
        "total": "35000.00",
        "count": 420,
        "average": "83.33",
        "growth": 15.3
      },
      "year": {
        "total": "180000.00"
      }
    },
    "purchases": {
      "today": {
        "total": "450.00",
        "count": 3
      },
      "week": {
        "total": "2800.00",
        "count": 12
      },
      "month": {
        "total": "12000.00",
        "count": 45,
        "growth": 5.5
      },
      "year": {
        "total": "65000.00"
      }
    },
    "inventory": {
      "total": 85,
      "active": 80,
      "inactive": 5,
      "alerts": {
        "lowStock": 12,
        "outOfStock": 3,
        "optimal": 70
      },
      "criticalIngredients": [
        {
          "id": 5,
          "name": "Pollo entero",
          "currentStock": "2.50",
          "minimumStock": "10.00",
          "unit": "kg",
          "stockPercentage": 25.0
        },
        {
          "id": 12,
          "name": "Papas",
          "currentStock": "5.00",
          "minimumStock": "15.00",
          "unit": "kg",
          "stockPercentage": 33.3
        }
      ],
      "totalValue": "15000.00"
    },
    "dishes": {
      "total": 25,
      "active": 22,
      "inactive": 3,
      "topSelling": [
        {
          "id": 1,
          "name": "Pollo a la Brasa - 1/4",
          "quantitySold": 150,
          "revenue": "3750.00",
          "revenuePercentage": 10.7
        },
        {
          "id": 2,
          "name": "Pollo a la Brasa - 1/2",
          "quantitySold": 120,
          "revenue": "5400.00",
          "revenuePercentage": 15.4
        }
      ],
      "leastSelling": [
        {
          "id": 15,
          "name": "Ensalada Especial",
          "quantitySold": 5
        }
      ]
    },
    "suppliers": {
      "total": 12,
      "active": 10,
      "inactive": 2,
      "topSuppliers": [
        {
          "id": 3,
          "name": "Avícola San Fernando",
          "purchaseCount": 15,
          "totalSpent": "5500.00"
        },
        {
          "id": 7,
          "name": "Distribuidora Los Andes",
          "purchaseCount": 12,
          "totalSpent": "3200.00"
        }
      ]
    },
    "recentActivity": {
      "lastSale": {
        "timestamp": "2025-11-05T14:30:00.000Z",
        "timeAgo": "hace 15 minutos"
      },
      "lastPurchase": {
        "timestamp": "2025-11-05T10:20:00.000Z",
        "timeAgo": "hace 4 horas"
      },
      "today": {
        "dishesSold": 45,
        "mostUsedIngredient": {
          "id": 5,
          "name": "Pollo entero",
          "quantityUsed": "12.50"
        }
      }
    }
  },
  "message": "Dashboard statistics retrieved successfully",
  "timestamp": "2025-11-05T14:45:20.703Z"
}
```

### Response Fields

#### `sales` Object

Estadísticas de ventas organizadas por período:

- **today**: Ventas del día actual (desde las 00:00:00)

  - `total`: Total de ventas en moneda (string con 2 decimales)
  - `count`: Número de transacciones
  - `average`: Ticket promedio (string con 2 decimales)
  - `growth`: Porcentaje de crecimiento vs día anterior (número con 1 decimal)

- **week**: Ventas de la semana actual (desde el lunes 00:00:00)

  - `total`: Total de ventas
  - `count`: Número de transacciones
  - `average`: Ticket promedio
  - `growth`: Porcentaje de crecimiento vs semana anterior

- **month**: Ventas del mes actual (desde el día 1 00:00:00)

  - `total`: Total de ventas
  - `count`: Número de transacciones
  - `average`: Ticket promedio
  - `growth`: Porcentaje de crecimiento vs mes anterior

- **year**: Ventas del año actual
  - `total`: Total de ventas

#### `purchases` Object

Estadísticas de compras organizadas por período:

- **today**: Compras del día actual

  - `total`: Total gastado
  - `count`: Número de transacciones

- **week**: Compras de la semana actual

  - `total`: Total gastado
  - `count`: Número de transacciones

- **month**: Compras del mes actual

  - `total`: Total gastado
  - `count`: Número de transacciones
  - `growth`: Porcentaje de variación vs mes anterior

- **year**: Compras del año actual
  - `total`: Total gastado

#### `inventory` Object

Estadísticas del inventario y alertas de stock:

- `total`: Total de ingredientes registrados
- `active`: Ingredientes con estado "Active"
- `inactive`: Ingredientes con estado "Inactive"

- **alerts**: Alertas de stock

  - `lowStock`: Ingredientes con stock < stock mínimo
  - `outOfStock`: Ingredientes con stock = 0
  - `optimal`: Ingredientes con stock >= stock mínimo

- **criticalIngredients**: Array con los 5 ingredientes más críticos

  - `id`: ID del ingrediente
  - `name`: Nombre del ingrediente
  - `currentStock`: Stock actual (string con 2 decimales)
  - `minimumStock`: Stock mínimo configurado
  - `unit`: Unidad de medida
  - `stockPercentage`: Porcentaje de stock disponible respecto al mínimo

- `totalValue`: Valor total estimado del inventario basado en últimos precios de compra

#### `dishes` Object

Estadísticas de platos:

- `total`: Total de platos registrados
- `active`: Platos con estado "Active"
- `inactive`: Platos con estado "Inactive"

- **topSelling**: Top 5 platos más vendidos del mes

  - `id`: ID del plato
  - `name`: Nombre del plato
  - `quantitySold`: Cantidad total vendida en el mes
  - `revenue`: Ingresos totales generados por ese plato
  - `revenuePercentage`: Porcentaje que representa del total de ventas

- **leastSelling**: 3 platos menos vendidos del mes
  - `id`: ID del plato
  - `name`: Nombre del plato
  - `quantitySold`: Cantidad total vendida en el mes

#### `suppliers` Object

Estadísticas de proveedores:

- `total`: Total de proveedores registrados
- `active`: Proveedores con estado "Active"
- `inactive`: Proveedores con estado "Inactive"

- **topSuppliers**: Top 3 proveedores más utilizados del mes
  - `id`: ID del proveedor
  - `name`: Nombre del proveedor
  - `purchaseCount`: Cantidad de compras realizadas en el mes
  - `totalSpent`: Total gastado con ese proveedor en el mes

#### `recentActivity` Object

Actividad reciente del sistema:

- **lastSale**: Información de la última venta registrada

  - `timestamp`: Fecha y hora en formato ISO 8601
  - `timeAgo`: Tiempo transcurrido en formato legible (ej: "hace 15 minutos")

- **lastPurchase**: Información de la última compra registrada

  - `timestamp`: Fecha y hora en formato ISO 8601
  - `timeAgo`: Tiempo transcurrido en formato legible

- **today**: Resumen del día actual
  - `dishesSold`: Cantidad total de platos vendidos hoy
  - **mostUsedIngredient**: Ingrediente más utilizado hoy
    - `id`: ID del ingrediente
    - `name`: Nombre del ingrediente
    - `quantityUsed`: Cantidad total utilizada (string con 2 decimales)

### Error Responses

**500 Internal Server Error**

```json
{
  "success": false,
  "error": {
    "type": "InternalServerError",
    "message": "Failed to fetch dashboard statistics"
  },
  "timestamp": "2025-11-05T14:45:20.703Z"
}
```

### Notes

- Todas las consultas consideran solo registros con `deleted_at IS NULL` y `status = 'Completed'`
- Los períodos se calculan en base a la zona horaria del servidor
- La semana actual comienza el lunes a las 00:00:00
- El crecimiento se calcula como: `((actual - anterior) / anterior) * 100`
- Si el valor anterior es 0, el crecimiento retorna 100 si hay valor actual, o 0 si no hay
- Los valores monetarios siempre tienen 2 decimales
- Los porcentajes tienen 1 decimal
- El endpoint está optimizado para responder en menos de 2 segundos
- Si alguna métrica falla al calcularse, retorna `null` para esa sección específica

### Use Cases

1. **Dashboard Principal**: Mostrar tarjetas de estadísticas con métricas clave
2. **Gráficas y Charts**: Visualizar tendencias de ventas y compras
3. **Alertas de Inventario**: Mostrar badges de alerta para ingredientes críticos
4. **Análisis de Productos**: Identificar platos más y menos populares
5. **Gestión de Proveedores**: Ver proveedores más utilizados

### Performance Considerations

- El endpoint ejecuta múltiples queries SQL agregadas en paralelo
- Usa índices en columnas de fecha y estado para optimización
- No implementa caché por defecto, pero se puede agregar si es necesario
- Todas las consultas son eficientes y usan agregaciones a nivel de base de datos
