import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { NOMBRE_ROL, ROLES } from "../utils/permisos";
import AdminResumen from "../components/admin/AdminResumen";
import AdminProductos from "../components/admin/AdminProductos";
import AdminCategorias from "../components/admin/AdminCategorias";
import AdminOrdenes from "../components/admin/AdminOrdenes";
import AdminUsuarios from "../components/admin/AdminUsuarios";
import AdminContenido from "../components/admin/AdminContenido";

// ==========================================
// PANEL INTERNO
// ==========================================
// La ruta /admin solo deja entrar a ADMIN y VENDEDOR (RutaProtegida en App.jsx).
// Dentro, cada pestaña declara el permiso que necesita y solo se muestran
// las que el rol puede usar:
//   - ADMIN: todas.
//   - VENDEDOR: Resumen, Productos (solo ver) y Órdenes (solo ver).
const PESTANAS = [
  { id: "resumen", titulo: "Resumen", permiso: "panel.ver" },
  { id: "productos", titulo: "Productos", permiso: "productos.ver" },
  { id: "ordenes", titulo: "Órdenes", permiso: "ordenes.ver" },
  { id: "categorias", titulo: "Categorías", permiso: "categorias.editar" },
  { id: "usuarios", titulo: "Usuarios", permiso: "usuarios.editar" },
  { id: "blogs", titulo: "Blogs", permiso: "contenido.editar" },
  { id: "sitio", titulo: "Nosotros y contacto", permiso: "contenido.editar" }
];

function Admin({ catalogo, articulos, guardarArticulos, contenido, guardarContenido }) {
  const { rol, usuario, puede } = useAuth();
  const visibles = PESTANAS.filter((p) => puede(p.permiso));
  const [seccion, setSeccion] = useState(visibles[0]?.id ?? "resumen");

  return (
    <section className="panel-admin">
      <h2>{rol === ROLES.VENDEDOR ? "Panel del vendedor" : "Panel de administración"}</h2>
      <p className="aviso-demo">
        Conectado como <strong>{usuario?.nombre}</strong> ({NOMBRE_ROL[rol]}).
        {rol === ROLES.VENDEDOR && " Tu rol permite revisar productos y órdenes, sin modificarlos."}
      </p>

      <div className="pestanas-admin" role="tablist" aria-label="Secciones del panel">
        {visibles.map(({ id, titulo }) => (
          <button
            type="button"
            role="tab"
            aria-selected={seccion === id}
            className={seccion === id ? "pestana-admin activa" : "pestana-admin"}
            key={id}
            onClick={() => setSeccion(id)}
          >
            {titulo}
          </button>
        ))}
      </div>

      {seccion === "resumen" && <AdminResumen productos={catalogo.productos} />}
      {seccion === "productos" && (
        <AdminProductos catalogo={catalogo} puedeEditar={puede("productos.editar")} />
      )}
      {seccion === "ordenes" && (
        <AdminOrdenes puedeEditar={puede("ordenes.editar")} recargarCatalogo={catalogo.recargar} />
      )}
      {seccion === "categorias" && puede("categorias.editar") && <AdminCategorias catalogo={catalogo} />}
      {seccion === "usuarios" && puede("usuarios.editar") && <AdminUsuarios />}
      {(seccion === "blogs" || seccion === "sitio") && puede("contenido.editar") && (
        <AdminContenido
          key={seccion}
          seccion={seccion}
          articulos={articulos}
          guardarArticulos={guardarArticulos}
          contenido={contenido}
          guardarContenido={guardarContenido}
        />
      )}
    </section>
  );
}

export default Admin;
