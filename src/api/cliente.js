import axios from "axios";
import { actualizarTokens, leerSesion, limpiarSesion } from "../utils/sesion";

// ==========================================
// CLIENTE HTTP (AXIOS) HACIA EL BACKEND
// ==========================================
// URL base de la API. Se puede cambiar con la variable VITE_API_URL en un archivo .env
export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api/v1";

export const EVENTO_SESION_EXPIRADA = "sesion-expirada";

const cliente = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: { "Content-Type": "application/json" }
});

// 1) Antes de cada petición se agrega el token JWT en el header Authorization
cliente.interceptors.request.use((config) => {
  const sesion = leerSesion();
  if (sesion?.token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${sesion.token}`;
  }
  return config;
});

// 2) Si el backend responde 401 (token vencido), se intenta renovar UNA vez con el
//    refresh token y se repite la petición original. Si la renovación falla, se cierra la sesión.
let renovacionEnCurso = null;

async function renovarToken() {
  const sesion = leerSesion();
  if (!sesion?.refreshToken) throw new Error("Sin refresh token");
  // Se usa axios directo para que esta petición no pase por los interceptores
  const { data } = await axios.post(`${API_URL}/auth/refresh`, {
    refreshToken: sesion.refreshToken
  });
  actualizarTokens(data.token, data.refreshToken, data.usuario);
  return data.token;
}

cliente.interceptors.response.use(
  (respuesta) => respuesta,
  async (error) => {
    const original = error.config;
    const esAuth = original?.url?.includes("/auth/login") || original?.url?.includes("/auth/refresh");

    if (error.response?.status === 401 && original && !original._reintento && !esAuth && leerSesion()) {
      original._reintento = true;
      try {
        // Si varias peticiones fallan a la vez, todas esperan la misma renovación
        renovacionEnCurso = renovacionEnCurso || renovarToken();
        const nuevoToken = await renovacionEnCurso;
        original.headers.Authorization = `Bearer ${nuevoToken}`;
        return cliente(original);
      } catch {
        limpiarSesion();
        window.dispatchEvent(new Event(EVENTO_SESION_EXPIRADA));
      } finally {
        renovacionEnCurso = null;
      }
    }
    return Promise.reject(error);
  }
);

// Convierte cualquier error de axios en un mensaje legible para mostrar en pantalla
export function mensajeError(error, porDefecto = "Ocurrió un error inesperado.") {
  if (!error?.response) {
    return "No se pudo conectar con el servidor. Revisa que el backend esté encendido.";
  }
  return error.response.data?.error || porDefecto;
}

export default cliente;
