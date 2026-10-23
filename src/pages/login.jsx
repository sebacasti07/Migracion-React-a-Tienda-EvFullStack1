import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CampoContraseña from "../components/CampoContraseña";

function Login({ usuarios = [] }) {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");
  const [adminConfigurado, setAdminConfigurado] = useState(() =>
    Boolean(localStorage.getItem("adminCredenciales"))
  );
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function iniciarSesion(e) {
    e.preventDefault();

    const nombreUsuario = usuario.trim().toLowerCase();
    if (!adminConfigurado) {
      if (password.length < 8) {
        setError("La contraseña debe tener al menos 8 caracteres.");
        return;
      }
      if (password !== confirmarPassword) {
        setError("Las contraseñas no coinciden.");
        return;
      }

      localStorage.setItem(
        "adminCredenciales",
        JSON.stringify({ usuario: "admin", password })
      );
      setAdminConfigurado(true);
      sessionStorage.setItem("usuario", "admin");
      sessionStorage.setItem("rol", "admin");
      navigate("/admin");
      return;
    }

    const credencialesAdmin = JSON.parse(
      localStorage.getItem("adminCredenciales") || "null"
    );
    const usuarioRegistrado = usuarios.some(
      (cuenta) =>
        cuenta.usuario.toLowerCase() === nombreUsuario &&
        cuenta.password === password
    );

    if (
      credencialesAdmin &&
      nombreUsuario === credencialesAdmin.usuario &&
      password === credencialesAdmin.password
    ) {
      sessionStorage.setItem("usuario", "admin");
      sessionStorage.setItem("rol", "admin");
      navigate("/admin");
    } else if (usuarioRegistrado) {
      sessionStorage.setItem("usuario", usuario.trim());
      sessionStorage.removeItem("rol");
      navigate("/carrito");
    } else {
      setError("Usuario o contraseña incorrectos");
    }
  }

  return (
    <div className="pagina-login">

      <h2>Iniciar sesión</h2>

      <form onSubmit={iniciarSesion}>

        {!adminConfigurado ? (
          <>
            <p>Configura el administrador inicial para este navegador.</p>
            <p>Nombre de usuario: <strong>admin</strong></p>
          </>
        ) : (
          <div className="grupo-formulario">
            <label htmlFor="usuario">Usuario</label>
            <input
              id="usuario"
              type="text"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              placeholder="Ingresa tu usuario"
              autoComplete="username"
              required
            />
          </div>
        )}

        <div className="grupo-formulario">
          <label htmlFor="password">Contraseña</label>
          <CampoContraseña
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={adminConfigurado ? "Ingresa tu contraseña" : "Crea una contraseña segura"}
            autoComplete={adminConfigurado ? "current-password" : "new-password"}
            minLength={adminConfigurado ? undefined : 8}
            required
          />
        </div>

        {!adminConfigurado && (
          <div className="grupo-formulario">
            <label htmlFor="confirmar-password-admin">Confirmar contraseña</label>
            <CampoContraseña
              id="confirmar-password-admin"
              value={confirmarPassword}
              onChange={(e) => setConfirmarPassword(e.target.value)}
              placeholder="Repite la contraseña"
              autoComplete="new-password"
              required
            />
          </div>
        )}

        {error && (
          <p className="mensaje-error" role="alert">{error}</p>
        )}

        <button type="submit">
          {adminConfigurado ? "Ingresar" : "Configurar administrador"}
        </button>

      </form>

      <p className="nota-login">
        La configuración se guarda solo en este navegador. Esta demostración no
        proporciona autenticación segura para producción.
      </p>

    </div>
  );
}

export default Login;
