import "../styles/Sidebar.css";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <nav>
        <ul>
          <li>
            <NavLink to="/" className={({ isActive }) => isActive ? "active" : ""}>
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink to="/reporte" className={({ isActive }) => isActive ? "active" : ""}>
              Reporte Diario
            </NavLink>
          </li>
          <li>
            <NavLink to="/productos" className={({ isActive }) => isActive ? "active" : ""}>
              Productos
            </NavLink>
          </li>
          <li>
            <NavLink to="/inventario" className={({ isActive }) => isActive ? "active" : ""}>
              Inventario
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
