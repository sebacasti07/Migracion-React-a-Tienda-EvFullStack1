export const ESTADOS_ORDEN = ["PAGADA", "ENVIADA", "ENTREGADA", "CANCELADA"];

export const NOMBRE_ESTADO = {
  PAGADA: "Pagada",
  ENVIADA: "Enviada",
  ENTREGADA: "Entregada",
  CANCELADA: "Cancelada"
};

export const COLOR_ESTADO = {
  PAGADA: "bg-success",
  ENVIADA: "bg-info text-dark",
  ENTREGADA: "bg-primary",
  CANCELADA: "bg-secondary"
};

export function formatearFecha(fecha) {
  return new Date(fecha).toLocaleString("es-CL", { dateStyle: "medium", timeStyle: "short" });
}
