// ==========================================
// VALIDACIONES DE FORMULARIOS (frontend)
// ==========================================
// Se validan en el navegador para avisar rápido al usuario,
// y el backend vuelve a validar lo mismo antes de guardar.

export const DOMINIOS_PERMITIDOS = ["@duoc.cl", "@profesor.duoc.cl", "@gmail.com"];

export function correoPermitido(correo) {
  const valor = (correo || "").trim().toLowerCase();
  return /^[^@\s]+@[^@\s]+$/.test(valor) && DOMINIOS_PERMITIDOS.some((d) => valor.endsWith(d));
}

export function normalizarRun(run) {
  return (run || "").replace(/[.\-\s]/g, "").toUpperCase();
}

// Valida el RUN chileno con el algoritmo de módulo 11 (RF-009)
export function runValido(run) {
  const limpio = normalizarRun(run);
  if (!/^\d{7,8}[0-9K]$/.test(limpio)) return false;
  const cuerpo = limpio.slice(0, -1);
  const dv = limpio.slice(-1);
  let suma = 0;
  let multiplicador = 2;
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += Number(cuerpo[i]) * multiplicador;
    multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
  }
  const resto = 11 - (suma % 11);
  const esperado = resto === 11 ? "0" : resto === 10 ? "K" : String(resto);
  return dv === esperado;
}
