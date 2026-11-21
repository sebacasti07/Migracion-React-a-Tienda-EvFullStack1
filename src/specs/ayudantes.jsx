// Configuración común para las pruebas con Jasmine + Karma.
// React necesita saber que corre en un entorno de pruebas para que act() funcione bien.
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

export { crearTokenFalso, sesionDePrueba, renderConAuth } from "../test/utilidades.jsx";

export const productosDePrueba = [
  { id: 1, nombre: "Teclado Mecánico RGB", precio: 49990, precioFinal: 39990, enOferta: true, stock: 5, categoria: "Periféricos", emoji: "⌨️" },
  { id: 2, nombre: "Mouse Gamer Pro", precio: 19990, precioFinal: 19990, enOferta: false, stock: 0, categoria: "Periféricos", emoji: "🖱️" },
  { id: 3, nombre: 'Monitor Gamer 24"', precio: 159990, precioFinal: 159990, enOferta: false, stock: 3, categoria: "Monitores", emoji: "🖥️" }
];

// Espera hasta que la condición se cumpla (para respuestas asíncronas)
export async function esperar(condicion, ms = 2000) {
  const inicio = Date.now();
  while (Date.now() - inicio < ms) {
    try {
      const valor = condicion();
      if (valor) return valor;
    } catch {
      // se reintenta
    }
    await new Promise((r) => setTimeout(r, 20));
  }
  throw new Error("La condición no se cumplió a tiempo");
}
