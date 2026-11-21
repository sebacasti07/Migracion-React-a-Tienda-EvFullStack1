import { useState } from "react";
import { correoPermitido } from "../utils/validaciones";

const vacio = { nombre: "", correo: "", mensaje: "" };

// Valida los campos del formulario de contacto (RF-006).
// eslint-disable-next-line react-refresh/only-export-components
export function validarContacto({ nombre, correo, mensaje }) {
  const errores = {};
  if (!nombre.trim()) errores.nombre = "Ingresa tu nombre.";
  else if (nombre.trim().length > 100) errores.nombre = "El nombre puede tener máximo 100 caracteres.";
  if (!correoPermitido(correo)) errores.correo = "Usa un correo @duoc.cl, @profesor.duoc.cl o @gmail.com.";
  if (!mensaje.trim()) errores.mensaje = "Escribe tu mensaje.";
  else if (mensaje.trim().length > 500) errores.mensaje = "El mensaje puede tener máximo 500 caracteres.";
  return errores;
}

// Formulario de contacto (RF-006): valida nombre (máx. 100), correo permitido y mensaje (máx. 500).
function FormularioContacto() {
  const [form, setForm] = useState(vacio);
  const [errores, setErrores] = useState({});
  const [enviado, setEnviado] = useState(false);

  function cambiar(campo, valor) {
    setForm((actual) => ({ ...actual, [campo]: valor }));
    setEnviado(false);
  }

  function enviar(event) {
    event.preventDefault();
    const encontrados = validarContacto(form);
    setErrores(encontrados);
    if (Object.keys(encontrados).length > 0) return;
    setForm(vacio);
    setEnviado(true);
  }

  return (
    <form id="formularioContacto" className="formulario-contacto" onSubmit={enviar} noValidate>
      <h3>Escríbenos</h3>
      <label htmlFor="nombreContacto">Nombre</label>
      <input id="nombreContacto" name="nombreContacto" maxLength={100} value={form.nombre}
        onChange={(e) => cambiar("nombre", e.target.value)} aria-invalid={Boolean(errores.nombre)} required />
      <span id="errorNombreContacto" className="mensaje-error">{errores.nombre}</span>

      <label htmlFor="correoContacto">Correo</label>
      <input id="correoContacto" name="correoContacto" type="email" value={form.correo}
        onChange={(e) => cambiar("correo", e.target.value)} aria-invalid={Boolean(errores.correo)} required />
      <span id="errorCorreoContacto" className="mensaje-error">{errores.correo}</span>

      <label htmlFor="mensajeContacto">Mensaje</label>
      <textarea id="mensajeContacto" name="mensajeContacto" maxLength={500} value={form.mensaje}
        onChange={(e) => cambiar("mensaje", e.target.value)} aria-invalid={Boolean(errores.mensaje)} required />
      <span id="errorMensajeContacto" className="mensaje-error">{errores.mensaje}</span>
      <small className="text-secondary d-block mb-2">{form.mensaje.length}/500 caracteres</small>

      <button type="submit">Enviar mensaje</button>
      <p id="mensajeContactoExitoso" className="mensaje-exito" role="status">
        {enviado ? "¡Gracias! Recibimos tu mensaje y te responderemos pronto." : ""}
      </p>
    </form>
  );
}

export default FormularioContacto;
