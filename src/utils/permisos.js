// ==========================================
// PERMISOS POR ROL (frontend)
// ==========================================
// Define qué puede ver o hacer cada rol en la interfaz.
// Esto solo oculta pantallas y botones: el backend vuelve a validar cada
// petición con el JWT, así que esconder algo aquí no es la única barrera.

export const ROLES = {
  ADMIN: "ADMIN",
  VENDEDOR: "VENDEDOR",
  CLIENTE: "CLIENTE"
};

export const PERMISOS = {
  // Panel interno (admin y vendedor)
  "panel.ver": [ROLES.ADMIN, ROLES.VENDEDOR],
  "productos.ver": [ROLES.ADMIN, ROLES.VENDEDOR],
  "productos.editar": [ROLES.ADMIN],
  "categorias.editar": [ROLES.ADMIN],
  "ordenes.ver": [ROLES.ADMIN, ROLES.VENDEDOR],
  "ordenes.editar": [ROLES.ADMIN],
  "usuarios.editar": [ROLES.ADMIN],
  "contenido.editar": [ROLES.ADMIN],
  // Tienda
  "tienda.comprar": [ROLES.ADMIN, ROLES.CLIENTE],
  "cuenta.compras": [ROLES.CLIENTE, ROLES.ADMIN]
};

export function tienePermiso(rol, permiso) {
  return Boolean(rol) && (PERMISOS[permiso] ?? []).includes(rol);
}

export function rutaInicialPorRol(rol) {
  if (rol === ROLES.ADMIN || rol === ROLES.VENDEDOR) return "/admin";
  return "/";
}

export const NOMBRE_ROL = {
  ADMIN: "Administrador",
  VENDEDOR: "Vendedor",
  CLIENTE: "Cliente"
};
