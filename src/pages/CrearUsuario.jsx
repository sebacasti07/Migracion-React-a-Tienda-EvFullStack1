import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CampoContraseña from "../components/CampoContraseña";

function CrearUsuario({ usuarios = [], guardarUsuarios }) {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function crearUsuario(e) {
    e.preventDefault();

    const nombreUsuario = usuario.trim();
    if (!nombreUsuario) {
      setError("Ingresa un nombre de usuario.");
      return;
    }

    if (password.length < 4) {
      setError("La contraseña debe tener al menos 4 caracteres.");
      return;
    }

    if (password !== confirmarPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    const usuarioExiste = usuarios.some(
      (cuenta) => cuenta.usuario.toLowerCase() === nombreUsuario.toLowerCase()
    );

    if (usuarioExiste || nombreUsuario.toLowerCase() === "admin") {
      setError("Ese nombre de usuario ya está registrado.");
      return;
    }

    guardarUsuarios([...usuarios, { usuario: nombreUsuario, password }]);
    sessionStorage.setItem("usuario", nombreUsuario);
    sessionStorage.removeItem("rol");
    navigate("/");
  }

  return (
    <div className="pagina-login">
      <h2>Crear usuario</h2>

      <form onSubmit={crearUsuario}>
        <div className="grupo-formulario">
          <label htmlFor="nuevo-usuario">Usuario</label>
          <input
            id="nuevo-usuario"
            type="text"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            placeholder="Elige un nombre de usuario"
            autoComplete="username"
            required
          />
        </div>

        <div className="grupo-formulario">
          <label htmlFor="nueva-password">Contraseña</label>
          <CampoContraseña
            id="nueva-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mínimo 4 caracteres"
            autoComplete="new-password"
            minLength={4}
            required
          />
        </div>

        <div className="grupo-formulario">
          <label htmlFor="confirmar-password">Confirmar contraseña</label>
          <CampoContraseña
            id="confirmar-password"
            value={confirmarPassword}
            onChange={(e) => setConfirmarPassword(e.target.value)}
            placeholder="Repite la contraseña"
            autoComplete="new-password"
            required
          />
        </div>

        {error && <p className="mensaje-error" role="alert">{error}</p>}

        <button type="submit">Crear cuenta</button>
      </form>

      <p className="nota-login">
        Este registro de demostración guarda la cuenta solo en este navegador.
      </p>
      <p className="nota-login">
        ¿Ya tienes cuenta? <Link to="/login">Iniciar sesión</Link>
      </p>
    </div>
  );
}

export default CrearUsuario;
