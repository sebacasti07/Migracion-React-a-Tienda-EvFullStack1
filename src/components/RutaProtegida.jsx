import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Cargando from "./Cargando";

// ==========================================
// RUTA PROTEGIDA
// ==========================================
// Envuelve una página y solo la muestra si:
//  - hay una sesión iniciada, y
//  - el rol del usuario está dentro de "roles" (si se indica).
// Si no hay sesión, manda al login y recuerda a qué página quería ir.
// Si hay sesión pero el rol no corresponde, muestra "acceso denegado".

function RutaProtegida({ roles, children }) {
  const { autenticado, rol, verificando } = useAuth();
  const ubicacion = useLocation();

  if (verificando) {
    return <Cargando texto="Verificando sesión..." />;
  }

  if (!autenticado) {
    return <Navigate to="/login" replace state={{ desde: ubicacion.pathname }} />;
  }

  if (roles && !roles.includes(rol)) {
    return <Navigate to="/acceso-denegado" replace />;
  }

  return children;
}

export default RutaProtegida;
