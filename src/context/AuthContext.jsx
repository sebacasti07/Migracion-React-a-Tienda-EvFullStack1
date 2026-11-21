import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { authApi } from "../api/servicios";
import { EVENTO_SESION_EXPIRADA } from "../api/cliente";
import { guardarSesion, leerSesion, limpiarSesion, tiempoRestante, tokenVigente } from "../utils/sesion";
import { tienePermiso } from "../utils/permisos";

// ==========================================
// CONTEXTO DE AUTENTICACIÓN
// ==========================================
// Mantiene en un solo lugar quién está conectado y con qué rol.
// Cualquier componente puede usarlo con el hook useAuth().
//
// Flujo al recargar la página:
// 1. Se lee la sesión guardada en localStorage.
// 2. Si el refresh token ya expiró, se descarta la sesión.
// 3. Si sigue vigente, se consulta GET /auth/me para confirmar con el backend que
//    el usuario existe y obtener su rol actual (si el token de acceso venció, el
//    interceptor de axios lo renueva solo).

const AuthContext = createContext(null);

function sesionInicial() {
  const sesion = leerSesion();
  if (!sesion || !tokenVigente(sesion.refreshToken)) {
    limpiarSesion();
    return null;
  }
  return sesion;
}

export function AuthProvider({ children }) {
  const [sesion, setSesion] = useState(sesionInicial);
  const [verificando, setVerificando] = useState(() => Boolean(sesionInicial()));

  const cerrarSesion = useCallback(() => {
    limpiarSesion();
    setSesion(null);
  }, []);

  // Al cargar la app se confirma la sesión con el backend
  // (si no había sesión guardada, "verificando" ya parte en false)
  useEffect(() => {
    if (!leerSesion()) return undefined;
    let activo = true;
    authApi
      .perfil()
      .then((usuario) => {
        if (!activo) return;
        const actual = leerSesion();
        if (actual) {
          guardarSesion({ ...actual, usuario });
          setSesion({ ...actual, usuario });
        }
      })
      .catch((error) => {
        // Si el backend rechaza el token se cierra la sesión.
        // Si el servidor está apagado se conserva la sesión local.
        if (activo && error.response) cerrarSesion();
      })
      .finally(() => activo && setVerificando(false));
    return () => {
      activo = false;
    };
  }, [cerrarSesion]);

  // Si el interceptor no pudo renovar el token, se cierra la sesión en toda la app
  useEffect(() => {
    const alExpirar = () => setSesion(null);
    window.addEventListener(EVENTO_SESION_EXPIRADA, alExpirar);
    return () => window.removeEventListener(EVENTO_SESION_EXPIRADA, alExpirar);
  }, []);

  // Sincroniza la sesión entre pestañas (si cierras sesión en una, se cierra en todas)
  useEffect(() => {
    const alCambiar = (evento) => {
      if (evento.key === null || evento.key === "sesionTienda") setSesion(leerSesion());
    };
    window.addEventListener("storage", alCambiar);
    return () => window.removeEventListener("storage", alCambiar);
  }, []);

  // Cierre automático cuando vence el refresh token (la sesión ya no se puede renovar)
  useEffect(() => {
    if (!sesion?.refreshToken) return undefined;
    const temporizador = setTimeout(cerrarSesion, tiempoRestante(sesion.refreshToken));
    return () => clearTimeout(temporizador);
  }, [sesion?.refreshToken, cerrarSesion]);

  const iniciarSesion = useCallback(async (correo, password) => {
    const respuesta = await authApi.login(correo, password);
    guardarSesion(respuesta);
    setSesion(leerSesion());
    return respuesta.usuario;
  }, []);

  const registrarse = useCallback(async (datos) => {
    const respuesta = await authApi.registro(datos);
    guardarSesion(respuesta);
    setSesion(leerSesion());
    return respuesta.usuario;
  }, []);

  const valor = useMemo(() => {
    const usuario = sesion?.usuario ?? null;
    return {
      usuario,
      rol: usuario?.rol ?? null,
      autenticado: Boolean(usuario),
      verificando,
      iniciarSesion,
      registrarse,
      cerrarSesion,
      puede: (permiso) => tienePermiso(usuario?.rol, permiso)
    };
  }, [sesion, verificando, iniciarSesion, registrarse, cerrarSesion]);

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const contexto = useContext(AuthContext);
  if (!contexto) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return contexto;
}

export default AuthContext;
