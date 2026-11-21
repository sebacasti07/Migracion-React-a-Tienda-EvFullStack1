import { Link, useLocation } from "react-router-dom";

// Se muestra cuando el backend rechaza la compra (por ejemplo, stock insuficiente).
// El carrito NO se vacía, así el cliente puede ajustar y volver a intentar.
function CompraFallida() {
  const { state } = useLocation();
  const motivo = state?.motivo ?? "No se pudo procesar el pago.";

  return (
    <section className="pagina-compra">
      <div className="alert alert-danger d-flex align-items-center gap-3" role="alert">
        <span className="fs-2" aria-hidden="true">✖</span>
        <div>
          <h2 className="h4 mb-1">No se pudo realizar el pago</h2>
          <p className="mb-0">{motivo}</p>
        </div>
      </div>
      <p>Tu carrito sigue guardado. Revisa las cantidades y vuelve a intentarlo.</p>
      <div className="d-flex flex-wrap gap-2">
        <Link to="/carrito" className="btn btn-warning fw-bold">Volver al carrito</Link>
        <Link to="/checkout" className="btn btn-outline-light">Reintentar pago</Link>
      </div>
    </section>
  );
}

export default CompraFallida;
