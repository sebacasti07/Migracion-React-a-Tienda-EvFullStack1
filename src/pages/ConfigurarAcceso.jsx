import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import CampoContraseña from "../components/CampoContraseña";

function ConfigurarAcceso() {
  const [password, setPassword] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const accesoInicialConfigurado = Boolean(localStorage.getItem("adminCredenciales"));

  if (accesoInicialConfigurado) {
    return <Navigate to="/login" replace />;
  }

  function configurarAcceso(event) {
    event.preventDefault();

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
    navigate("/login");
  }

  return (
    <div className="pagina-login">
      <h2>Configurar acceso inicial</h2>
      <p>Define una contraseña para la cuenta administrativa. Luego iniciarás sesión desde el formulario habitual.</p>

      <form onSubmit={configurarAcceso}>
        <div className="grupo-formulario">
          <label htmlFor="configurar-password">Contraseña</label>
          <CampoContraseña
            id="configurar-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Mínimo 8 caracteres"
            autoComplete="new-password"
            minLength={8}
            required
          />
        </div>

        <div className="grupo-formulario">
          <label htmlFor="confirmar-password-inicial">Confirmar contraseña</label>
          <CampoContraseña
            id="confirmar-password-inicial"
            value={confirmarPassword}
            onChange={(event) => setConfirmarPassword(event.target.value)}
            placeholder="Repite la contraseña"
            autoComplete="new-password"
            required
          />
        </div>

        {error && <p className="mensaje-error" role="alert">{error}</p>}
        <button type="submit">Guardar acceso</button>
      </form>

      <p className="nota-login">
        Esta configuración se guarda en este navegador y no ofrece seguridad de servidor.
      </p>
      <p className="nota-login"><Link to="/login">Volver a iniciar sesión</Link></p>
    </div>
  );
}

export default ConfigurarAcceso;
