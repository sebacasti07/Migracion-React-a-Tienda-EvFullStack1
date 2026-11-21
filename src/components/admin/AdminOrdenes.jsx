import { useEffect, useState } from "react";
import { ordenesApi } from "../../api/servicios";
import { mensajeError } from "../../api/cliente";
import { formatearPrecio } from "../../utils/formato";
import DetalleOrden from "../DetalleOrden";
import { useConfirmacion } from "./DialogoConfirmacion";
import Cargando from "../Cargando";
import { COLOR_ESTADO, ESTADOS_ORDEN as ESTADOS, NOMBRE_ESTADO, formatearFecha } from "../../utils/ordenes";

// Órdenes: ADMIN y VENDEDOR ven la lista y el detalle (GET /api/v1/ordenes).
// Solo ADMIN (puedeEditar) cambia el estado o elimina.
function AdminOrdenes({ puedeEditar, recargarCatalogo }) {
  const [ordenes, setOrdenes] = useState([]);
  const [seleccionada, setSeleccionada] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [aviso, setAviso] = useState(null);
  const { confirmar, dialogo } = useConfirmacion();

  function cargar() {
    return ordenesApi
      .listar()
      .then(setOrdenes)
      .catch((e) => setAviso({ tipo: "danger", texto: mensajeError(e) }))
      .finally(() => setCargando(false));
  }

  useEffect(() => {
    ordenesApi
      .listar()
      .then(setOrdenes)
      .catch((e) => setAviso({ tipo: "danger", texto: mensajeError(e) }))
      .finally(() => setCargando(false));
  }, []);

  async function verDetalle(id) {
    try {
      setSeleccionada(await ordenesApi.obtener(id));
    } catch (e) {
      setAviso({ tipo: "danger", texto: mensajeError(e) });
    }
  }

  function cambiarEstado(orden, estado) {
    const ejecutar = async () => {
      try {
        const actualizada = await ordenesApi.cambiarEstado(orden.id, estado);
        setSeleccionada(actualizada);
        setAviso({ tipo: "success", texto: `Orden #${orden.id} marcada como ${NOMBRE_ESTADO[estado]}.` });
        await cargar();
        if (estado === "CANCELADA") recargarCatalogo?.();
      } catch (e) {
        setAviso({ tipo: "danger", texto: mensajeError(e) });
      }
    };
    if (estado === "CANCELADA") {
      confirmar(`¿Cancelar la orden #${orden.id}? Se devolverá el stock.`, ejecutar, true);
    } else {
      ejecutar();
    }
  }

  function eliminar(orden) {
    confirmar(`¿Eliminar la orden #${orden.id}?`, async () => {
      try {
        await ordenesApi.eliminar(orden.id);
        setSeleccionada(null);
        setAviso({ tipo: "success", texto: "Orden eliminada." });
        await cargar();
        recargarCatalogo?.();
      } catch (e) {
        setAviso({ tipo: "danger", texto: mensajeError(e) });
      }
    }, true);
  }

  if (cargando) return <Cargando texto="Cargando órdenes..." />;

  return (
    <div>
      <h3>Órdenes ({ordenes.length})</h3>
      {aviso && <div className={`alert alert-${aviso.tipo} py-2`} role="status">{aviso.texto}</div>}
      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead>
            <tr>
              <th>N°</th>
              <th>Fecha</th>
              <th>Cliente</th>
              <th>Comuna</th>
              <th className="text-end">Total</th>
              <th>Estado</th>
              <th className="text-end">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {ordenes.map((o) => (
              <tr key={o.id}>
                <td>#{o.id}</td>
                <td>{formatearFecha(o.fecha)}</td>
                <td>{o.nombre} {o.apellidos}</td>
                <td>{o.comuna}</td>
                <td className="text-end">{formatearPrecio(o.total)}</td>
                <td><span className={`badge ${COLOR_ESTADO[o.estado]}`}>{NOMBRE_ESTADO[o.estado]}</span></td>
                <td className="text-end">
                  <button type="button" className="btn btn-sm btn-outline-info" onClick={() => verDetalle(o.id)}>Ver detalle</button>
                </td>
              </tr>
            ))}
            {ordenes.length === 0 && (
              <tr><td colSpan={7} className="text-secondary">Todavía no hay órdenes.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {seleccionada && (
        <div
          className="confirmacion-admin-overlay"
          onClick={(e) => e.target === e.currentTarget && setSeleccionada(null)}
          onKeyDown={(e) => e.key === "Escape" && setSeleccionada(null)}
        >
          <div className="card card-body detalle-admin detalle-admin--ancho" role="dialog" aria-modal="true" aria-label={`Detalle orden ${seleccionada.id}`}>
            <DetalleOrden orden={seleccionada} />
            {puedeEditar && seleccionada.estado !== "CANCELADA" && (
              <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
                <label htmlFor="estado-orden" className="me-1">Cambiar estado:</label>
                <select
                  id="estado-orden"
                  className="form-select form-select-sm w-auto"
                  value={seleccionada.estado}
                  onChange={(e) => cambiarEstado(seleccionada, e.target.value)}
                >
                  {ESTADOS.map((est) => <option key={est} value={est}>{NOMBRE_ESTADO[est]}</option>)}
                </select>
              </div>
            )}
            <div className="d-flex gap-2">
              <button type="button" className="btn btn-warning" autoFocus onClick={() => setSeleccionada(null)}>Cerrar</button>
              {puedeEditar && (
                <button type="button" className="btn btn-outline-danger" onClick={() => eliminar(seleccionada)}>Eliminar orden</button>
              )}
            </div>
          </div>
        </div>
      )}
      {dialogo}
    </div>
  );
}

export default AdminOrdenes;
