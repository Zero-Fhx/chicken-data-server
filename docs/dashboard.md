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
    "sales": {
      /* Estadísticas de ventas */
    },
    "purchases": {
      /* Estadísticas de compras */
    },
    "inventory": {
      /* Estado del inventario */
    },
    "dishes": {
      /* Estadísticas de platos */
    },
    "suppliers": {
      /* Información de proveedores */
    },
    "recentActivity": {
      /* Actividad reciente */
    },
    "financial": {
      /* Métricas financieras */
    }
  },
  "timestamp": "2025-11-05T08:00:00.000Z"
}
```

**Campos Detallados:**

#### `sales` - Estadísticas de Ventas

```json
{
  "today": {
    "total": 74, // Total vendido hoy (S/.)
    "count": 2, // Número de ventas
    "average": 37, // Promedio por venta
    "growth": 604.8 // Crecimiento vs ayer (%)
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
  "total": 22, // Total de ingredientes
  "active": 21, // Ingredientes activos
  "inactive": 1, // Ingredientes inactivos
  "alerts": {
    "lowStock": 5, // Ingredientes con stock bajo
    "outOfStock": 1, // Ingredientes sin stock
    "optimal": 16 // Ingredientes con stock óptimo
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
  "totalValue": 2483.05 // Valor total del inventario (S/.)
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
    "today": 100, // Margen hoy (%)
    "week": -33.3, // Margen semanal (%)
    "month": 42.4 // Margen mensual (%)
  },
  "roi": {
    "month": 73.6 // ROI mensual (%)
  },
  "costs": {
    "averageCostPerDish": 28.4, // Costo promedio por plato (S/.)
    "foodCostPercentage": 57.6 // % de costo de alimentos
  },
  "profit": {
    "today": 74, // Utilidad hoy (S/.)
    "week": -35.5, // Utilidad semanal (S/.)
    "month": 104.5, // Utilidad mensual (S/.)
    "averageProfitPerDish": 20.9 // Utilidad promedio por plato (S/.)
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
    "today": {
      /* ... */
    },
    "week": {
      /* ... */
    },
    "month": {
      /* ... */
    },
    "year": {
      /* ... */
    }
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
GET /api/dashboard/trends?period=7d&granularity=daily&includeEmpty=true
```

**Query Parameters:**

- `period` (opcional): Período de tiempo. Formato: `{número}{unidad}`
  - Unidades: `d` (días), `w` (semanas), `m` (meses), `y` (años)
  - Ejemplos: `7d`, `4w`, `6m`, `1y`
  - Default: `7d`
- `granularity` (opcional): Granularidad de los datos
  - Valores: `hourly`, `daily`, `weekly`, `monthly`, `yearly`
  - Default: `daily`
- `includeEmpty` (opcional): Incluir períodos sin transacciones
  - Valores: `true`, `false`
  - Default: `true`
  - **true**: Retorna todos los períodos en el rango, incluyendo días sin transacciones (count: 0)
  - **false**: Retorna solo períodos con transacciones

**Response (includeEmpty=true):**

```json
{
  "success": true,
  "message": "Trends data retrieved successfully",
  "data": {
    "sales": [
      {
        "period": "2025-11-01",
        "count": 0,
        "revenue": "0.00"
      },
      {
        "period": "2025-11-02",
        "count": 0,
        "revenue": "0.00"
      },
      {
        "period": "2025-11-05",
        "count": 5,
        "revenue": "246.50"
      },
      {
        "period": "2025-11-06",
        "count": 2,
        "revenue": "580.00"
      }
      // ... más días (incluye todos los días en el rango)
    ],
    "purchases": [
      {
        "period": "2025-11-01",
        "count": 0,
        "cost": "0.00"
      },
      {
        "period": "2025-11-04",
        "count": 3,
        "cost": "142.00"
      }
      // ... más días (incluye todos los días en el rango)
    ]
  },
  "timestamp": "2025-11-06T01:33:35.032Z"
}
```

**Response (includeEmpty=false):**

```json
{
  "success": true,
  "message": "Trends data retrieved successfully",
  "data": {
    "sales": [
      {
        "period": "2025-11-05",
        "count": 5,
        "revenue": "246.50"
      },
      {
        "period": "2025-11-06",
        "count": 2,
        "revenue": "580.00"
      }
      // Solo días con ventas
    ],
    "purchases": [
      {
        "period": "2025-11-04",
        "count": 3,
        "cost": "142.00"
      },
      {
        "period": "2025-11-06",
        "count": 3,
        "cost": "282.00"
      }
      // Solo días con compras
    ]
  },
  "timestamp": "2025-11-06T01:33:35.032Z"
}
```

**Nota**: Los nombres de campos difieren según el tipo de dato:

- **Sales**: `period`, `count`, `revenue`
- **Purchases**: `period`, `count`, `cost`

**Cuándo usar `includeEmpty`:**

- **`true` (recomendado para gráficos)**: Útil para visualizaciones que requieren datos continuos. Los días sin actividad aparecen con valores en cero, facilitando la creación de gráficos completos sin gaps.
- **`false` (para análisis de datos)**: Más eficiente cuando solo necesitas los días con actividad real. Reduce el tamaño de la respuesta y facilita cálculos sobre días activos.

**Importante sobre las fechas:**

Las tendencias se agrupan por las **fechas reales de las transacciones**:

- **Ventas**: Usa `sale_date` (fecha de la venta)
- **Compras**: Usa `purchase_date` (fecha de la compra)

Esto significa que si registras una venta o compra con una fecha anterior, aparecerá en las estadísticas del período correspondiente a esa fecha, **no** en el día actual de creación del registro. Esto permite tener un historial preciso de las transacciones comerciales.

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
        "id": "low-stock-14",
        "type": "low_stock",
        "severity": "critical",
        "title": "Sin stock: Vinagre tinto",
        "message": "0.00 litro disponibles (mínimo: 4 litro)",
        "data": {
          "ingredientId": 14,
          "ingredientName": "Vinagre tinto",
          "currentStock": 0,
          "minimumStock": 4,
          "unit": "litro",
          "stockPercentage": 0
        },
        "action": "Realizar compra urgente",
        "timestamp": "2025-11-06T01:09:19.470Z"
      }
    ],
    "warning": [
      {
        "id": "low-stock-8",
        "type": "low_stock",
        "severity": "warning",
        "title": "Stock bajo: Limón",
        "message": "2.00 kg disponibles (mínimo: 5 kg)",
        "data": {
          "ingredientId": 8,
          "ingredientName": "Limón",
          "currentStock": 2,
          "minimumStock": 5,
          "unit": "kg",
          "stockPercentage": 40
        },
        "action": "Realizar compra urgente",
        "timestamp": "2025-11-06T01:09:19.470Z"
      },
      {
        "id": "unused-ingredient-3",
        "type": "unused_ingredient",
        "severity": "warning",
        "title": "Ingrediente sin uso: Aceite vegetal",
        "message": "No está asignado a ningún platillo (valor en stock: S/. 400.00)",
        "data": {
          "ingredientId": 3,
          "ingredientName": "Aceite vegetal",
          "quantity": 40,
          "unit": "litro",
          "stockValue": 400,
          "daysSinceLastPurchase": 15,
          "usedInDishes": 0
        },
        "action": "Asignar a platillos o considerar eliminar",
        "timestamp": "2025-11-06T01:09:19.572Z"
      },
      {
        "id": "sales-drop-1",
        "type": "sales_drop",
        "severity": "warning",
        "title": "Caída en ventas",
        "message": "Las ventas de esta semana están 45% por debajo del promedio histórico",
        "data": {
          "currentWeek": 125.5,
          "average": 228.18,
          "changePercentage": -45,
          "weekStart": "2025-11-03",
          "weekEnd": "2025-11-09"
        },
        "action": "Revisar estrategia de ventas y promociones",
        "timestamp": "2025-11-06T01:09:19.650Z"
      }
    ],
    "info": [
      {
        "id": "overstock-15",
        "type": "overstock",
        "severity": "info",
        "title": "Sobrestock: Orégano seco",
        "message": "Stock actual es 6x el mínimo requerido (valor: S/. 96.00)",
        "data": {
          "ingredientId": 15,
          "ingredientName": "Orégano seco",
          "currentStock": 6,
          "minimumStock": 1,
          "unit": "kg",
          "stockValue": 96,
          "stockRatio": 6,
          "avgPurchaseQuantity": 3,
          "recentPurchases": 2
        },
        "action": "Reducir cantidad en próximas compras",
        "timestamp": "2025-11-06T01:09:19.771Z"
      }
    ],
    "summary": {
      "total": 19,
      "critical": 1,
      "warning": 17,
      "info": 1
    }
  },
  "timestamp": "2025-11-06T01:09:19.771Z"
}
```

**Tipos de Alertas:**

- `low_stock` (crítico/advertencia): Ingredientes sin stock o por debajo del mínimo
  - Crítico: Stock ≤ 25% del mínimo
  - Advertencia: Stock ≤ 100% del mínimo
- `unused_ingredient` (advertencia): Ingredientes no asignados a ningún platillo
- `sales_drop` (advertencia): Ventas de la semana actual < 70% del promedio de 8 semanas
- `overstock` (info): Stock > 3x el mínimo requerido (desperdicio potencial)

**Campos Comunes en Alertas:**

- `id`: Identificador único de la alerta
- `type`: Tipo de alerta
- `severity`: Nivel de gravedad (`critical`, `warning`, `info`)
- `title`: Título descriptivo
- `message`: Mensaje detallado
- `data`: Datos específicos según el tipo
- `action`: Acción recomendada
- `timestamp`: Momento de generación

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
      "today": {
        /* ... */
      },
      "week": {
        /* ... */
      },
      "month": {
        /* ... */
      },
      "year": {
        /* ... */
      }
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
        "categoryId": 6,
        "categoryName": "Acompañamientos",
        "description": "Guarniciones adicionales que se pueden pedir por separado, como papas o camotes fritos.",
        "week": {
          "revenue": 140,
          "quantity": 20,
          "dishesCount": 1,
          "percentage": 55.7
        },
        "month": {
          "revenue": 140,
          "quantity": 20,
          "dishesCount": 1,
          "percentage": 55.7
        },
        "year": {
          "revenue": 147,
          "quantity": 21,
          "percentage": 9.4
        }
      },
      {
        "categoryId": 3,
        "categoryName": "Frito",
        "description": "Platos preparados mediante fritura profunda, como pollo broaster y alitas.",
        "week": {
          "revenue": 54,
          "quantity": 3,
          "dishesCount": 1,
          "percentage": 21.5
        },
        "month": {
          "revenue": 54,
          "quantity": 3,
          "dishesCount": 1,
          "percentage": 21.5
        },
        "year": {
          "revenue": 90,
          "quantity": 5,
          "percentage": 5.8
        }
      },
      {
        "categoryId": 9,
        "categoryName": "Combos",
        "description": "Paquetes promocionales que incluyen varios productos (plato principal, bebida, acompañamiento).",
        "week": {
          "revenue": 0,
          "quantity": 0,
          "dishesCount": 0,
          "percentage": 0
        },
        "month": {
          "revenue": 0,
          "quantity": 0,
          "dishesCount": 0,
          "percentage": 0
        },
        "year": {
          "revenue": 639,
          "quantity": 17,
          "percentage": 41
        }
      }
    ],
    "totals": {
      "week": 251.5,
      "month": 251.5,
      "year": 1558
    }
  },
  "timestamp": "2025-11-06T01:09:32.466Z"
}
```

**Campos por Categoría:**

- `revenue`: Ingresos totales de la categoría (S/.)
- `quantity`: Cantidad total de platos vendidos
- `dishesCount`: Número de platos diferentes vendidos de esa categoría
- `percentage`: Porcentaje del total de ventas

**Nota**: Las categorías con 0 ventas en el período actual también se incluyen si tienen ventas históricas.

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
        "categoryId": 3,
        "categoryName": "Verduras",
        "description": "Vegetales frescos, tubérculos como papas o camotes, y hortalizas para ensaladas.",
        "week": {
          "cost": 88,
          "quantity": 4,
          "ingredientsCount": 1,
          "percentage": 62
        },
        "month": {
          "cost": 88,
          "quantity": 4,
          "ingredientsCount": 1,
          "percentage": 62
        },
        "year": {
          "cost": 548,
          "quantity": 109,
          "percentage": 15.1
        }
      },
      {
        "categoryId": 5,
        "categoryName": "Condimentos",
        "description": "Especias, hierbas secas y sazonadores usados para marinar y dar sabor.",
        "week": {
          "cost": 48,
          "quantity": 4,
          "ingredientsCount": 1,
          "percentage": 33.8
        },
        "month": {
          "cost": 48,
          "quantity": 4,
          "ingredientsCount": 1,
          "percentage": 33.8
        },
        "year": {
          "cost": 248.5,
          "quantity": 20.5,
          "percentage": 6.9
        }
      },
      {
        "categoryId": 2,
        "categoryName": "Carnes",
        "description": "Proteínas animales, principalmente pollo, res y cerdo.",
        "week": {
          "cost": 1,
          "quantity": 1,
          "ingredientsCount": 1,
          "percentage": 0.7
        },
        "month": {
          "cost": 1,
          "quantity": 1,
          "ingredientsCount": 1,
          "percentage": 0.7
        },
        "year": {
          "cost": 1293,
          "quantity": 211,
          "percentage": 35.7
        }
      },
      {
        "categoryId": 4,
        "categoryName": "Aceites",
        "description": "Grasas y aceites vegetales utilizados para freír, saltear o como parte de aderezos.",
        "week": {
          "cost": 0,
          "quantity": 0,
          "ingredientsCount": 0,
          "percentage": 0
        },
        "month": {
          "cost": 0,
          "quantity": 0,
          "ingredientsCount": 0,
          "percentage": 0
        },
        "year": {
          "cost": 400,
          "quantity": 40,
          "percentage": 11.1
        }
      }
    ],
    "totals": {
      "week": 142,
      "month": 142,
      "year": 3619.5
    }
  },
  "timestamp": "2025-11-06T01:09:35.917Z"
}
```

