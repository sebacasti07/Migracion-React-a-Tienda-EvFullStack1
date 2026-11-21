import { useState, useEffect, useMemo } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Login from "./pages/login";
import CrearUsuario from "./pages/CrearUsuario";
import CambiarPassword from "./pages/CambiarPassword";
import NavbarSuperior from "./components/NavbarSuperior";
import Productos from "./pages/Productos";
import DetalleProducto from "./pages/DetalleProducto";
import Categorias from "./pages/Categorias";
import Admin from "./pages/Admin";
import Ofertas from "./pages/Ofertas";
import Nosotros from "./pages/Nosotros";
import Blogs from "./pages/Blogs";
import DetalleBlog from "./pages/DetalleBlog";
import Inicio from "./pages/Inicio";
import CarritoPage from "./pages/CarritoPage";
import Checkout from "./pages/Checkout";
import CompraExitosa from "./pages/CompraExitosa";
import CompraFallida from "./pages/CompraFallida";
import MisCompras from "./pages/MisCompras";
import AccesoDenegado from "./pages/AccesoDenegado";
import PieSitio from "./components/PieSitio";
import BotonSubir from "./components/BotonSubir";
import RutaProtegida from "./components/RutaProtegida";
import articulosIniciales from "./data/articulos";
import contenidoInicial from "./data/contenidoSitio";
import useCatalogo from "./hooks/useCatalogo";
import { leerAlmacenamiento, guardarAlmacenamiento } from "./utils/almacenamiento";
import { guardarCarrito, obtenerCarrito, eliminarCarrito } from "./utils/localStorage";
import { sincronizarCarrito } from "./utils/carrito";
import { ROLES } from "./utils/permisos";
import { useAuth } from "./context/AuthContext";

function DesplazarASeccion() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) return undefined;

    const frame = requestAnimationFrame(() => {
      document
        .getElementById(decodeURIComponent(hash.slice(1)))
        ?.scrollIntoView({ behavior: "smooth" });
    });

    return () => cancelAnimationFrame(frame);
  }, [pathname, hash]);

  return null;
}

// Roles que pueden usar el carrito y comprar (el vendedor solo revisa)
const ROLES_COMPRA = [ROLES.CLIENTE, ROLES.ADMIN];
const ROLES_PANEL = [ROLES.ADMIN, ROLES.VENDEDOR];

