import { useState } from "react";
import { Navigate } from "react-router-dom";
import CampoContraseña from "../components/CampoContraseña";

function CambiarPassword({ usuarios = [], guardarUsuarios }) {
  const [passwordActual, setPasswordActual] = useState("");
  const [nuevaPassword, setNuevaPassword] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");
  const [error, setError] = useState("");
  const [aviso, setAviso] = useState("");
  const nombreUsuario = sessionStorage.getItem("usuario");
  const cuenta = usuarios.find(
    (usuario) => usuario.usuario.toLowerCase() === nombreUsuario?.toLowerCase()
  );

  if (!nombreUsuario || sessionStorage.getItem("rol") === "admin" || !cuenta) {
    return <Navigate to="/login" replace />;
  }

  function cambiarPassword(event) {
    event.preventDefault();
    setError("");
    setAviso("");

    if (cuenta.password !== passwordActual) {
      setError("La contraseña actual es incorrecta.");
      return;
    }

    if (nuevaPassword.length < 8) {
      setError("La nueva contraseña debe tener al menos 8 caracteres.");
      return;
    }

    if (nuevaPassword !== confirmarPassword) {
      setError("Las contraseñas nuevas no coinciden.");
      return;
    }

    guardarUsuarios(
      usuarios.map((usuario) =>
        usuario.usuario === cuenta.usuario
          ? { ...usuario, password: nuevaPassword }
          : usuario
      )
    );
    setPasswordActual("");
    setNuevaPassword("");
    setConfirmarPassword("");
    setAviso("Tu contraseña se cambió correctamente.");
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

        <button type="submit">Guardar nueva contraseña</button>
      </form>

      <p className="nota-login">
        El cambio se guarda en este navegador y solo se puede usar aquí.
      </p>
    </div>
  );
}

export default CambiarPassword;
