import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CampoContraseña from "../components/CampoContraseña";
import { leerAlmacenamiento } from "../utils/almacenamiento";

function Login({ usuarios = [] }) {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const credencialesAdmin = leerAlmacenamiento("adminCredenciales", null);
  const accesoInicialConfigurado = Boolean(
    credencialesAdmin?.usuario && typeof credencialesAdmin.password === "string"
  );

  function iniciarSesion(event) {
    event.preventDefault();

    const nombreUsuario = usuario.trim();
    const esAdministrador = credencialesAdmin &&
      credencialesAdmin.usuario.toLowerCase() === nombreUsuario.toLowerCase() &&
      credencialesAdmin.password === password;
    const usuarioRegistrado = usuarios.some(
      (cuenta) =>
        cuenta.usuario.toLowerCase() === nombreUsuario.toLowerCase() &&
        cuenta.password === password
    );

    if (esAdministrador) {
      sessionStorage.setItem("usuario", nombreUsuario);
      sessionStorage.setItem("rol", "admin");
      navigate("/admin");
    } else if (usuarioRegistrado) {
      sessionStorage.setItem("usuario", nombreUsuario);
      sessionStorage.removeItem("rol");
      navigate("/carrito");
    } else {
      setError("Usuario o contraseña incorrectos.");
    }
  }

  return (
    <div className="pagina-login">
      <h2>Iniciar sesión</h2>

      <form onSubmit={iniciarSesion}>
        <div className="grupo-formulario">
          <label htmlFor="usuario">Usuario</label>
          <input
            id="usuario"
            type="text"
            value={usuario}
            onChange={(event) => setUsuario(event.target.value)}
            placeholder="Ingresa tu usuario"
            autoComplete="username"
            required
          />
        </div>

        <div className="grupo-formulario">
          <label htmlFor="password">Contraseña</label>
          <CampoContraseña
            id="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Ingresa tu contraseña"
            autoComplete="current-password"
            required
          />
        </div>

        {error && <p className="mensaje-error" role="alert">{error}</p>}

        <button type="submit">Ingresar</button>
      </form>

      {!accesoInicialConfigurado && (
        <p className="nota-login">
          <Link to="/configurar-acceso">Configurar acceso inicial</Link>
        </p>
      )}
      <p className="nota-login">
        La autenticación de esta demostración se guarda solo en este navegador.
      </p>
    </div>
  );
}

export default Login;