**Campos por Categoría:**

- `cost`: Costo total de compras de la categoría (S/.)
- `quantity`: Cantidad total comprada (en unidades variadas según el ingrediente)
- `ingredientsCount`: Número de ingredientes diferentes comprados de esa categoría
- `percentage`: Porcentaje del total de compras

**Nota**: Las categorías con 0 compras en el período actual también se incluyen si tienen compras históricas.

---

## Formato de Respuesta

Todas las respuestas siguen el mismo formato estándar:

### Respuesta Exitosa

```json
{
  "success": true,
  "message": "Mensaje descriptivo de la operación",
  "data": {
    /* Datos solicitados */
  },
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
const response = await fetch("/api/dashboard/stats");
const data = await response.json();

if (data.success) {
  console.log("Ventas del mes:", data.data.sales.month.total);
  console.log(
    "Margen de utilidad:",
    data.data.financial.profitMargin.month + "%",
  );
}

// Obtener tendencias con parámetros
const trends = await fetch("/api/dashboard/trends?period=7d&granularity=daily");
const trendsData = await trends.json();

// Obtener proyecciones
const projections = await fetch("/api/dashboard/projections?days=14");
const projectionsData = await projections.json();
```

### React Hook Ejemplo

```javascript
import { useState, useEffect } from "react";

function useDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/api/dashboard/stats")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStats(data.data);
        } else {
          setError(data.message);
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { stats, loading, error };
}
```

---

**Última actualización**: 5 de noviembre de 2025  
**Versión API**: 1.0  
**Base URL**: `/api/dashboard`
