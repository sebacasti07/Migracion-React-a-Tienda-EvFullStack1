import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DetalleOrden from "../components/DetalleOrden";
import { COLOR_ESTADO, NOMBRE_ESTADO, formatearFecha } from "../utils/ordenes";
import Cargando from "../components/Cargando";
import { ordenesApi } from "../api/servicios";
import { mensajeError } from "../api/cliente";
import { formatearPrecio } from "../utils/formato";

// Historial del usuario conectado: GET /api/v1/ordenes/mias
function MisCompras() {
  const [ordenes, setOrdenes] = useState([]);
  const [abierta, setAbierta] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    ordenesApi
      .mias()
      .then(setOrdenes)
      .catch((e) => setError(mensajeError(e)))
      .finally(() => setCargando(false));
  }, []);

  if (cargando) return <Cargando texto="Cargando tus compras..." />;

  return (
    <section className="pagina-compras">
      <h2>Mis compras</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {!error && ordenes.length === 0 && (
        <p>
          Todavía no tienes compras. <Link to="/productos">Ir a la tienda</Link>
        </p>
      )}
      <div className="list-group">
        {ordenes.map((orden) => (
          <div className="list-group-item" key={orden.id}>
            <button
              type="button"
              className="btn btn-link text-start text-decoration-none w-100 p-0 d-flex flex-wrap justify-content-between gap-2"
              onClick={() => setAbierta(abierta === orden.id ? null : orden.id)}
              aria-expanded={abierta === orden.id}
            >
              <span>Orden #{orden.id} · {formatearFecha(orden.fecha)}</span>
              <span>
                <span className={`badge ${COLOR_ESTADO[orden.estado]} me-2`}>{NOMBRE_ESTADO[orden.estado]}</span>
                <strong>{formatearPrecio(orden.total)}</strong>
              </span>
            </button>
            {abierta === orden.id && <div className="mt-3"><DetalleOrden orden={orden} /></div>}
          </div>
        ))}
      </div>
    </section>
  );
}

export default MisCompras;
