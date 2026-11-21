// ==========================================
// CÁLCULOS DEL CARRITO
// ==========================================

// Precio que se cobra: el de oferta si viene del backend, si no el normal
export const precioUnitario = (producto) => producto.precioFinal ?? producto.precio;

export function calcularTotal(carrito) {
  return carrito.reduce((acumulado, producto) => acumulado + precioUnitario(producto) * producto.cantidad, 0);
}

export function contarProductos(carrito) {
  return carrito.reduce((acumulado, producto) => acumulado + producto.cantidad, 0);
}

// Cruza el carrito guardado con el catálogo actual del backend:
// actualiza precio y stock, limita la cantidad al stock y quita productos que ya no existen.
export function sincronizarCarrito(carrito, productos) {
  if (!productos || productos.length === 0) return carrito;
  return carrito
    .map((item) => {
      const producto = productos.find((p) => p.id === item.id);
      return producto ? { ...producto, cantidad: Math.min(item.cantidad, producto.stock) } : null;
    })
    .filter((item) => item && item.cantidad > 0);
}
