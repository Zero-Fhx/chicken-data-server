# 📊 Dashboard

Endpoints para obtener estadísticas y reportes del sistema.

## 🔗 Endpoints

### 1. Obtener Resumen de Endpoints del Dashboard

Obtiene la lista de endpoints disponibles para el dashboard.

**URL:** `/api/dashboard`
**Método:** `GET`

**Ejemplo de Respuesta:**

```json
{
  "success": true,
  "message": "Dashboard endpoints retrieved successfully",
  "data": {
    "stats": {
      "url": "/api/dashboard/stats",
      "method": "GET",
      "description": "Obtiene todas las estadísticas agregadas del dashboard"
    },
    "sales": {
      "url": "/api/dashboard/stats/sales",
      "method": "GET",
      "description": "Obtiene solo las estadísticas de ventas"
    },
    "purchases": {
      "url": "/api/dashboard/stats/purchases",
      "method": "GET",
      "description": "Obtiene solo las estadísticas de compras"
    },
    "trends": {
      "url": "/api/dashboard/trends",
      "method": "GET",
      "description": "Obtiene series temporales de ventas, compras e inventario",
      "params": {
        "period": "Período de tiempo (ej: 7d, 4w, 6m, 1y). Por defecto: 7d",
        "granularity": "Granularidad (hourly, daily, weekly). Por defecto: daily"
      }
    },
    "alerts": {
      "url": "/api/dashboard/alerts",
      "method": "GET",
      "description": "Obtiene alertas inteligentes sobre stock bajo, etc."
    }
  },
  "timestamp": "2025-11-19T16:11:01.952Z"
}
```

### 2. Estadísticas Generales

Obtiene un resumen de estadísticas de ventas, compras, inventario, etc.

**URL:** `/api/dashboard/stats`
**Método:** `GET`

**Ejemplo de Respuesta:**

```json
{
  "success": true,
  "message": "Stats retrieved successfully",
  "data": {
    "sales": { "totalToday": 150.5, "countToday": 5 },
    "purchases": { "totalMonth": 1200.0, "countMonth": 3 },
    "inventory": { "lowStockCount": 2, "totalValue": 5000.0 }
  },
  "timestamp": "2025-11-19T16:11:01.952Z"
}
```

### 3. Tendencias

Obtiene datos históricos para gráficos.

**URL:** `/api/dashboard/trends`
**Método:** `GET`

**Parámetros de Consulta (Query Params):**

| Parámetro     | Tipo     | Descripción                                     |
| :------------ | :------- | :---------------------------------------------- |
| `period`      | `string` | `7d`, `4w`, `6m`, `1y` (default: `7d`).         |
| `granularity` | `string` | `hourly`, `daily`, `weekly` (default: `daily`). |

**Ejemplo de Respuesta:**

```json
{
  "success": true,
  "message": "Trends retrieved successfully",
  "data": {
    "sales": [
      { "date": "2025-11-18", "value": 200.0 },
      { "date": "2025-11-19", "value": 150.5 }
      // ...
    ],
    "purchases": [
      { "date": "2025-11-15", "value": 500.0 }
      // ...
    ]
  },
  "timestamp": "2025-11-19T16:11:01.952Z"
}
```

### 4. Alertas

Obtiene alertas sobre el estado del negocio.

**URL:** `/api/dashboard/alerts`
**Método:** `GET`

**Ejemplo de Respuesta:**

```json
{
  "success": true,
  "message": "Alerts retrieved successfully",
  "data": [
    {
      "type": "low_stock",
      "message": "El ingrediente 'Pollo' tiene stock bajo (2 unidades).",
      "severity": "high"
    }
    // ...
  ],
  "timestamp": "2025-11-19T16:11:01.952Z"
}
```
