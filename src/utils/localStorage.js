// ==========================================
// GUARDAR CARRITO
// ==========================================

export function guardarCarrito(carrito) {

  localStorage.setItem(
    "carrito",
    JSON.stringify(carrito)
  );

}


// ==========================================
// OBTENER CARRITO
// ==========================================

export function obtenerCarrito() {

  const carritoGuardado =
    localStorage.getItem("carrito");

  if (carritoGuardado) {

    return JSON.parse(carritoGuardado);

  }

  return [];

}


// ==========================================
// ELIMINAR CARRITO
// ==========================================

export function eliminarCarrito() {

  localStorage.removeItem("carrito");

}