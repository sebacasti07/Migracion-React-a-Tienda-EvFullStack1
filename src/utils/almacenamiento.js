export function leerAlmacenamiento(clave, valorPredeterminado) {
  const valorGuardado = localStorage.getItem(clave);
  if (!valorGuardado) return valorPredeterminado;

  try {
    return JSON.parse(valorGuardado);
  } catch (error) {
    console.error(`No se pudo leer el dato local "${clave}".`, error);
    return valorPredeterminado;
  }
}

export function guardarAlmacenamiento(clave, valor) {
  localStorage.setItem(clave, JSON.stringify(valor));
}