function App() {

  // ==========================================
  // CATÁLOGO DESDE EL BACKEND (API REST)
  // ==========================================
  const catalogo = useCatalogo();
  const { productos, categorias } = catalogo;
  const { autenticado, puede } = useAuth();

  // Blogs y textos del sitio siguen siendo contenido local del navegador
  const [articulos, setArticulos] = useState(() => leerAlmacenamiento("articulos", articulosIniciales));
  const [contenido, setContenido] = useState(() => leerAlmacenamiento("contenidoSitio", contenidoInicial));

  useEffect(() => guardarAlmacenamiento("articulos", articulos), [articulos]);
  useEffect(() => guardarAlmacenamiento("contenidoSitio", contenido), [contenido]);

  // ==========================================
  // CARRITO (persistido en localStorage)
  // ==========================================
  const [carrito, setCarrito] = useState(obtenerCarrito());

  useEffect(() => {
    guardarCarrito(carrito);
  }, [carrito]);

  // El carrito que se muestra usa el precio y stock actuales del backend
  const carritoVigente = useMemo(() => sincronizarCarrito(carrito, productos), [carrito, productos]);

  function stockDe(id, respaldo) {
    return productos.find((p) => p.id === id)?.stock ?? respaldo?.stock;
  }

  function agregarAlCarrito(producto) {
    const stock = stockDe(producto.id, producto);
    setCarrito((actual) => {
      const existe = actual.find((item) => item.id === producto.id);
      if (existe) {
        if (stock !== undefined && existe.cantidad >= stock) return actual;
        return actual.map((item) =>
          item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
        );
      }
      if (stock === 0) return actual;
      return [...actual, { ...producto, cantidad: 1 }];
    });
  }

  function aumentarCantidad(id) {
    setCarrito((actual) =>
      actual.map((producto) => {
        const stock = stockDe(id, producto);
        return producto.id === id && (stock === undefined || producto.cantidad < stock)
          ? { ...producto, cantidad: producto.cantidad + 1 }
          : producto;
      })
    );
  }

  function disminuirCantidad(id) {
    setCarrito((actual) =>
      actual
        .map((producto) =>
          producto.id === id ? { ...producto, cantidad: producto.cantidad - 1 } : producto
        )
        .filter((producto) => producto.cantidad > 0)
    );
  }

  function eliminarDelCarrito(id) {
    setCarrito((actual) => actual.filter((producto) => producto.id !== id));
  }

  function vaciarCarrito() {
    setCarrito([]);
    eliminarCarrito();
  }

  // ==========================================
  // RENDER
  // ==========================================
  return (
    <BrowserRouter>
      <DesplazarASeccion />

      <NavbarSuperior carrito={carritoVigente} />

      <main className="contenido-principal">
        <Routes>
          {/* -------- Tienda pública -------- */}
          <Route path="/" element={<Inicio contenido={contenido} />} />
          <Route
            path="/productos"
            element={<Productos catalogo={catalogo} agregarAlCarrito={agregarAlCarrito} />}
          />
          <Route
            path="/productos/:id"
            element={
              <DetalleProducto
                productos={productos}
                agregarAlCarrito={agregarAlCarrito}
                mostrarAgregar={!autenticado || puede("tienda.comprar")}
              />
            }
          />
          <Route
            path="/categorias"
            element={<Categorias productos={productos} categorias={categorias} cargando={catalogo.cargando} />}
          />
          <Route path="/ofertas" element={<Ofertas agregarAlCarrito={agregarAlCarrito} />} />
          <Route path="/nosotros" element={<Nosotros contenido={contenido.nosotros} />} />
          <Route path="/blogs" element={<Blogs articulos={articulos} />} />
          <Route path="/blogs/:slug" element={<DetalleBlog articulos={articulos} />} />

          {/* -------- Cuenta -------- */}
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<CrearUsuario />} />
          <Route
            path="/cambiar-password"
            element={<RutaProtegida><CambiarPassword /></RutaProtegida>}
          />
          <Route
            path="/mis-compras"
            element={<RutaProtegida roles={ROLES_COMPRA}><MisCompras /></RutaProtegida>}
          />
          <Route path="/acceso-denegado" element={<AccesoDenegado />} />

          {/* -------- Compra (solo cliente y admin) -------- */}
          <Route
            path="/carrito"
            element={
              <RutaProtegida roles={ROLES_COMPRA}>
                <CarritoPage
                  carrito={carritoVigente}
                  aumentarCantidad={aumentarCantidad}
                  disminuirCantidad={disminuirCantidad}
                  eliminarDelCarrito={eliminarDelCarrito}
                />
              </RutaProtegida>
            }
          />
          <Route
            path="/checkout"
            element={
              <RutaProtegida roles={ROLES_COMPRA}>
                <Checkout carrito={carritoVigente} vaciarCarrito={vaciarCarrito} recargarCatalogo={catalogo.recargar} />
              </RutaProtegida>
            }
          />
          <Route
            path="/compra-exitosa/:id"
            element={<RutaProtegida roles={ROLES_COMPRA}><CompraExitosa /></RutaProtegida>}
          />
          <Route
            path="/compra-fallida"
            element={<RutaProtegida roles={ROLES_COMPRA}><CompraFallida /></RutaProtegida>}
          />

          {/* -------- Panel interno (admin y vendedor) -------- */}
          <Route
            path="/admin"
            element={
              <RutaProtegida roles={ROLES_PANEL}>
                <Admin
                  catalogo={catalogo}
                  articulos={articulos}
                  guardarArticulos={setArticulos}
                  contenido={contenido}
                  guardarContenido={setContenido}
                />
              </RutaProtegida>
            }
          />
        </Routes>
      </main>

      <PieSitio />
      <BotonSubir />
    </BrowserRouter>
  );
}

export default App;
