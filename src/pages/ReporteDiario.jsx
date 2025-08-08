import React, { useRef, useEffect, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import '../styles/ReporteDiario.css';
import { Link } from 'react-router-dom';

ChartJS.register(ArcElement, Tooltip, Legend);

const ReporteDiario = () => {
  const printRef = useRef();
  const [ventas, setVentas] = useState([]);
  const stockInicial = { Espadín: 2000, Tobalá: 1000 };
  const fechaHoy = new Date().toLocaleDateString('sv-SE');

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: 'Reporte Diario - Bar Mezcal',
    pageStyle: `@page { margin: 20mm; } @media print { body { -webkit-print-color-adjust: exact; } }`,
  });

  useEffect(() => {
    axios.get(`http://localhost:3000/api/ventas/fecha/${fechaHoy}`)
      .then(res => setVentas(res.data))
      .catch(err => console.error(err));
  }, [fechaHoy]);

  const productosVendidos = {};
  let totalVentas = 0;
  let totalEfectivo = 0;
  let totalTarjeta = 0;
  let totalMezcal = { Espadín: 0, Tobalá: 0 };

  ventas.forEach(v => {
    totalVentas += parseFloat(v.total);
    if (v.metodo_pago === 'efectivo') totalEfectivo += parseFloat(v.total);
    else totalTarjeta += parseFloat(v.total);

    v.detalle.forEach(p => {
      productosVendidos[p.nombre] = (productosVendidos[p.nombre] || 0) + p.cantidad;
      if (p.tipo_mezcal && p.cantidad_mezcal_usada) {
        totalMezcal[p.tipo_mezcal] += p.cantidad * p.cantidad_mezcal_usada;
      }
    });
  });

  const topProductos = Object.entries(productosVendidos)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([nombre, cantidad]) => ({ nombre, cantidad }));

  const ticketPromedio = ventas.length ? totalVentas / ventas.length : 0;

  return (
    <div className="reporte-diario-wrapper">
      <div className="reporte-diario-content">
        <aside className="sidebar">
          <h2 className="logo">Bar Mezcal</h2>
          <nav className="menu">
            <ul>
              <li><Link to="/" className="nav-link">Dashboard</Link></li>
                     <li><Link to="/reporte-diario" className="nav-link">Reporte Diario</Link></li>
                          <li><Link to="/reporte-mensual" className="nav-link">Reporte Mensual</Link></li>
                          <li><Link to="/" className="nav-link">Inventario</Link></li>
            </ul>
          </nav>
        </aside>

        <div className="reporte-diario-container" ref={printRef}>
          <div className="print-button-container">
            <button onClick={handlePrint}>Imprimir PDF</button>
          </div>

          <h1>Reporte Diario</h1>

          <div className="top-metrics">
            <div className="card">
              <h3>Productos más vendidos</h3>
              <ul className="productos-lista">
                {topProductos.map((prod, i) => (
                  <li key={i}>{prod.nombre} <span>{prod.cantidad}</span></li>
                ))}
              </ul>
            </div>
            <div className="card metric">
              <h3>Ticket promedio</h3>
              <p>${ticketPromedio.toFixed(2)}</p>
            </div>
            <div className="card metric">
              <h3>Ventas en efectivo</h3>
              <p>${totalEfectivo.toFixed(2)}</p>
            </div>
            <div className="card metric">
              <h3>Ventas en tarjeta</h3>
              <p>${totalTarjeta.toFixed(2)}</p>
            </div>
          </div>

          <div className="card chart-card">
            <h3>Consumo de mezcal acumulado</h3>
            <div className="chart-multiple-pies">
              {['Tobalá', 'Espadín'].map((tipo, i) => {
                const consumido = totalMezcal[tipo];
                const restante = stockInicial[tipo] - consumido;
                const pieData = {
                  labels: ['Consumido', 'Restante'],
                  datasets: [{
                    data: [consumido, Math.max(restante, 0)],
                    backgroundColor: ['#edc6a6', '#b4dcc4'],
                  }]
                };
                return (
                  <div key={i} className="chart-pie-wrapper">
                    <h4>{tipo}</h4>
                    <Pie data={pieData} />
                  </div>
                );
              })}
            </div>
          </div>

          <div className="card tabla-tickets">
            <h2>Tickets del día</h2>
            <table>
              <thead>
  <tr>
    <th>Folio</th>
    <th>Concepto</th>
    <th>Cantidad</th>
    <th>Monto</th>
  </tr>
</thead>
<tbody>
  {ventas.map((v, i) => (
    <tr key={i}>
      <td>{v.id_venta}</td>
      <td colSpan={2}>
        <table style={{ width: '100%' }}>
          <tbody>
            {v.detalle.map((item, j) => (
              <tr key={j}>
                <td style={{ padding: '2px 6px' }}>{item.nombre}</td>
<td style={{ textAlign: 'center', padding: '2px 100px' }}>{item.cantidad}</td>

              </tr>
            ))}
          </tbody>
        </table>
      </td>
      <td>${parseFloat(v.total).toFixed(2)} ({v.metodo_pago})</td>
    </tr>
  ))}
</tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReporteDiario;

