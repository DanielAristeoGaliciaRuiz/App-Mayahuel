import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/Dashboard.css';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import { Link } from 'react-router-dom';

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const [reporte, setReporte] = useState(null);
  const [ventasDelDia, setVentasDelDia] = useState([]);

  const fechaHoy = new Date().toLocaleDateString('sv-SE');;

  const stockInicial = {
    Espadín: 2000.0,
    Tobalá: 1000.0
  };

  useEffect(() => {
    axios.get(`http://localhost:3000/api/reportes/diario/${fechaHoy}`)
      .then(res => setReporte(res.data))
      .catch(err => console.error('Error diario:', err));

    axios.get(`http://localhost:3000/api/ventas/fecha/${fechaHoy}`)
      .then(res => {
        console.log("✅ Ventas con detalle:", res.data);
        setVentasDelDia(res.data);
      })
      .catch(err => console.error('Error ventas del día:', err));
  }, [fechaHoy]);

  const calcularConsumoPorVenta = (venta) => {
    const consumo = { Espadín: 0, Tobalá: 0 };

    if (venta.detalle && Array.isArray(venta.detalle)) {
      venta.detalle.forEach((item) => {
        if (item.tipo_mezcal && item.cantidad_mezcal_usada) {
          const total = parseFloat(item.cantidad) * parseFloat(item.cantidad_mezcal_usada);
          consumo[item.tipo_mezcal] = (consumo[item.tipo_mezcal] || 0) + total;
        }
      });
    }

    return consumo;
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-wrapper">
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

        <main className="main-panel">
          <h1>Dashboard</h1>

          <div className="metrics">
            {reporte?.consumo_por_mezcal?.map((item, i) => (
              <div key={i} className="metric-box">
                <div className="label"><span className="color-box"></span>{item.tipo_mezcal}</div>
                <div className="value">{item.litros} L</div>
              </div>
            ))}
          </div>

          <div className="card">
            <h2>Consumo diario de mezcal</h2>
            <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap' }}>
              {reporte?.consumo_por_mezcal?.map((item, i) => {
                const tipo = item.tipo_mezcal;
                const consumido = parseFloat(item.litros);
                const restante = Math.max((stockInicial[tipo] || 0) - consumido, 0);

                const pieData = {
                  labels: ['Consumido', 'Restante'],
                  datasets: [{
                    data: [consumido, restante],
                    backgroundColor: ['#edc6a6', '#b4dcc4'],
                    borderWidth: 1
                  }]
                };

                return (
                  <div key={i} style={{ width: '220px', textAlign: 'center' }}>
                    <h4>{tipo}</h4>
                    <Pie data={pieData} />
                  </div>
                );
              })}
            </div>
          </div>

          <div className="card">
            <h2>Resumen por ticket</h2>
            {ventasDelDia.length > 0 ? (
              <table className="summary-table">
                <thead>
                  <tr>
                    <th>Folio</th>
                    <th>Espadín (L)</th>
                    <th>Tobalá (L)</th>
                    <th>Total venta ($)</th>
                  </tr>
                </thead>
                <tbody>
                  {ventasDelDia.map((venta, i) => {
                    const consumo = calcularConsumoPorVenta(venta);
                    return (
                      <tr key={i}>
                        <td>{venta.id_venta}</td>
                        <td>{(consumo.Espadín || 0).toFixed(2)}</td>
                        <td>{(consumo.Tobalá || 0).toFixed(2)}</td>
                        <td>${parseFloat(venta.total).toFixed(2)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <p>No hay ventas registradas hoy.</p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
