import Carrito from "../components/Carrito";

// La protección (iniciar sesión y rol) la hace <RutaProtegida> en App.jsx
function CarritoPage({
  carrito,
  aumentarCantidad,
  disminuirCantidad,
  eliminarDelCarrito
}) {
  return (
    <section className="pagina-carrito">
      <Carrito
        carrito={carrito}
        aumentarCantidad={aumentarCantidad}
        disminuirCantidad={disminuirCantidad}
        eliminarDelCarrito={eliminarDelCarrito}
      />
    </section>
  );
}

export default CarritoPage;
