import { useState, useEffect } from "react";
import Login from "./pages/login";
import CrearUsuario from "./pages/CrearUsuario";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation
} from "react-router-dom";

import NavbarSuperior from "./components/NavbarSuperior";
import Productos from "./pages/Productos";
import DetalleProducto from "./pages/DetalleProducto";
import Admin from "./pages/Admin";
import Ofertas from "./pages/Ofertas";
import Nosotros from "./pages/Nosotros";
import Blogs from "./pages/Blogs";
import DetalleBlog from "./pages/DetalleBlog";
import Inicio from "./pages/Inicio";
import CarritoPage from "./pages/CarritoPage";
import PieSitio from "./components/PieSitio";
import BotonSubir from "./components/BotonSubir";
import productosIniciales from "./data/productos";
import articulosIniciales from "./data/articulos";
import contenidoInicial from "./data/contenidoSitio";
import { leerAlmacenamiento, guardarAlmacenamiento } from "./utils/almacenamiento";

import {
  guardarCarrito,
  obtenerCarrito
} from "./utils/localStorage";

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

function App() {

  // ==========================================
  // STATE DEL CARRITO
  // ==========================================

  const [carrito, setCarrito] = useState(
    obtenerCarrito()
  );
  const [productos, setProductos] = useState(() => leerAlmacenamiento("productos", productosIniciales));
  const [articulos, setArticulos] = useState(() => leerAlmacenamiento("articulos", articulosIniciales));
  const [contenido, setContenido] = useState(() => leerAlmacenamiento("contenidoSitio", contenidoInicial));
  const [usuarios, setUsuarios] = useState(() => leerAlmacenamiento("usuarios", []));


  // ==========================================
  // GUARDAR CARRITO EN LOCALSTORAGE
  // ==========================================

  useEffect(() => {

    guardarCarrito(carrito);

  }, [carrito]);

  useEffect(() => guardarAlmacenamiento("productos", productos), [productos]);
  useEffect(() => guardarAlmacenamiento("articulos", articulos), [articulos]);
  useEffect(() => guardarAlmacenamiento("contenidoSitio", contenido), [contenido]);
  useEffect(() => guardarAlmacenamiento("usuarios", usuarios), [usuarios]);


  // ==========================================
  // AGREGAR PRODUCTO
  // ==========================================

  function agregarAlCarrito(producto) {

    const productoExiste = carrito.find(
      item => item.id === producto.id
    );


    if (productoExiste) {

      setCarrito(
        carrito.map(item =>
          item.id === producto.id
            ? {
                ...item,
                cantidad: item.cantidad + 1
              }
            : item
        )
      );

    } else {

      setCarrito([
        ...carrito,
        {
          ...producto,
          cantidad: 1
        }
      ]);

    }

  }


  // ==========================================
  // AUMENTAR CANTIDAD
  // ==========================================

  function aumentarCantidad(id) {

    setCarrito(
      carrito.map(producto =>
        producto.id === id
          ? {
              ...producto,
              cantidad: producto.cantidad + 1
            }
          : producto
      )
    );

  }


  // ==========================================
  // DISMINUIR CANTIDAD
  // ==========================================

  function disminuirCantidad(id) {

    setCarrito(

      carrito
        .map(producto =>
          producto.id === id
            ? {
                ...producto,
                cantidad: producto.cantidad - 1
              }
            : producto
        )
        .filter(producto => producto.cantidad > 0)

    );

  }


  // ==========================================
  // ELIMINAR PRODUCTO
  // ==========================================

  function eliminarDelCarrito(id) {

    setCarrito(
      carrito.filter(
        producto => producto.id !== id
      )
    );

  }


  // ==========================================
  // RENDER
  // ==========================================

  return (

    <BrowserRouter>

      <DesplazarASeccion />

      {/* ======================================
          NAVBAR
          ====================================== */}

      <NavbarSuperior
        carrito={carrito}
      />


      {/* ======================================
          RUTAS
          ====================================== */}

      <main className="contenido-principal">
        <Routes>


          {/* ==================================
              INICIO
              ================================== */}

          <Route
            path="/"
            element={
              <Inicio
                agregarAlCarrito={
                  agregarAlCarrito
                }
                contenido={contenido}
              />
            }
          />


          {/* ==================================
              CARRITO
              ================================== */}

          <Route
            path="/carrito"
            element={

              <CarritoPage

                carrito={carrito}

                aumentarCantidad={
                  aumentarCantidad
                }

                disminuirCantidad={
                  disminuirCantidad
                }

                eliminarDelCarrito={
                  eliminarDelCarrito
                }

              />

            }
          />
<Route
  path="/login"
  element={<Login usuarios={usuarios} />}
/>
<Route
  path="/registro"
  element={<CrearUsuario usuarios={usuarios} guardarUsuarios={setUsuarios} />}
/>
<Route
  path="/productos"
  element={
    <Productos
      agregarAlCarrito={agregarAlCarrito}
      productos={productos}
    />
  }
/>
<Route
  path="/productos/:id"
  element={<DetalleProducto productos={productos} /> }
/>


<Route
  path="/ofertas"
  element={
    <Ofertas
      agregarAlCarrito={agregarAlCarrito}
    />
  }
/>
<Route
  path="/nosotros"
  element={<Nosotros contenido={contenido.nosotros} />}
/>
<Route
  path="/blogs"
  element={<Blogs articulos={articulos} />}
/>
<Route
  path="/blogs/:slug"
  element={<DetalleBlog articulos={articulos} />}
/>
<Route
  path="/admin"
  element={
    <Admin
      productos={productos}
      guardarProductos={setProductos}
      articulos={articulos}
      guardarArticulos={setArticulos}
      usuarios={usuarios}
      guardarUsuarios={setUsuarios}
      contenido={contenido}
      guardarContenido={setContenido}
    />
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