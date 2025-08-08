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
import '../styles/ReporteMensual.css';
import { Link } from 'react-router-dom';

ChartJS.register(ArcElement, Tooltip, Legend);

const ReporteMensual = () => {
  const printRef = useRef();
  const [reporte, setReporte] = useState(null);

  const mesActual = new Date().toISOString().slice(0, 7); // YYYY-MM

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: 'Reporte Mensual - Bar Mezcal',
    pageStyle: `
      @page { size: auto; margin: 20mm; }
      @media print {
        body {
          -webkit-print-color-adjust: exact;
        }
      }
    `,
  });

  useEffect(() => {
    axios.get(`http://localhost:3000/api/reportes/mensual/${mesActual}`)
      .then(res => setReporte(res.data))
      .catch(err => console.error(err));
  }, [mesActual]);

  const totalMezcalLitros = reporte?.consumo_mezcal?.reduce(
    (acc, item) => acc + parseFloat(item.litros), 0
  ) || 0;

  const pieData = {
    labels: reporte?.consumo_mezcal?.map(m => m.tipo_mezcal),
    datasets: [{
      data: reporte?.consumo_mezcal?.map(m => parseFloat(m.litros)),
      backgroundColor: ['#edc6a6', '#b4dcc4', '#ffb6b6', '#b3cfff'],
    }]
  };

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

          <h1>Reporte Mensual</h1>

          {reporte && (
            <div className="main-layout">
              <div className="card total-ventas">
                <h3>Ventas Totales</h3>
                <p className="metric">${reporte.total_ventas.toLocaleString()}</p>
              </div>

              <div className="card chart-card">
                <h3>Consumo de mezcal</h3>
                <div style={{ width: '200px', margin: '0 auto' }}>
                  <Pie data={pieData} />
                </div>
                <div className="chart-total">
                  {totalMezcalLitros.toFixed(2)} L totales
                </div>
              </div>

              <div className="card montos-productos">
                <h3>Montos por producto</h3>
                <ul className="productos-lista">
                  {reporte.ventas_por_producto.map((prod, i) => (
                    <li key={i}>
                      {prod.nombre} <span>${parseFloat(prod.total).toLocaleString()}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="card metodo-pago">
                <h3>Ventas por método de pago</h3>
                {reporte.ventas_por_metodo.map((v, i) => (
                  <p key={i}>
                    {v.metodo_pago.charAt(0).toUpperCase() + v.metodo_pago.slice(1)}: ${parseFloat(v.total).toLocaleString()}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReporteMensual;
