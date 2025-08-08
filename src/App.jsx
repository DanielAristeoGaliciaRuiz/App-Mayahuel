import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import ReporteDiario from "./pages/ReporteDiario";
import ReporteMensual from "./pages/ReporteMensual";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/reporte-diario" element={<ReporteDiario />} /> 
        <Route path="/reporte-mensual" element={<ReporteMensual />} />        
        </Routes>
    </BrowserRouter>
  );
}

export default App;