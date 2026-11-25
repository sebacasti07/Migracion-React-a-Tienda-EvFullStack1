import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CampoContraseña from "../components/CampoContraseña";
import regionesComunas from "../data/regionesComunas";
import { useAuth } from "../context/AuthContext";
import { mensajeError } from "../api/cliente";
import { correoPermitido, normalizarRun, runValido } from "../utils/validaciones";

const formularioVacio = {
  run: "",
  nombre: "",
  apellidos: "",
  correo: "",
  fechaNacimiento: "",
  region: "",
  comuna: "",
  direccion: "",
  password: "",
  confirmarPassword: ""
};

// Registro de clientes (RF-001). Envía los datos a POST /api/v1/auth/registro,
// el backend crea la cuenta con rol CLIENTE y devuelve los tokens (queda con sesión iniciada).
function CrearUsuario() {
  const [form, setForm] = useState(formularioVacio);
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);
  const { registrarse } = useAuth();
  const navigate = useNavigate();
  const comunasDisponibles = regionesComunas.find((item) => item.region === form.region)?.comunas ?? [];

  function cambiar(campo, valor) {
    setForm((actual) => ({ ...actual, [campo]: valor }));
  }

  function validar() {
    if (!runValido(form.run)) return "El RUN no es válido (ej: 201234565, sin puntos ni guion).";
    if (!form.nombre.trim() || !form.apellidos.trim()) return "Ingresa tu nombre y apellidos.";
    if (!correoPermitido(form.correo)) return "Solo se permiten correos @duoc.cl, @duocuc.cl, @profesor.duoc.cl o @gmail.com.";
    if (!form.region || !comunasDisponibles.includes(form.comuna)) return "Selecciona tu región y comuna.";
    if (!form.direccion.trim()) return "Ingresa tu dirección.";
    if (form.password.length < 8) return "La contraseña debe tener al menos 8 caracteres.";
    if (form.password !== form.confirmarPassword) return "Las contraseñas no coinciden.";
    return "";
  }

  async function crearUsuario(e) {
    e.preventDefault();
    const problema = validar();
    if (problema) {
      setError(problema);
      return;
    }

    setEnviando(true);
    setError("");
    try {
      await registrarse({
        run: normalizarRun(form.run),
        nombre: form.nombre.trim(),
        apellidos: form.apellidos.trim(),
        correo: form.correo.trim().toLowerCase(),
        password: form.password,
        fechaNacimiento: form.fechaNacimiento || null,
        region: form.region,
        comuna: form.comuna,
        direccion: form.direccion.trim()
      });
      navigate("/productos");
    } catch (err) {
      setError(mensajeError(err, "No se pudo crear la cuenta."));
      setEnviando(false);
    }
  }

  return (
    <div className="pagina-registro">
      <h2>Crear usuario</h2>

      <form onSubmit={crearUsuario} noValidate>
        <div className="grupo-formulario">
          <label htmlFor="run">RUN</label>
          <input
            id="run"
            value={form.run}
            onChange={(e) => cambiar("run", e.target.value)}
            placeholder="201234565"
            maxLength={12}
            required
          />
        </div>

        <div className="grupo-formulario">
          <label htmlFor="nombre">Nombre</label>
          <input id="nombre" value={form.nombre} onChange={(e) => cambiar("nombre", e.target.value)}
            maxLength={50} autoComplete="given-name" required />
        </div>

        <div className="grupo-formulario">
          <label htmlFor="apellidos">Apellidos</label>
          <input id="apellidos" value={form.apellidos} onChange={(e) => cambiar("apellidos", e.target.value)}
            maxLength={100} autoComplete="family-name" required />
        </div>

        <div className="grupo-formulario">
          <label htmlFor="correo-registro">Correo</label>
          <input id="correo-registro" type="email" value={form.correo}
            onChange={(e) => cambiar("correo", e.target.value)} placeholder="tucorreo@gmail.com"
            maxLength={100} autoComplete="email" required />
        </div>

        <div className="grupo-formulario">
          <label htmlFor="fecha-nacimiento">Fecha de nacimiento</label>
          <input id="fecha-nacimiento" type="date" value={form.fechaNacimiento}
            onChange={(e) => cambiar("fechaNacimiento", e.target.value)} autoComplete="bday" />
        </div>

        <div className="grupo-formulario">
          <label htmlFor="region">Región</label>
          <select
            id="region"
            value={form.region}
            onChange={(e) => setForm((actual) => ({ ...actual, region: e.target.value, comuna: "" }))}
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
            value={form.comuna}
            onChange={(e) => cambiar("comuna", e.target.value)}
            autoComplete="address-level2"
            disabled={!form.region}
            required
          >
            <option value="">
              {form.region ? "Selecciona una comuna" : "Primero selecciona una región"}
            </option>
            {comunasDisponibles.map((nombreComuna) => (
              <option key={nombreComuna} value={nombreComuna}>{nombreComuna}</option>
            ))}
          </select>
        </div>

        <div className="grupo-formulario">
          <label htmlFor="direccion">Dirección</label>
          <input id="direccion" value={form.direccion} onChange={(e) => cambiar("direccion", e.target.value)}
            maxLength={300} autoComplete="street-address" required />
        </div>

        <div className="grupo-formulario">
          <label htmlFor="nueva-password">Contraseña</label>
          <CampoContraseña
            id="nueva-password"
            value={form.password}
            onChange={(e) => cambiar("password", e.target.value)}
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
            value={form.confirmarPassword}
            onChange={(e) => cambiar("confirmarPassword", e.target.value)}
            placeholder="Repite la contraseña"
            autoComplete="new-password"
            required
          />
        </div>

        {error && <p className="mensaje-error" role="alert">{error}</p>}

        <button type="submit" disabled={enviando}>{enviando ? "Creando..." : "Crear cuenta"}</button>
      </form>

      <p className="nota-login">
        ¿Ya tienes cuenta? <Link to="/login">Iniciar sesión</Link>
      </p>
    </div>
  );
}

export default CrearUsuario;
