import { formatearPrecio } from "../utils/formato";
import { COLOR_ESTADO, NOMBRE_ESTADO, formatearFecha } from "../utils/ordenes";

// Muestra el detalle de una orden (se reutiliza en compra exitosa, mis compras y el panel)
function DetalleOrden({ orden }) {
  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <h3 className="h5 mb-0">Orden #{orden.id}</h3>
        <span className={`badge ${COLOR_ESTADO[orden.estado] ?? "bg-secondary"}`}>
          {NOMBRE_ESTADO[orden.estado] ?? orden.estado}
        </span>
      </div>
      <p className="text-secondary mb-2">{formatearFecha(orden.fecha)}</p>

      <div className="row g-3 mb-3">
        <div className="col-md-6">
          <h4 className="h6">Cliente</h4>
          <p className="mb-0">{orden.nombre} {orden.apellidos}</p>
          <p className="mb-0 text-secondary">{orden.correo}</p>
        </div>
        <div className="col-md-6">
          <h4 className="h6">Despacho</h4>
          <p className="mb-0">{orden.calle}{orden.departamento ? `, depto ${orden.departamento}` : ""}</p>
          <p className="mb-0 text-secondary">{orden.comuna}, {orden.region}</p>
          {orden.indicaciones && <p className="mb-0 small">Indicaciones: {orden.indicaciones}</p>}
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-sm align-middle">
          <thead>
            <tr>
              <th>Producto</th>
              <th className="text-end">Cantidad</th>
              <th className="text-end">Precio</th>
              <th className="text-end">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {orden.detalles.map((d, i) => (
              <tr key={`${d.productoId}-${i}`}>
                <td>{d.nombreProducto}</td>
                <td className="text-end">{d.cantidad}</td>
                <td className="text-end">{formatearPrecio(d.precioUnitario)}</td>
                <td className="text-end">{formatearPrecio(d.subtotal)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th colSpan={3} className="text-end">Total pagado</th>
              <th className="text-end">{formatearPrecio(orden.total)}</th>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

export default DetalleOrden;
