// ==========================================
// GESTIÓN DE LA SESIÓN EN EL NAVEGADOR
// ==========================================
// Guardamos en localStorage el token de acceso, el refresh token y los datos
// básicos del usuario. Así la sesión sigue activa si se recarga la página.
// La seguridad real la pone el backend: cada petición se valida con el JWT,
// así que aunque alguien cambie el rol a mano en localStorage, la API lo rechaza.

const CLAVE_SESION = "sesionTienda";

export function guardarSesion({ token, refreshToken, usuario }) {
  localStorage.setItem(CLAVE_SESION, JSON.stringify({ token, refreshToken, usuario }));
}

export function leerSesion() {
  try {
    const sesion = JSON.parse(localStorage.getItem(CLAVE_SESION) || "null");
    if (!sesion?.token || !sesion?.refreshToken || !sesion?.usuario) return null;
    return sesion;
  } catch {
    return null;
  }
}

export function limpiarSesion() {
  localStorage.removeItem(CLAVE_SESION);
}

export function actualizarTokens(token, refreshToken, usuario) {
  const actual = leerSesion();
  guardarSesion({
    token,
    refreshToken: refreshToken ?? actual?.refreshToken,
    usuario: usuario ?? actual?.usuario
  });
}

// Lee el contenido (payload) de un JWT sin verificar la firma.
// Solo se usa para saber cuándo expira; la verificación la hace el backend.
export function leerPayloadToken(token) {
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const texto = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
        .join("")
    );
    return JSON.parse(texto);
  } catch {
    return null;
  }
}

// true si el token existe y todavía no expira (con un margen de 10 segundos)
export function tokenVigente(token, margenSegundos = 10) {
  const payload = token ? leerPayloadToken(token) : null;
  if (!payload?.exp) return false;
  return payload.exp * 1000 > Date.now() + margenSegundos * 1000;
}

// Milisegundos que le quedan al token (0 si ya expiró)
export function tiempoRestante(token) {
  const payload = token ? leerPayloadToken(token) : null;
  if (!payload?.exp) return 0;
  return Math.max(0, payload.exp * 1000 - Date.now());
}
