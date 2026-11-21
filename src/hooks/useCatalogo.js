import { useCallback, useEffect, useState } from "react";
import { categoriasApi, productosApi } from "../api/servicios";
import { mensajeError } from "../api/cliente";

// ==========================================
// HOOK DEL CATÁLOGO
// ==========================================
// Pide al backend los productos y las categorías (GET públicos) y expone
// "recargar" para volver a pedirlos después de crear, editar o eliminar.

function pedirCatalogo() {
  return Promise.all([productosApi.listar(), categoriasApi.listar()]);
}

export default function useCatalogo() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const aplicar = useCallback(([listaProductos, listaCategorias]) => {
    setProductos(listaProductos);
    setCategorias(listaCategorias);
    setError("");
  }, []);

  const fallar = useCallback((e) => setError(mensajeError(e, "No se pudo cargar el catálogo.")), []);

  const recargar = useCallback(
    () => pedirCatalogo().then(aplicar).catch(fallar).finally(() => setCargando(false)),
    [aplicar, fallar]
  );

  useEffect(() => {
    pedirCatalogo().then(aplicar).catch(fallar).finally(() => setCargando(false));
  }, [aplicar, fallar]);

  return { productos, categorias, cargando, error, recargar };
}
