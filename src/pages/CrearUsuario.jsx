import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CampoContraseña from "../components/CampoContraseña";
import regionesComunas from "../data/regionesComunas";

function CrearUsuario({ usuarios = [], guardarUsuarios }) {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [region, setRegion] = useState("");
  const [direccion, setDireccion] = useState("");
  const [comuna, setComuna] = useState("");
  const [error, setError] = useState("");
  const comunasDisponibles = regionesComunas.find((item) => item.region === region)?.comunas ?? [];
  const navigate = useNavigate();

  function crearUsuario(e) {
    e.preventDefault();

    const nombreUsuario = usuario.trim();
    if (!nombreUsuario) {
      setError("Ingresa un nombre de usuario.");
      return;
    }

    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
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

    if (!comunasDisponibles.includes(comuna)) {
      setError("Comuna");
      return;
    }

    guardarUsuarios([
      ...usuarios,
      {
        usuario: nombreUsuario,
        password,
        fechaNacimiento,
        region: region.trim(),
        direccion: direccion.trim(),
        comuna: comuna.trim()
      }
    ]);
    sessionStorage.setItem("usuario", nombreUsuario);
    sessionStorage.removeItem("rol");
    navigate("/");
  }

  return (
    <div className="pagina-registro">
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
          <label htmlFor="fecha-nacimiento">Fecha de nacimiento</label>
          <input
            id="fecha-nacimiento"
            type="date"
            value={fechaNacimiento}
            onChange={(e) => setFechaNacimiento(e.target.value)}
            autoComplete="bday"
            required
          />
        </div>

        <div className="grupo-formulario">
          <label htmlFor="region">Región</label>
          <select
            id="region"
            value={region}
            onChange={(e) => {
              setRegion(e.target.value);
              setComuna("");
            }}
            autoComplete="address-level1"
            required
          >
            <option value="">Selecciona una región</option>
            {regionesComunas.map((item) => (
              <option key={item.region} value={item.region}>{item.region}</option>
            ))}
          </select>
        </div>

        <div className="grupo-formulario">
          <label htmlFor="comuna">Comuna</label>
          <select
            id="comuna"
            value={comuna}
            onChange={(e) => setComuna(e.target.value)}
            autoComplete="address-level2"
            disabled={!region}
            required
          >
            <option value="">
              {region ? "Selecciona una comuna" : "Primero selecciona una región"}
            </option>
            {comunasDisponibles.map((nombreComuna) => (
              <option key={nombreComuna} value={nombreComuna}>{nombreComuna}</option>
            ))}
          </select>
        </div>

        <div className="grupo-formulario">
          <label htmlFor="direccion">Dirección</label>
          <input
            id="direccion"
            type="text"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
            autoComplete="street-address"
            required
          />
        </div>

        <div className="grupo-formulario">
          <label htmlFor="nueva-password">Contraseña</label>
          <CampoContraseña
            id="nueva-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mínimo 8 caracteres"
            autoComplete="new-password"
            minLength={8}
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
