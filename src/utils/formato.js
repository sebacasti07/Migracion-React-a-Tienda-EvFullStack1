// Formatea un precio en pesos chilenos: 5990 -> $5.990
export function formatearPrecio(valor) {
  return "$" + valor.toLocaleString("es-CL");
}
