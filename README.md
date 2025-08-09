# Mayahuel — Control de Mezcal y Reportes

Aplicación para **controlar ventas por comanda** y **medir consumo de mezcales** en bar. Genera **reportes diarios y mensuales** (tickets vendidos, métodos de pago, productos más vendidos, consumo por categoría, etc.).

> Cliente: **Mezcalería Mayahuel**

---

## Objetivo
Centralizar la información de **comandas**, **productos** y **movimientos de inventario** para obtener indicadores claros del negocio y reducir mermas.

---

## Funcionalidades clave
- **Comandas y ventas**
  - Alta de comandas (folio, mesa, mesero/a, apertura/cierre).
  - Detalle de productos por comanda (cantidad, precio, importe).
  - **Método de pago** por ticket: efectivo / tarjeta.
- **Reportes**
  - **Diario**: total de tickets, ventas del día, **ticket promedio**, desglose por método de pago, **Top 5** productos, lista de tickets con **desglose de productos**.
  - **Mensual**: ventas acumuladas, tendencia por día, participación por categoría, top productos, comparativo contra mes anterior.
  - Exportación a **Excel/PDF/CSV**.
- **Inventario de mezcal**
  - Existencias iniciales, **entradas/salidas/ajustes**.
  - Consumo estimado por ventas (ml por porción × cantidad).
  - Alertas por **stock bajo**.
- **Dashboards** (diario y mensual) con filtros por rango de fechas y categoría.

---

##  Arquitectura (sugerida)
- **Frontend**: React + Vite  
- **Backend**: Node.js + Express  
- **DB**: PostgreSQL

