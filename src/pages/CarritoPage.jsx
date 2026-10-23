import { Navigate } from "react-router-dom";
import Carrito from "../components/Carrito";

function CarritoPage({
  carrito,
  aumentarCantidad,
  disminuirCantidad,
  eliminarDelCarrito
}) {

  const usuario = sessionStorage.getItem("usuario");

  // Si NO está logueado
  if (!usuario) {
    return <Navigate to="/login" />;
  }

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
