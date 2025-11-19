# 📊 Dashboard

Endpoints para obtener estadísticas, métricas financieras, reportes y proyecciones del sistema.

## 🔗 Endpoints Principales

### 1. Obtener Resumen de Endpoints

Obtiene la lista de todos los endpoints disponibles para el dashboard.

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
    "financial": {
      "url": "/api/dashboard/stats/financial",
      "method": "GET",
      "description": "Obtiene métricas financieras (margen de beneficio, ROI, costos, ganancias)"
    }
    // ...
  },
  "timestamp": "2025-11-19T16:48:13.573Z"
}
```

---

## 📈 Estadísticas y Métricas

### 2. Estadísticas Generales

Obtiene un resumen agregado de ventas, compras, inventario, platos, proveedores y actividad reciente.

**URL:** `/api/dashboard/stats`
**Método:** `GET`

**Ejemplo de Respuesta:**

```json
{
  "success": true,
  "message": "Dashboard statistics retrieved successfully",
  "data": {
    "sales": {
      "today": {
        "total": 130.9,
        "count": 2,
        "average": 65.45,
        "growth": 194.2
      },
      "week": { "total": 193.4, "count": 4, "average": 48.35, "growth": -70.3 },
      "month": {
        "total": 1859.6,
        "count": 38,
        "average": 48.94,
        "growth": -46.2
      }
    },
    "purchases": {
      "month": { "total": 1606.57, "count": 4, "growth": -46.6 }
    },
    "inventory": {
      "total": 40,
      "alerts": { "lowStock": 3, "outOfStock": 3, "optimal": 34 },
      "totalValue": 1326.48
    },
    "financial": {
      "profitMargin": { "today": 100, "week": 100, "month": 13.6 },
      "roi": { "month": 15.7 },
      "profit": { "today": 130.9, "week": 193.4, "month": 253.03 }
    }
  },
  "timestamp": "2025-11-19T16:48:45.123Z"
}
```

### 3. Métricas Financieras

Obtiene métricas financieras detalladas como márgenes de beneficio, ROI, costos y ganancias netas.

**URL:** `/api/dashboard/stats/financial`
**Método:** `GET`

**Ejemplo de Respuesta:**

```json
{
  "success": true,
  "message": "Financial statistics retrieved successfully",
  "data": {
    "profitMargin": {
      "today": 100,
      "week": 100,
      "month": 13.6
    },
    "roi": {
      "month": 15.7
    },
    "costs": {
      "averageCostPerDish": 42.28,
      "foodCostPercentage": 86.4
    },
    "profit": {
      "today": 130.9,
      "week": 193.4,
      "month": 253.03,
      "averageProfitPerDish": 6.66
    }
  },
  "timestamp": "2025-11-19T16:49:22.647Z"
}
```

### 4. Estadísticas de Ventas

Obtiene estadísticas detalladas de ventas por períodos (hoy, semana, mes, año).

**URL:** `/api/dashboard/stats/sales`
**Método:** `GET`

**Ejemplo de Respuesta:**

```json
{
  "success": true,
  "message": "Sales statistics retrieved successfully",
  "data": {
    "today": { "total": 130.9, "count": 2, "average": 65.45, "growth": 194.2 },
    "week": { "total": 193.4, "count": 4, "average": 48.35, "growth": -70.3 },
    "month": {
      "total": 1859.6,
      "count": 38,
      "average": 48.94,
      "growth": -46.2
    },
    "year": { "total": 35718.2 }
  },
  "timestamp": "2025-11-19T16:48:48.479Z"
}
```

### 5. Estadísticas de Compras

Obtiene estadísticas detalladas de compras.

**URL:** `/api/dashboard/stats/purchases`
**Método:** `GET`

**Ejemplo de Respuesta:**

```json
{
  "success": true,
  "message": "Purchases statistics retrieved successfully",
  "data": {
    "today": { "total": 0, "count": 0 },
    "week": { "total": 0, "count": 0 },
    "month": { "total": 1606.57, "count": 4, "growth": -46.6 },
    "year": { "total": 21261.3 }
  },
  "timestamp": "2025-11-19T16:48:51.862Z"
}
```

### 6. Estadísticas de Inventario

Obtiene el estado actual del inventario, alertas de stock y valor total.

**URL:** `/api/dashboard/stats/inventory`
**Método:** `GET`

**Ejemplo de Respuesta:**

```json
{
  "success": true,
  "message": "Inventory statistics retrieved successfully",
  "data": {
    "total": 40,
    "active": 40,
    "inactive": 0,
    "alerts": {
      "lowStock": 3,
      "outOfStock": 3,
      "optimal": 34
    },
    "criticalIngredients": [
      {
        "id": 8,
        "name": "Cebolla Roja",
        "currentStock": 0,
        "minimumStock": 15,
        "unit": "kg",
        "stockPercentage": 0
      }
      // ...
    ],
    "totalValue": 1326.48
  },
  "timestamp": "2025-11-19T16:48:54.877Z"
}
```

### 7. Estadísticas de Platos

Obtiene estadísticas sobre los platos más y menos vendidos.

**URL:** `/api/dashboard/stats/dishes`
**Método:** `GET`

**Ejemplo de Respuesta:**

```json
{
  "success": true,
  "message": "Dishes statistics retrieved successfully",
  "data": {
    "total": 35,
    "active": 35,
    "inactive": 0,
    "topSelling": [
      {
        "id": 3,
        "name": "Cuarto de Pollo a la Brasa",
        "quantitySold": 15,
        "revenue": 382.5,
        "revenuePercentage": 20.6
      }
      // ...
    ],
    "leastSelling": [
      { "id": 32, "name": "Parrillada Mixta (2 personas)", "quantitySold": 0 }
      // ...
    ]
  },
  "timestamp": "2025-11-19T16:48:57.540Z"
}
```

### 8. Estadísticas de Proveedores

Obtiene estadísticas sobre los principales proveedores.

**URL:** `/api/dashboard/stats/suppliers`
**Método:** `GET`

**Ejemplo de Respuesta:**

```json
{
  "success": true,
  "message": "Suppliers statistics retrieved successfully",
  "data": {
    "total": 10,
    "active": 10,
    "inactive": 0,
    "topSuppliers": [
      {
        "id": 2,
        "name": "Distribuidora Vegetal Frescura",
        "purchaseCount": 1,
        "totalSpent": 537.99
      }
      // ...
    ]
  },
  "timestamp": "2025-11-19T16:49:02.276Z"
}
```

### 9. Actividad Reciente

Obtiene información sobre la última venta, última compra y actividad del día.

**URL:** `/api/dashboard/stats/activity`
**Método:** `GET`

**Ejemplo de Respuesta:**

```json
{
  "success": true,
  "message": "Recent activity retrieved successfully",
  "data": {
    "lastSale": {
      "timestamp": "2025-11-19T11:35:59.334Z",
      "timeAgo": "hace 5 horas",
      "timeValue": 5,
      "timeUnit": "hours"
    },
    "lastPurchase": {
      "timestamp": "2025-11-19T11:42:39.345Z",
      "timeAgo": "hace 5 horas",
      "timeValue": 5,
      "timeUnit": "hours"
    },
    "today": {
      "dishesSold": 3,
      "mostUsedIngredient": {
        "id": 1,
        "name": "Pollo Entero (2.0kg)",
        "quantityUsed": 1.5
      }
    }
  },
  "timestamp": "2025-11-19T16:49:05.074Z"
}
```

---

## 📉 Análisis y Proyecciones

### 10. Tendencias (Gráficos)

Obtiene series temporales de ventas y compras para gráficos.

**URL:** `/api/dashboard/trends`
**Método:** `GET`

**Parámetros de Consulta:**

| Parámetro      | Tipo      | Descripción                                      | Default |
| :------------- | :-------- | :----------------------------------------------- | :------ |
| `period`       | `string`  | Período (`7d`, `4w`, `6m`, `1y`).                | `7d`    |
| `granularity`  | `string`  | Granularidad (`hourly`, `daily`, `weekly`, etc). | `daily` |
| `includeEmpty` | `boolean` | Incluir períodos sin datos.                      | `true`  |

**Ejemplo de Respuesta:**

```json
{
  "success": true,
  "message": "Trends data retrieved successfully",
  "data": {
    "sales": [
      { "period": "2025-11-13", "count": 0, "revenue": 0 },
      { "period": "2025-11-14", "count": 2, "revenue": 150.5 }
      // ...
    ],
    "purchases": [
      { "period": "2025-11-13", "count": 1, "cost": 500.0 }
      // ...
    ]
  },
  "timestamp": "2025-11-19T16:11:01.952Z"
}
```

### 11. Proyecciones

Obtiene proyecciones de ventas y recomendaciones de compra basadas en el consumo histórico.

**URL:** `/api/dashboard/projections`
**Método:** `GET`

**Parámetros de Consulta:**

| Parámetro | Tipo     | Descripción               | Default |
| :-------- | :------- | :------------------------ | :------ |
| `days`    | `number` | Días a proyectar (1-365). | `30`    |

**Ejemplo de Respuesta:**

```json
{
  "success": true,
  "message": "Projections retrieved successfully",
  "data": {
    "sales": {
      "period": "30 días",
      "avgOrdersPerDay": 637,
      "avgRevenuePerDay": 31045.65,
      "projectedOrders": 19110,
      "projectedRevenue": 931369.5,
      "range": {
        "conservative": -367169.1,
        "optimistic": 2229908.1
      }
    },
    "stock": [
      {
        "ingredientId": 13,
        "ingredientName": "Papa Huayro (para freír)",
        "currentStock": 188.05,
        "daysUntilDepleted": 6.4,
        "recommendedOrderQuantity": 729.2,
        "priority": "high"
      }
      // ...
    ],
    "purchases": {
      "summary": {
        "totalItems": 3,
        "highPriorityItems": 3,
        "estimatedTotalCost": 1091.74
      },
      "recommendations": [
        // ... (lista detallada de ingredientes a comprar)
      ],
      "nextPurchaseDate": {
        "date": "2025-11-23",
        "daysFromNow": 4,
        "reason": "El ingrediente Papa Huayro (para freír) se agotará en 6 días"
      }
    }
  },
  "timestamp": "2025-11-19T16:49:09.472Z"
}
```

### 12. Comparaciones

Compara el rendimiento actual con períodos anteriores (ayer, semana pasada, año pasado).

**URL:** `/api/dashboard/comparisons`
**Método:** `GET`

**Ejemplo de Respuesta:**

```json
{
  "success": true,
  "message": "Comparisons retrieved successfully",
  "data": {
    "sales": {
      "today": {
        "current": 130.9,
        "vsYesterday": { "value": 44.5, "change": 194.2 },
        "vsSameDayLastYear": { "value": 105.9, "change": 23.6 }
      },
      "week": {
        "current": 193.4,
        "vsLastWeek": { "value": 651.2, "change": -70.3 }
      }
      // ...
    },
    "purchases": {
      // ... (estructura similar para compras)
    },
    "inventory": {
      "totalIngredients": { "current": 40 },
      "lowStockItems": { "current": 6 },
      "totalValue": { "current": 1016.83 }
    },
    "dishes": {
      "topDishes": [
        {
          "id": 3,
          "name": "Cuarto de Pollo a la Brasa",
          "currentMonth": { "quantitySold": 15, "revenue": 382.5 },
          "lastMonth": { "quantitySold": 25, "revenue": 637.5 },
          "change": { "quantityPercent": 0, "revenuePercent": -40 }
        }
        // ...
      ]
    }
  },
  "timestamp": "2025-11-19T16:49:12.804Z"
}
```

### 13. Desglose (Breakdown)

Obtiene el desglose de ventas o compras por categoría.

**URLs:**

- `/api/dashboard/breakdown/sales`
- `/api/dashboard/breakdown/purchases`

**Método:** `GET`

**Ejemplo de Respuesta (Ventas):**

```json
{
  "success": true,
  "message": "Sales breakdown retrieved successfully",
  "data": {
    "byCategory": [
      {
        "categoryId": 2,
        "categoryName": "Pollos a la Brasa",
        "description": "Platos principales basados en pollo entero o porción.",
        "week": { "revenue": 367.2, "quantity": 8, "percentage": 61.7 },
        "month": { "revenue": 1185.6, "quantity": 26, "percentage": 63.8 },
        "year": { "revenue": 22284.2, "quantity": 477, "percentage": 62.4 }
      }
      // ...
    ],
    "totals": {
      "week": 595.2,
      "month": 1859.6,
      "year": 35718.2
    }
  },
  "timestamp": "2025-11-19T16:49:16.676Z"
}
```

### 14. Alertas

Obtiene alertas inteligentes sobre stock bajo, ingredientes sin uso, caídas de ventas y sobrestock.

**URL:** `/api/dashboard/alerts`
**Método:** `GET`

**Ejemplo de Respuesta:**

```json
{
  "success": true,
  "message": "Alerts retrieved successfully",
  "data": {
    "critical": [
      {
        "id": "low-stock-8",
        "type": "low_stock",
        "severity": "critical",
        "title": "Sin stock: Cebolla Roja",
        "message": "0 kg disponibles (mínimo: 15 kg)",
        "action": "Realizar compra urgente",
        "timestamp": "2025-11-19T16:48:54.877Z"
      }
    ],
    "warning": [
      {
        "id": "sales-drop-current-week",
        "type": "sales_drop",
        "severity": "warning",
        "title": "Caída en ventas detectada",
        "message": "Las ventas de esta semana están 70.3% por debajo del promedio",
        "action": "Revisar estrategia de ventas y promociones"
      }
    ],
    "info": [],
    "summary": {
      "total": 2,
      "critical": 1,
      "warning": 1,
      "info": 0
    }
  },
  "timestamp": "2025-11-19T16:48:54.877Z"
}
```
