import { useEffect, useState } from "react";
import ListaProductos from "../components/ListaProductos";
import Cargando from "../components/Cargando";
import { productosApi } from "../api/servicios";
import { mensajeError } from "../api/cliente";
import { useAuth } from "../context/AuthContext";

// Productos en oferta: GET /api/v1/productos/ofertas
function Ofertas({ agregarAlCarrito }) {
  const [ofertas, setOfertas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const { puede, autenticado } = useAuth();

  useEffect(() => {
    productosApi
      .ofertas()
      .then(setOfertas)
      .catch((e) => setError(mensajeError(e, "No se pudieron cargar las ofertas.")))
      .finally(() => setCargando(false));
  }, []);

  return (
    <section className="pagina-productos">
      <h2>Ofertas</h2>
      <p className="descripcion-seccion">
        ¡Aprovecha nuestras ofertas especiales de CYBER! Precios rebajados por tiempo limitado.
      </p>

      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      {cargando ? (
        <Cargando texto="Cargando ofertas..." />
      ) : (
        !error && (
          <ListaProductos
            productos={ofertas}
            agregarAlCarrito={agregarAlCarrito}
            ordenPrecio="asc"
            mostrarAgregar={!autenticado || puede("tienda.comprar")}
          />
        )
      )}
    </section>
  );
}

export default Ofertas;
