import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import CampoContraseña from "../components/CampoContraseña";
import { useAuth } from "../context/AuthContext";
import { mensajeError } from "../api/cliente";
import { rutaInicialPorRol } from "../utils/permisos";

// Flujo: el formulario envía correo y contraseña a POST /api/v1/auth/login.
// El backend responde con el JWT, el refresh token y los datos del usuario (con su rol).
// AuthContext guarda la sesión y se redirige según el rol.
function Login() {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);
  const { iniciarSesion, autenticado, rol } = useAuth();
  const navigate = useNavigate();
  const ubicacion = useLocation();

  if (autenticado && !enviando) {
    return <Navigate to={rutaInicialPorRol(rol)} replace />;
  }

  async function enviar(event) {
    event.preventDefault();
    setError("");

    if (!correo.trim() || !password) {
      setError("Ingresa tu correo y contraseña.");
      return;
    }

    setEnviando(true);
    try {
      const usuario = await iniciarSesion(correo.trim(), password);
      // Si venía de una página protegida (ej: el carrito) se vuelve ahí
      const destino = ubicacion.state?.desde;
      navigate(destino && usuario.rol !== "VENDEDOR" ? destino : rutaInicialPorRol(usuario.rol), { replace: true });
    } catch (e) {
      setError(mensajeError(e, "Correo o contraseña incorrectos."));
      setEnviando(false);
    }
  }

  return (
    <div className="pagina-login">
      <h2>Iniciar sesión</h2>

      <form onSubmit={enviar} noValidate>
        <div className="grupo-formulario">
          <label htmlFor="correo">Correo</label>
          <input
            id="correo"
            type="email"
            value={correo}
            onChange={(event) => setCorreo(event.target.value)}
            placeholder="tucorreo@duoc.cl"
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

        <button type="submit" disabled={enviando}>
          {enviando ? "Ingresando..." : "Ingresar"}
        </button>
      </form>

      <p className="nota-login">
        ¿No tienes cuenta? <Link to="/registro">Crear usuario</Link>
      </p>
      <p className="nota-login">
        Cuentas de prueba: admin@duoc.cl / Admin1234@ · vendedor@duoc.cl / Vendedor123@ ·
        cliente@gmail.com / Cliente123@
      </p>
    </div>
  );
}

export default Login;
