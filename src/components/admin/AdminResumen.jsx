import { useEffect, useState } from "react";
import { ordenesApi, productosApi } from "../../api/servicios";
import { mensajeError } from "../../api/cliente";
import { formatearPrecio } from "../../utils/formato";

// Resumen del panel (admin y vendedor): totales y productos con stock crítico
function AdminResumen({ productos = [] }) {
  const [ordenes, setOrdenes] = useState([]);
  const [criticos, setCriticos] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([ordenesApi.listar(), productosApi.stockCritico()])
      .then(([listaOrdenes, listaCriticos]) => {
        setOrdenes(listaOrdenes);
        setCriticos(listaCriticos);
      })
      .catch((e) => setError(mensajeError(e)));
  }, []);

  const vigentes = ordenes.filter((o) => o.estado !== "CANCELADA");
  const ventas = vigentes.reduce((suma, o) => suma + o.total, 0);

  const tarjetas = [
    ["Productos", productos.length],
    ["Órdenes", ordenes.length],
    ["Ventas", formatearPrecio(ventas)],
    ["Stock crítico", criticos.length]
  ];

  return (
    <div>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="row g-3 mb-4">
        {tarjetas.map(([titulo, valor]) => (
          <div className="col-6 col-lg-3" key={titulo}>
            <div className="card card-body text-center h-100">
              <p className="text-secondary mb-1">{titulo}</p>
              <p className="fs-3 fw-bold mb-0">{valor}</p>
            </div>
          </div>
        ))}
      </div>

      <h3 className="h5">Productos con stock crítico</h3>
      {criticos.length === 0 ? (
        <p className="text-secondary">No hay productos con stock crítico.</p>
      ) : (
        <ul className="list-group">
          {criticos.map((p) => (
            <li className="list-group-item d-flex justify-content-between" key={p.id}>
              <span>{p.codigo} · {p.nombre}</span>
              <span className="badge bg-danger">Stock {p.stock} / crítico {p.stockCritico}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AdminResumen;
