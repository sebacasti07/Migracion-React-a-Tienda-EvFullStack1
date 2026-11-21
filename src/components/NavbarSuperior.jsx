import { Link, NavLink, useNavigate } from "react-router-dom";
import logoInicio from "../images/logo-inicio-transparente.png";
import { useAuth } from "../context/AuthContext";
import { NOMBRE_ROL, ROLES } from "../utils/permisos";

function NavbarSuperior({ carrito = [] }) {
  const navigate = useNavigate();
  const { usuario, rol, puede, cerrarSesion } = useAuth();

  // Cantidad total de productos en el carrito
  const cantidadProductos = carrito.reduce(
    (total, producto) => total + producto.cantidad,
    0
  );

  function salir() {
    cerrarSesion();
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

        <div className="acciones-header">
          <div className="cuadro-cuenta">
            {usuario ? (
              <>
                <span className="enlace-cuenta saludo-cuenta" title={usuario.correo}>
                  Hola, {usuario.nombre}
                  <span className="badge bg-warning text-dark ms-2">{NOMBRE_ROL[rol]}</span>
                </span>
                {puede("panel.ver") && (
                  <Link className="enlace-cuenta" to="/admin">
                    {rol === ROLES.VENDEDOR ? "Panel vendedor" : "Administración"}
                  </Link>
                )}
                {puede("cuenta.compras") && (
                  <Link className="enlace-cuenta" to="/mis-compras">Mis compras</Link>
                )}
                <Link className="enlace-cuenta" to="/cambiar-password">
                  Cambiar contraseña
                </Link>
                <button type="button" className="enlace-cuenta" onClick={salir}>
                  Cerrar sesión
                </button>
              </>
            ) : (
              <>
                <Link className="enlace-cuenta" to="/login">Iniciar sesión</Link>
                <Link className="enlace-cuenta" to="/registro">Crear usuario</Link>
              </>
            )}
          </div>

          {/* El vendedor no compra, por eso no ve el carrito */}
          {rol !== ROLES.VENDEDOR && (
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
          )}
        </div>

        <div className="bloque-navegacion">
          <nav aria-label="Navegación principal">
            <ul>
              <li><NavLink to="/" end>Inicio</NavLink></li>
              <li><NavLink to="/productos">Productos</NavLink></li>
              <li><NavLink to="/categorias">Categorías</NavLink></li>
              <li><NavLink to="/ofertas">Ofertas</NavLink></li>
              <li><NavLink to="/nosotros">Nosotros</NavLink></li>
              <li><NavLink to="/blogs">Blogs</NavLink></li>
              <li><Link to="/#contacto">Contactos</Link></li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default NavbarSuperior;
