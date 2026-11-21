import { useState } from "react";
import CampoContraseña from "../components/CampoContraseña";
import { authApi } from "../api/servicios";
import { mensajeError } from "../api/cliente";

// Envía PUT /api/v1/auth/password con el token del usuario conectado.
// El backend compara la contraseña actual con el hash BCrypt antes de cambiarla.
function CambiarPassword() {
  const [passwordActual, setPasswordActual] = useState("");
  const [nuevaPassword, setNuevaPassword] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");
  const [error, setError] = useState("");
  const [aviso, setAviso] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function cambiarPassword(event) {
    event.preventDefault();
    setError("");
    setAviso("");

    if (nuevaPassword.length < 8) {
      setError("La nueva contraseña debe tener al menos 8 caracteres.");
      return;
    }

    if (nuevaPassword !== confirmarPassword) {
      setError("Las contraseñas nuevas no coinciden.");
      return;
    }

    setEnviando(true);
    try {
      await authApi.cambiarPassword(passwordActual, nuevaPassword);
      setPasswordActual("");
      setNuevaPassword("");
      setConfirmarPassword("");
      setAviso("Tu contraseña se cambió correctamente.");
    } catch (e) {
      setError(mensajeError(e, "No se pudo cambiar la contraseña."));
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="pagina-registro">
      <h2>Cambiar contraseña</h2>

      <form onSubmit={cambiarPassword}>
        <div className="grupo-formulario">
          <label htmlFor="password-actual">Contraseña actual</label>
          <CampoContraseña
            id="password-actual"
            value={passwordActual}
            onChange={(event) => setPasswordActual(event.target.value)}
            autoComplete="current-password"
            required
          />
        </div>

        <div className="grupo-formulario">
          <label htmlFor="password-nueva">Nueva contraseña</label>
          <CampoContraseña
            id="password-nueva"
            value={nuevaPassword}
            onChange={(event) => setNuevaPassword(event.target.value)}
            autoComplete="new-password"
            minLength={8}
            required
          />
        </div>

        <div className="grupo-formulario">
          <label htmlFor="password-confirmar">Confirmar nueva contraseña</label>
          <CampoContraseña
            id="password-confirmar"
            value={confirmarPassword}
            onChange={(event) => setConfirmarPassword(event.target.value)}
            autoComplete="new-password"
            minLength={8}
            required
          />
        </div>

        {error && <p className="mensaje-error" role="alert">{error}</p>}
        {aviso && <p className="mensaje-exito" role="status">{aviso}</p>}

        <button type="submit" disabled={enviando}>Guardar nueva contraseña</button>
      </form>
    </div>
  );
}

export default CambiarPassword;
