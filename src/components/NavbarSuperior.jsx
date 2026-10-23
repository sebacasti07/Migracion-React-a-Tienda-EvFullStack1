import { Link, useNavigate } from "react-router-dom";
import logoInicio from "../images/logo-inicio-transparente.png";

function NavbarSuperior({ carrito = [] }) {
  const navigate = useNavigate();

  // Revisamos si existe una sesión
  const usuario = sessionStorage.getItem("usuario");

  // Cantidad total de productos en el carrito
  const cantidadProductos = carrito.reduce(
    (total, producto) => total + producto.cantidad,
    0
  );

  // Cerrar sesión
  function cerrarSesion() {
    sessionStorage.removeItem("usuario");
    sessionStorage.removeItem("rol");
    navigate("/");
  }

  return (
    <header className="encabezado-sitio">
      <div className="contenedor">
        <Link to="/" className="logo-sitio">
          <h1>
            <img src={logoInicio} alt="Videogiochis" />
          </h1>
        </Link>

        <div className="bloque-navegacion">
          <nav aria-label="Navegación principal">
            <ul>
              <li><Link to="/">Inicio</Link></li>
              <li><Link to="/productos">Productos</Link></li>
              {usuario && <li><Link to="/ofertas">Ofertas</Link></li>}
              <li><Link to="/nosotros">Nosotros</Link></li>
              <li><Link to="/blogs">Blogs</Link></li>
              <li><Link to="/#contacto">Contactos</Link></li>
              <li>
                <Link
                  className="enlace-carrito"
                  to="/carrito"
                  aria-label={`Ver carrito, ${cantidadProductos} productos`}
                  title="Ver carrito"
                >
                  <span className="logo-carrito" aria-hidden="true">
                    🛒
                    <span className="contador-carrito">{cantidadProductos}</span>
                  </span>
                </Link>
              </li>
            </ul>
          </nav>

          <div className="cuadro-cuenta">
            {usuario ? (
              <>
                {sessionStorage.getItem("rol") === "admin" && (
                  <Link className="enlace-cuenta" to="/admin">Administración</Link>
                )}
                {sessionStorage.getItem("rol") !== "admin" && (
                  <Link className="enlace-cuenta" to="/cambiar-password">
                    Cambiar contraseña
                  </Link>
                )}
                <button
                  type="button"
                  className="enlace-cuenta"
                  onClick={cerrarSesion}
                >
                  Cerrar sesión
                </button>
              </>
            ) : (
              <>
                <Link className="enlace-cuenta" to="/login">
                  Iniciar sesión
                </Link>
                <Link className="enlace-cuenta" to="/registro">
                  Crear usuario
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default NavbarSuperior;