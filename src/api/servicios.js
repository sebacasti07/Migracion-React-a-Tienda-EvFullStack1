import cliente from "./cliente";

// ==========================================
// SERVICIOS: una función por cada endpoint del backend
// ==========================================

export const authApi = {
  login: (correo, password) => cliente.post("/auth/login", { correo, password }).then((r) => r.data),
  registro: (datos) => cliente.post("/auth/registro", datos).then((r) => r.data),
  perfil: () => cliente.get("/auth/me").then((r) => r.data),
  cambiarPassword: (passwordActual, nuevaPassword) =>
    cliente.put("/auth/password", { passwordActual, nuevaPassword }).then((r) => r.data)
};

export const productosApi = {
  listar: (categoriaId) =>
    cliente.get("/productos", { params: categoriaId ? { categoriaId } : {} }).then((r) => r.data),
  ofertas: () => cliente.get("/productos/ofertas").then((r) => r.data),
  stockCritico: () => cliente.get("/productos/stock-critico").then((r) => r.data),
  obtener: (id) => cliente.get(`/productos/${id}`).then((r) => r.data),
  crear: (datos) => cliente.post("/productos", datos).then((r) => r.data),
  actualizar: (id, datos) => cliente.put(`/productos/${id}`, datos).then((r) => r.data),
  eliminar: (id) => cliente.delete(`/productos/${id}`)
};

export const categoriasApi = {
  listar: () => cliente.get("/categorias").then((r) => r.data),
  crear: (datos) => cliente.post("/categorias", datos).then((r) => r.data),
  actualizar: (id, datos) => cliente.put(`/categorias/${id}`, datos).then((r) => r.data),
  eliminar: (id) => cliente.delete(`/categorias/${id}`)
};

export const ordenesApi = {
  crear: (datos) => cliente.post("/ordenes", datos).then((r) => r.data),
  mias: () => cliente.get("/ordenes/mias").then((r) => r.data),
  listar: () => cliente.get("/ordenes").then((r) => r.data),
  obtener: (id) => cliente.get(`/ordenes/${id}`).then((r) => r.data),
  cambiarEstado: (id, estado) => cliente.put(`/ordenes/${id}/estado`, { estado }).then((r) => r.data),
  eliminar: (id) => cliente.delete(`/ordenes/${id}`)
};

export const usuariosApi = {
  listar: () => cliente.get("/usuarios").then((r) => r.data),
  crear: (datos) => cliente.post("/usuarios", datos).then((r) => r.data),
  actualizar: (id, datos) => cliente.put(`/usuarios/${id}`, datos).then((r) => r.data),
  eliminar: (id) => cliente.delete(`/usuarios/${id}`)
};
