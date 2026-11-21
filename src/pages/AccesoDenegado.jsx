import { Link } from "react-router-dom";

function AccesoDenegado() {
  return (
    <section className="pagina-compra text-center py-5">
      <p className="display-4" aria-hidden="true">🔒</p>
      <h2>Acceso denegado</h2>
      <p>Tu cuenta no tiene permisos para ver esta página.</p>
      <Link to="/" className="btn btn-warning fw-bold">Volver al inicio</Link>
    </section>
  );
}

export default AccesoDenegado;
