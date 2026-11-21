import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import regionesComunas from "../data/regionesComunas";
import { useAuth } from "../context/AuthContext";
import { ordenesApi } from "../api/servicios";
import { mensajeError } from "../api/cliente";
import { calcularTotal, precioUnitario } from "../utils/carrito";
import { formatearPrecio } from "../utils/formato";

// ==========================================
// CHECKOUT (paso de pago)
// ==========================================
// 1. Se precargan los datos del usuario conectado (nombre, correo, dirección).
// 2. Al confirmar se envía POST /api/v1/ordenes con solo id y cantidad de cada producto.
// 3. El backend valida stock, calcula el total y descuenta stock.
//    - 201: se vacía el carrito y se va a /compra-exitosa/:id
//    - 409/400: se va a /compra-fallida con el motivo
function Checkout({ carrito, vaciarCarrito, recargarCatalogo }) {
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState(() => ({
    nombre: usuario?.nombre ?? "",
    apellidos: usuario?.apellidos ?? "",
    correo: usuario?.correo ?? "",
    calle: usuario?.direccion ?? "",
    departamento: "",
    region: usuario?.region ?? "",
    comuna: usuario?.comuna ?? "",
    indicaciones: ""
  }));
  const comunas = regionesComunas.find((r) => r.region === form.region)?.comunas ?? [];
  const total = calcularTotal(carrito);

  if (carrito.length === 0 && !enviando) {
    return <Navigate to="/carrito" replace />;
  }

  function cambiar(campo, valor) {
    setForm((actual) => ({ ...actual, [campo]: valor }));
  }

  async function pagar(event) {
    event.preventDefault();
    setError("");
    if (!form.nombre.trim() || !form.apellidos.trim() || !form.correo.trim() || !form.calle.trim()) {
      setError("Completa nombre, apellidos, correo y dirección.");
      return;
    }
    if (!form.region || !comunas.includes(form.comuna)) {
      setError("Selecciona región y comuna de despacho.");
      return;
    }

    setEnviando(true);
    try {
      const orden = await ordenesApi.crear({
        ...form,
        items: carrito.map((item) => ({ productoId: item.id, cantidad: item.cantidad }))
      });
      vaciarCarrito();
      recargarCatalogo?.();
      navigate(`/compra-exitosa/${orden.id}`, { replace: true, state: { orden } });
    } catch (e) {
      if (!e.response || e.response.status >= 500) {
        // Error de conexión: se queda en el formulario para reintentar
        setError(mensajeError(e));
        setEnviando(false);
        return;
      }
      navigate("/compra-fallida", {
        replace: true,
        state: { motivo: mensajeError(e, "No se pudo procesar el pago.") }
      });
    }
  }

  return (
    <section className="pagina-checkout">
      <h2>Checkout</h2>
      <p className="descripcion-seccion">Revisa tu pedido e ingresa los datos de despacho.</p>

      <div className="row g-4">
        <div className="col-12 col-lg-7">
          <form className="card card-body" onSubmit={pagar} noValidate>
            <h3 className="h5 mb-3">Datos del cliente</h3>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label" htmlFor="co-nombre">Nombre</label>
                <input id="co-nombre" className="form-control" value={form.nombre}
                  onChange={(e) => cambiar("nombre", e.target.value)} maxLength={50} required />
              </div>
              <div className="col-md-6">
                <label className="form-label" htmlFor="co-apellidos">Apellidos</label>
                <input id="co-apellidos" className="form-control" value={form.apellidos}
                  onChange={(e) => cambiar("apellidos", e.target.value)} maxLength={100} required />
              </div>
              <div className="col-12">
                <label className="form-label" htmlFor="co-correo">Correo</label>
                <input id="co-correo" type="email" className="form-control" value={form.correo}
                  onChange={(e) => cambiar("correo", e.target.value)} required />
              </div>
            </div>

            <h3 className="h5 mt-4 mb-3">Dirección de entrega</h3>
            <div className="row g-3">
              <div className="col-md-8">
                <label className="form-label" htmlFor="co-calle">Calle y número</label>
                <input id="co-calle" className="form-control" value={form.calle}
                  onChange={(e) => cambiar("calle", e.target.value)} maxLength={300} required />
              </div>
              <div className="col-md-4">
                <label className="form-label" htmlFor="co-depto">Depto. (opcional)</label>
                <input id="co-depto" className="form-control" value={form.departamento}
                  onChange={(e) => cambiar("departamento", e.target.value)} maxLength={50} />
              </div>
              <div className="col-md-6">
                <label className="form-label" htmlFor="co-region">Región</label>
                <select id="co-region" className="form-select" value={form.region}
                  onChange={(e) => setForm((a) => ({ ...a, region: e.target.value, comuna: "" }))} required>
                  <option value="">Selecciona una región</option>
                  {regionesComunas.map((r) => <option key={r.region} value={r.region}>{r.region}</option>)}
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label" htmlFor="co-comuna">Comuna</label>
                <select id="co-comuna" className="form-select" value={form.comuna}
                  onChange={(e) => cambiar("comuna", e.target.value)} disabled={!form.region} required>
                  <option value="">Selecciona una comuna</option>
                  {comunas.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="col-12">
                <label className="form-label" htmlFor="co-indicaciones">Indicaciones para la entrega (opcional)</label>
                <textarea id="co-indicaciones" className="form-control" rows={2} value={form.indicaciones}
                  onChange={(e) => cambiar("indicaciones", e.target.value)} maxLength={300} />
              </div>
            </div>

            {error && <div className="alert alert-danger mt-3 mb-0" role="alert">{error}</div>}

            <div className="d-flex flex-wrap gap-2 mt-4">
              <button type="submit" className="btn btn-warning btn-lg fw-bold" disabled={enviando}>
                {enviando ? "Procesando pago..." : `Pagar ahora ${formatearPrecio(total)}`}
              </button>
              <Link to="/carrito" className="btn btn-outline-light btn-lg">Volver al carrito</Link>
            </div>
          </form>
        </div>

        <div className="col-12 col-lg-5">
          <div className="card card-body">
            <h3 className="h5 mb-3">Resumen del pedido</h3>
            <ul className="list-group list-group-flush mb-3">
              {carrito.map((item) => (
                <li className="list-group-item d-flex justify-content-between bg-transparent" key={item.id}>
                  <span>{item.cantidad} × {item.nombre}</span>
                  <span>{formatearPrecio(precioUnitario(item) * item.cantidad)}</span>
                </li>
              ))}
            </ul>
            <p className="d-flex justify-content-between fs-5 fw-bold mb-0">
              <span>Total</span>
              <span>{formatearPrecio(total)}</span>
            </p>
            <p className="small text-secondary mt-2 mb-0">
              El total final lo confirma el servidor con los precios y el stock actuales.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Checkout;
