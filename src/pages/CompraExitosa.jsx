import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import DetalleOrden from "../components/DetalleOrden";
import Cargando from "../components/Cargando";
import { ordenesApi } from "../api/servicios";

// Resumen de la compra. Normalmente la orden llega desde el checkout (state);
// si se recarga la página se busca en GET /api/v1/ordenes/mias.
function CompraExitosa() {
  const { id } = useParams();
  const { state } = useLocation();
  const [orden, setOrden] = useState(state?.orden ?? null);
  const [noEncontrada, setNoEncontrada] = useState(false);

  useEffect(() => {
    if (orden) return;
    ordenesApi
      .mias()
      .then((lista) => {
        const encontrada = lista.find((o) => o.id === Number(id));
        if (encontrada) setOrden(encontrada);
        else setNoEncontrada(true);
      })
      .catch(() => setNoEncontrada(true));
  }, [id, orden]);

  return (
    <section className="pagina-compra">
      <div className="alert alert-success d-flex align-items-center gap-3" role="status">
        <span className="fs-2" aria-hidden="true">✔</span>
        <div>
          <h2 className="h4 mb-1">¡Compra realizada con éxito!</h2>
          <p className="mb-0">Tu pago fue aprobado. Te enviaremos la confirmación a tu correo.</p>
        </div>
      </div>

      <div className="card card-body mb-3">
        {orden ? (
          <DetalleOrden orden={orden} />
        ) : noEncontrada ? (
          <p className="mb-0">No pudimos cargar el detalle de la orden #{id}.</p>
        ) : (
          <Cargando texto="Cargando resumen..." />
        )}
      </div>

      <div className="d-flex flex-wrap gap-2">
        <Link to="/productos" className="btn btn-warning fw-bold">Seguir comprando</Link>
        <Link to="/mis-compras" className="btn btn-outline-light">Ver mis compras</Link>
        <button type="button" className="btn btn-outline-light" onClick={() => window.print()}>
          Imprimir boleta
        </button>
      </div>
    </section>
  );
}

export default CompraExitosa;
