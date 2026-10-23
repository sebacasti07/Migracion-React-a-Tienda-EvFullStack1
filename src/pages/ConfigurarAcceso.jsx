import { Link } from "react-router-dom";

function ConfigurarAcceso() {
  return (
    <div className="pagina-login">
      <h2>Acceso de administrador</h2>
      <p>Usuario: <strong>Admin</strong></p>
      <p>Contraseña: <strong>Admin1234@</strong></p>
      <Link to="/login">Ir a iniciar sesión</Link>
    </div>
  );
}

export default ConfigurarAcceso;
