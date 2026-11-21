import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import ListaProductos from "../components/ListaProductos";
import NavbarLateral from "../components/NavbarLateral";
import Cargando from "../components/Cargando";
import { useAuth } from "../context/AuthContext";

// Catálogo. Los productos llegan desde GET /api/v1/productos (hook useCatalogo en App).
function Productos({ agregarAlCarrito, catalogo }) {
  const { productos = [], categorias = [], cargando, error, recargar } = catalogo ?? {};
  const [searchParams] = useSearchParams();
  const categoria = searchParams.get("categoria");
  const [busqueda, setBusqueda] = useState("");
  const [ordenPrecio, setOrdenPrecio] = useState("desc");
  const { puede, autenticado } = useAuth();
  // Sin sesión se puede mirar; al agregar se pide iniciar sesión en el carrito
  const mostrarAgregar = !autenticado || puede("tienda.comprar");

  return (
    <section className="pagina-productos">
      <h2>{categoria || "Todos nuestros productos"}</h2>

      <p className="descripcion-seccion">
        {categoria
          ? `Productos de la categoría ${categoria}.`
          : "Explora nuestro catálogo de productos."}
      </p>

      <div className="controles-catalogo">
        <div className="barra-busqueda-productos">
          <label htmlFor="buscar-productos">Buscar productos</label>
          <input
            id="buscar-productos"
            type="search"
            value={busqueda}
            onChange={(event) => setBusqueda(event.target.value)}
            placeholder="Escribe el nombre de un producto"
          />
        </div>
        <div className="orden-productos">
          <label htmlFor="orden-precio">Ordenar por</label>
          <select
            id="orden-precio"
            value={ordenPrecio}
            onChange={(event) => setOrdenPrecio(event.target.value)}
          >
            <option value="desc">Mayor a menor</option>
            <option value="asc">Menor a mayor</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger d-flex justify-content-between align-items-center" role="alert">
          <span>{error}</span>
          <button type="button" className="btn btn-sm btn-outline-light" onClick={recargar}>Reintentar</button>
        </div>
      )}

      <div className="layout-tienda">
        <NavbarLateral productos={productos} categorias={categorias} mostrarCarrito={mostrarAgregar} />
        <div className="productos-catalogo">
          {cargando ? (
            <Cargando texto="Cargando productos..." />
          ) : (
            <ListaProductos
              productos={productos}
              agregarAlCarrito={agregarAlCarrito}
              categoria={categoria}
              busqueda={busqueda}
              ordenPrecio={ordenPrecio}
              mostrarAgregar={mostrarAgregar}
            />
          )}
        </div>
      </div>
    </section>
  );
}

export default Productos;
