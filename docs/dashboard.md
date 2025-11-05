# Dashboard API Documentation

API completa de estadísticas y análisis del dashboard para el sistema de gestión de restaurante. Todos los endpoints retornan valores monetarios en Soles Peruanos (S/.).

## Tabla de Contenidos

1. [Endpoints Principales](#endpoints-principales)
2. [Estadísticas por Sección](#estadísticas-por-sección)
3. [Análisis Avanzado](#análisis-avanzado)
4. [Formato de Respuesta](#formato-de-respuesta)

---

## Endpoints Principales

### 1. Obtener Lista de Endpoints

Lista todos los endpoints disponibles del dashboard con sus descripciones.

**Request:**
```http
GET /api/dashboard/
```

**Response:**
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
    }
    // ... más endpoints
  },
  "timestamp": "2025-11-05T08:00:00.000Z"
}
```

---

### 2. Dashboard Completo

Obtiene todas las estadísticas del dashboard en un solo request.

**Request:**
```http
GET /api/dashboard/stats
```

**Response Structure:**
```json
{
  "success": true,
  "message": "Dashboard statistics retrieved successfully",
  "data": {
    "sales": { /* Estadísticas de ventas */ },
    "purchases": { /* Estadísticas de compras */ },
    "inventory": { /* Estado del inventario */ },
    "dishes": { /* Estadísticas de platos */ },
    "suppliers": { /* Información de proveedores */ },
    "recentActivity": { /* Actividad reciente */ },
    "financial": { /* Métricas financieras */ }
  },
  "timestamp": "2025-11-05T08:00:00.000Z"
}
```

**Campos Detallados:**

#### `sales` - Estadísticas de Ventas
```json
{
  "today": {
    "total": 74,           // Total vendido hoy (S/.)
    "count": 2,            // Número de ventas
    "average": 37,         // Promedio por venta
    "growth": 604.8        // Crecimiento vs ayer (%)
  },
  "week": {
    "total": 106.5,
    "count": 4,
    "average": 26.63,
    "growth": -39.5
  },
  "month": {
    "total": 246.5,
    "count": 5,
    "average": 49.3,
    "growth": 180.1
  },
  "year": {
    "total": 1514
  }
}
```

#### `purchases` - Estadísticas de Compras
```json
{
  "today": {
    "total": 0,
    "count": 0
  },
  "week": {
    "total": 142,
    "count": 3
  },
  "month": {
    "total": 142,
    "count": 3,
    "growth": 100
  },
  "year": {
    "total": 3619.5
  }
}
```

#### `inventory` - Estado del Inventario
```json
{
  "total": 22,             // Total de ingredientes
  "active": 21,            // Ingredientes activos
  "inactive": 1,           // Ingredientes inactivos
  "alerts": {
    "lowStock": 5,         // Ingredientes con stock bajo
    "outOfStock": 1,       // Ingredientes sin stock
    "optimal": 16          // Ingredientes con stock óptimo
  },
  "criticalIngredients": [
    {
      "id": 14,
      "name": "Vinagre tinto",
      "currentStock": 0,
      "minimumStock": 4,
      "unit": "litro",
      "stockPercentage": 0
    }
  ],
  "totalValue": 2483.05    // Valor total del inventario (S/.)
}
```

#### `dishes` - Estadísticas de Platos
```json
{
  "total": 16,
  "active": 14,
  "inactive": 2,
  "topSelling": [
    {
      "id": 6,
      "name": "Porción de Papas Fritas",
      "quantitySold": 20,
      "revenue": 140,
      "revenuePercentage": 56.8
    }
  ],
  "leastSelling": [
    {
      "id": 9,
      "name": "1/2 Pollo a la Brasa",
      "quantitySold": 1
    }
  ]
}
```

#### `suppliers` - Información de Proveedores
```json
{
  "total": 7,
  "active": 7,
  "inactive": 0,
  "topSuppliers": [
    {
      "id": 3,
      "name": "Aceites Del Sol",
      "purchaseCount": 2,
      "totalSpent": 137
    }
  ]
}
```

#### `recentActivity` - Actividad Reciente
```json
{
  "lastSale": {
    "timestamp": "2025-11-05T06:48:27.635Z",
    "timeAgo": "hace 1 hora",
    "timeValue": 1,
    "timeUnit": "hours"
  },
  "lastPurchase": {
    "timestamp": "2025-11-04T23:07:38.873Z",
    "timeAgo": "hace 9 horas",
    "timeValue": 9,
    "timeUnit": "hours"
  },
  "today": {
    "dishesSold": 4,
    "mostUsedIngredient": {
      "id": 1,
      "name": "Pollo fresco",
      "quantityUsed": 1.4
    }
  }
}
```

#### `financial` - Métricas Financieras
```json
{
  "profitMargin": {
    "today": 100,          // Margen hoy (%)
    "week": -33.3,         // Margen semanal (%)
    "month": 42.4          // Margen mensual (%)
  },
  "roi": {
    "month": 73.6          // ROI mensual (%)
  },
  "costs": {
    "averageCostPerDish": 28.4,      // Costo promedio por plato (S/.)
    "foodCostPercentage": 57.6       // % de costo de alimentos
  },
  "profit": {
    "today": 74,                      // Utilidad hoy (S/.)
    "week": -35.5,                    // Utilidad semanal (S/.)
    "month": 104.5,                   // Utilidad mensual (S/.)
    "averageProfitPerDish": 20.9     // Utilidad promedio por plato (S/.)
  }
}
```

---

## Estadísticas por Sección

### 3. Estadísticas de Ventas

Obtiene solo las estadísticas de ventas.

**Request:**
```http
GET /api/dashboard/stats/sales
```

**Response:**
```json
{
  "success": true,
  "message": "Sales statistics retrieved successfully",
  "data": {
    "today": { /* ... */ },
    "week": { /* ... */ },
    "month": { /* ... */ },
    "year": { /* ... */ }
  },
  "timestamp": "2025-11-05T08:00:00.000Z"
}
```

---

### 4. Estadísticas de Compras

**Request:**
```http
GET /api/dashboard/stats/purchases
```

---

### 5. Estadísticas de Inventario

**Request:**
```http
GET /api/dashboard/stats/inventory
```

---

### 6. Estadísticas de Platos

**Request:**
```http
GET /api/dashboard/stats/dishes
```

---

### 7. Estadísticas de Proveedores

**Request:**
```http
GET /api/dashboard/stats/suppliers
```

---

### 8. Actividad Reciente

**Request:**
```http
GET /api/dashboard/stats/activity
```

---

## Análisis Avanzado

### 9. Tendencias Históricas

Obtiene series temporales para visualización de tendencias.

**Request:**
```http
GET /api/dashboard/trends?period=7d&granularity=daily
```

**Query Parameters:**
- `period` (opcional): Período de tiempo. Formato: `{número}{unidad}`
  - Unidades: `d` (días), `w` (semanas), `m` (meses), `y` (años)
  - Ejemplos: `7d`, `4w`, `6m`, `1y`
  - Default: `7d`
- `granularity` (opcional): Granularidad de los datos
  - Valores: `hourly`, `daily`, `weekly`, `monthly`, `yearly`
  - Default: `daily`

**Response:**
```json
{
  "success": true,
  "message": "Trends retrieved successfully",
  "data": {
    "period": "7d",
    "granularity": "daily",
    "sales": [
      {
        "date": "2025-11-01",
        "total": 125.5,
        "count": 5,
        "average": 25.1
      },
      {
        "date": "2025-11-02",
        "total": 240.0,
        "count": 8,
        "average": 30.0
      }
    ],
    "purchases": [
      {
        "date": "2025-11-01",
        "total": 450.0,
        "count": 3
      }
    ],
    "inventory": [
      {
        "date": "2025-11-01",
        "totalValue": 2500.0,
        "lowStockCount": 5
      }
    ]
  },
  "timestamp": "2025-11-05T08:00:00.000Z"
}
```

---

### 10. Alertas Inteligentes

Análisis automático de problemas y oportunidades.

**Request:**
```http
GET /api/dashboard/alerts
```

**Response:**
```json
{
  "success": true,
  "message": "Alerts retrieved successfully",
  "data": {
    "critical": [
      {
        "type": "out_of_stock",
        "title": "Ingrediente sin stock",
        "message": "Vinagre tinto está sin stock (0.0 litro disponible)",
        "severity": "critical",
        "data": {
          "ingredientId": 14,
          "ingredientName": "Vinagre tinto",
          "currentStock": 0,
          "minimumStock": 4,
          "unit": "litro"
        }
      }
    ],
    "warning": [
      {
        "type": "low_stock",
        "title": "Stock bajo",
        "message": "Limón tiene stock bajo (40.0% del mínimo requerido)",
        "severity": "warning",
        "data": {
          "ingredientId": 8,
          "ingredientName": "Limón",
          "currentStock": 2,
          "minimumStock": 5,
          "unit": "kg",
          "percentage": 40
        }
      },
      {
        "type": "sales_drop",
        "title": "Caída en ventas",
        "message": "Las ventas han caído -39.5% esta semana comparado con la semana anterior",
        "severity": "warning",
        "data": {
          "currentWeekSales": 106.5,
          "previousWeekSales": 176.0,
          "dropPercentage": -39.5
        }
      }
    ],
    "info": [
      {
        "type": "unused_ingredients",
        "title": "Ingredientes sin uso reciente",
        "message": "Hay 1 ingrediente(s) que no se han usado en los últimos 30 días",
        "severity": "info",
        "data": {
          "count": 1,
          "ingredients": [
            {
              "ingredientId": 20,
              "ingredientName": "Cilantro",
              "currentStock": 0.5,
              "unit": "kg",
              "daysUnused": 45
            }
          ]
        }
      }
    ],
    "summary": {
      "total": 18,
      "critical": 1,
      "warning": 16,
      "info": 1
    }
  },
  "timestamp": "2025-11-05T08:00:00.000Z"
}
```

**Tipos de Alertas:**
- `out_of_stock` (crítico): Ingredientes sin stock
- `low_stock` (advertencia): Stock por debajo del mínimo
- `sales_drop` (advertencia): Caída significativa en ventas (>20%)
- `unnecessary_purchases` (advertencia): Compras de ingredientes con sobrestock
- `unused_ingredients` (info): Ingredientes sin uso en 30+ días

---

### 11. Proyecciones y Predicciones

Predicciones de ventas, stock y recomendaciones de compra.

**Request:**
```http
GET /api/dashboard/projections?days=30
```

**Query Parameters:**
- `days` (opcional): Número de días a proyectar (1-365)
  - Default: `30`

**Response:**
```json
{
  "success": true,
  "message": "Projections retrieved successfully",
  "data": {
    "sales": {
      "projectedTotal": 1050.0,
      "projectedDays": 30,
      "dailyAverage": 35.0,
      "confidence": "medium",
      "trend": "stable"
    },
    "stock": {
      "criticalIngredients": [
        {
          "ingredientId": 1,
          "ingredientName": "Pollo fresco",
          "currentStock": 33.2,
          "dailyUsage": 1.2,
          "daysUntilDepletion": 28,
          "projectedDepletionDate": "2025-12-03",
          "status": "warning"
        }
      ]
    },
    "purchaseRecommendations": [
      {
        "ingredientId": 14,
        "ingredientName": "Vinagre tinto",
        "currentStock": 0,
        "minimumStock": 4,
        "recommendedQuantity": 6,
        "unit": "litro",
        "estimatedCost": 42.0,
        "priority": "urgent",
        "reason": "Sin stock - Requerido inmediatamente",
        "suggestedPurchaseDate": "2025-11-05"
      }
    ],
    "summary": {
      "totalRecommendations": 3,
      "totalEstimatedCost": 1110.44,
      "urgentCount": 1,
      "normalCount": 2
    }
  },
  "timestamp": "2025-11-05T08:00:00.000Z"
}
```

**Estados de Stock:**
- `critical`: Menos de 7 días de stock
- `warning`: 7-14 días de stock
- `ok`: Más de 14 días de stock

**Prioridades de Compra:**
- `urgent`: Sin stock o crítico
- `normal`: Stock bajo pero todavía disponible

---

### 12. Comparativas Expandidas

Comparaciones detalladas entre períodos actuales, anteriores y mismo período del año anterior.

**Request:**
```http
GET /api/dashboard/comparisons
```

**Response:**
```json
{
  "success": true,
  "message": "Comparisons retrieved successfully",
  "data": {
    "sales": {
      "today": {
        "current": 74,
        "vsYesterday": {
          "value": 10.5,
          "change": 604.8
        },
        "vsSameDayLastYear": {
          "value": 0,
          "change": null
        }
      },
      "week": {
        "current": 106.5,
        "vsLastWeek": {
          "value": 176,
          "change": -39.5
        },
        "vsSameWeekLastYear": {
          "value": 0,
          "change": null
        }
      },
      "month": {
        "current": 246.5,
        "vsLastMonth": {
          "value": 88,
          "change": 180.1
        },
        "vsSameMonthLastYear": {
          "value": 0,
          "change": null
        }
      },
      "year": {
        "current": 1514,
        "vsLastYear": {
          "value": 0,
          "change": null
        }
      }
    },
    "purchases": {
      "today": { /* ... */ },
      "week": { /* ... */ },
      "month": { /* ... */ },
      "year": { /* ... */ }
    },
    "inventory": {
      "totalIngredients": {
        "current": 22,
        "vs30DaysAgo": {
          "value": 22,
          "change": 0
        }
      },
      "lowStockItems": {
        "current": 5,
        "vs30DaysAgo": {
          "value": 0,
          "change": null
        }
      },
      "totalValue": {
        "current": 2483.05,
        "vs30DaysAgo": {
          "value": 0,
          "change": null
        }
      }
    },
    "dishes": {
      "topDishes": [
        {
          "id": 6,
          "name": "Porción de Papas Fritas",
          "currentMonth": {
            "quantitySold": 20,
            "revenue": 140
          },
          "lastMonth": {
            "quantitySold": 12,
            "revenue": 84
          },
          "change": {
            "quantityPercent": 66.7,
            "revenuePercent": 66.7
          }
        }
      ]
    }
  },
  "timestamp": "2025-11-05T08:00:00.000Z"
}
```

**Campos de Comparación:**
- `current`: Valor del período actual
- `value`: Valor del período de comparación
- `change`: Porcentaje de cambio (positivo = crecimiento, negativo = decrecimiento)
- `null`: Sin datos disponibles para comparar

---

### 13. Desglose de Ventas por Categoría

Análisis de ventas desglosado por categorías de platos.

**Request:**
```http
GET /api/dashboard/breakdown/sales
```

**Response:**
```json
{
  "success": true,
  "message": "Sales breakdown retrieved successfully",
  "data": {
    "byCategory": [
      {
        "categoryId": 1,
        "categoryName": "Platos Principales",
        "description": "Platos de pollo a la brasa",
        "week": {
          "revenue": 74,
          "quantity": 4,
          "dishesCount": 3,
          "percentage": 69.5
        },
        "month": {
          "revenue": 196,
          "quantity": 9,
          "dishesCount": 4,
          "percentage": 79.5
        },
        "year": {
          "revenue": 1133.5,
          "quantity": 41,
          "percentage": 74.9
        }
      },
      {
        "categoryId": 2,
        "categoryName": "Acompañamientos",
        "description": "Guarniciones y extras",
        "week": {
          "revenue": 32.5,
          "quantity": 23,
          "dishesCount": 2,
          "percentage": 30.5
        },
        "month": {
          "revenue": 50.5,
          "quantity": 31,
          "dishesCount": 2,
          "percentage": 20.5
        },
        "year": {
          "revenue": 380.5,
          "quantity": 173,
          "percentage": 25.1
        }
      }
    ],
    "totals": {
      "week": 106.5,
      "month": 246.5,
      "year": 1514
    }
  },
  "timestamp": "2025-11-05T08:00:00.000Z"
}
```

**Campos por Categoría:**
- `revenue`: Ingresos totales de la categoría (S/.)
- `quantity`: Cantidad total de platos vendidos
- `dishesCount`: Número de platos diferentes vendidos de esa categoría
- `percentage`: Porcentaje del total de ventas

---

### 14. Desglose de Compras por Categoría

Análisis de compras desglosado por categorías de ingredientes.

**Request:**
```http
GET /api/dashboard/breakdown/purchases
```

**Response:**
```json
{
  "success": true,
  "message": "Purchases breakdown retrieved successfully",
  "data": {
    "byCategory": [
      {
        "categoryId": 1,
        "categoryName": "Carnes y Aves",
        "description": "Productos cárnicos principales",
        "week": {
          "cost": 85,
          "quantity": 15.5,
          "ingredientsCount": 2,
          "percentage": 59.9
        },
        "month": {
          "cost": 85,
          "quantity": 15.5,
          "ingredientsCount": 2,
          "percentage": 59.9
        },
        "year": {
          "cost": 2108,
          "quantity": 358.6,
          "percentage": 58.2
        }
      },
      {
        "categoryId": 3,
        "categoryName": "Aceites y Grasas",
        "description": "Aceites para cocinar",
        "week": {
          "cost": 57,
          "quantity": 12,
          "ingredientsCount": 1,
          "percentage": 40.1
        },
        "month": {
          "cost": 57,
          "quantity": 12,
          "ingredientsCount": 1,
          "percentage": 40.1
        },
        "year": {
          "cost": 1511.5,
          "quantity": 319,
          "percentage": 41.8
        }
      }
    ],
    "totals": {
      "week": 142,
      "month": 142,
      "year": 3619.5
    }
  },
  "timestamp": "2025-11-05T08:00:00.000Z"
}
```

**Campos por Categoría:**
- `cost`: Costo total de compras de la categoría (S/.)
- `quantity`: Cantidad total comprada (en unidades variadas)
- `ingredientsCount`: Número de ingredientes diferentes comprados de esa categoría
- `percentage`: Porcentaje del total de compras

---

## Formato de Respuesta

Todas las respuestas siguen el mismo formato estándar:

### Respuesta Exitosa
```json
{
  "success": true,
  "message": "Mensaje descriptivo de la operación",
  "data": { /* Datos solicitados */ },
  "timestamp": "2025-11-05T08:00:00.000Z"
}
```

### Respuesta de Error
```json
{
  "success": false,
  "message": "Descripción del error",
  "error": {
    "code": "ERROR_CODE",
    "details": "Detalles adicionales del error"
  },
  "timestamp": "2025-11-05T08:00:00.000Z"
}
```

### Códigos de Estado HTTP

- `200 OK`: Operación exitosa
- `400 Bad Request`: Parámetros inválidos
- `404 Not Found`: Recurso no encontrado
- `500 Internal Server Error`: Error del servidor

---

## Notas Importantes

1. **Moneda**: Todos los valores monetarios están en Soles Peruanos (S/.)
2. **Zona Horaria**: Todos los timestamps están en UTC
3. **Períodos de Tiempo**:
   - Hoy: Día actual (00:00:00 - 23:59:59 UTC)
   - Semana: Últimos 7 días (incluyendo hoy)
   - Mes: Mes calendario actual
   - Año: Año calendario actual
4. **Cálculos de Crecimiento**: Se calculan comparando con el período anterior equivalente
5. **Stock Crítico**: Se considera crítico cuando está por debajo del stock mínimo configurado
6. **Valores Nulos**: Un valor `null` en campos de cambio indica que no hay datos del período anterior para comparar

---

## Casos de Uso

### Dashboard Principal
```http
GET /api/dashboard/stats
```
Obtiene todas las métricas clave en un solo request para mostrar el resumen ejecutivo completo.

### Gráficas de Tendencias
```http
GET /api/dashboard/trends?period=30d&granularity=daily
```
Obtiene datos históricos para visualizar tendencias en gráficas de líneas.

### Panel de Alertas
```http
GET /api/dashboard/alerts
```
Muestra notificaciones importantes que requieren atención inmediata.

### Planificación de Compras
```http
GET /api/dashboard/projections?days=7
```
Proyecta el consumo para planificar las compras de la próxima semana.

### Análisis de Rendimiento
```http
GET /api/dashboard/comparisons
```
Compara el rendimiento actual con períodos anteriores para identificar tendencias.

### Análisis por Categorías
```http
GET /api/dashboard/breakdown/sales
GET /api/dashboard/breakdown/purchases
```
Identifica qué categorías de productos son más rentables o costosas.

---

## Ejemplos de Integración

### JavaScript (Fetch API)
```javascript
// Obtener dashboard completo
const response = await fetch('/api/dashboard/stats');
const data = await response.json();

if (data.success) {
  console.log('Ventas del mes:', data.data.sales.month.total);
  console.log('Margen de utilidad:', data.data.financial.profitMargin.month + '%');
}

// Obtener tendencias con parámetros
const trends = await fetch('/api/dashboard/trends?period=7d&granularity=daily');
const trendsData = await trends.json();

// Obtener proyecciones
const projections = await fetch('/api/dashboard/projections?days=14');
const projectionsData = await projections.json();
```

### React Hook Ejemplo
```javascript
import { useState, useEffect } from 'react';

function useDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/dashboard/stats')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setStats(data.data);
        } else {
          setError(data.message);
        }
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { stats, loading, error };
}
```

---

**Última actualización**: 5 de noviembre de 2025  
**Versión API**: 1.0  
**Base URL**: `/api/dashboard`
