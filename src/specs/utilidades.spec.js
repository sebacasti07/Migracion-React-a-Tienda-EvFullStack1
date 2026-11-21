import { crearTokenFalso, sesionDePrueba } from "./ayudantes.jsx";
import { correoPermitido, normalizarRun, runValido } from "../utils/validaciones";
import { calcularTotal, contarProductos, sincronizarCarrito } from "../utils/carrito";
import { guardarSesion, leerSesion, limpiarSesion, tiempoRestante, tokenVigente } from "../utils/sesion";
import { rutaInicialPorRol, tienePermiso } from "../utils/permisos";
import { formatearPrecio } from "../utils/formato";
import cliente, { mensajeError } from "../api/cliente";

// PRUEBAS DE LÓGICA (funciones puras y utilidades)

describe("Validaciones", () => {
  it("runValido aplica el módulo 11", () => {
    expect(runValido("123456785")).toBeTrue();
    expect(runValido("12.345.678-5")).toBeTrue();
    expect(runValido("10000013K")).toBeTrue();
    expect(runValido("123456789")).toBeFalse();
    expect(runValido("abc")).toBeFalse();
  });

  it("normalizarRun quita puntos y guion", () => {
    expect(normalizarRun("12.345.678-k")).toBe("12345678K");
  });

  it("correoPermitido acepta solo los dominios del requisito", () => {
    expect(correoPermitido("a@duoc.cl")).toBeTrue();
    expect(correoPermitido("b@profesor.duoc.cl")).toBeTrue();
    expect(correoPermitido("c@gmail.com")).toBeTrue();
    expect(correoPermitido("d@yahoo.com")).toBeFalse();
    expect(correoPermitido("")).toBeFalse();
  });
});

describe("Carrito", () => {
  it("calcularTotal usa el precio de oferta y contarProductos suma cantidades", () => {
    const carrito = [{ precio: 1000, precioFinal: 800, cantidad: 3 }, { precio: 500, cantidad: 2 }];
    expect(calcularTotal(carrito)).toBe(3400);
    expect(contarProductos(carrito)).toBe(5);
  });

  it("sincronizarCarrito limita al stock y quita productos que ya no existen", () => {
    const resultado = sincronizarCarrito(
      [{ id: 1, cantidad: 10 }, { id: 2, cantidad: 1 }],
      [{ id: 1, nombre: "A", precio: 100, stock: 4 }]
    );
    expect(resultado.length).toBe(1);
    expect(resultado[0].cantidad).toBe(4);
  });

  it("formatearPrecio usa el formato chileno", () => {
    expect(formatearPrecio(1234567)).toBe("$1.234.567");
  });
});

describe("Sesión y permisos", () => {
  beforeEach(() => localStorage.clear());

  it("tokenVigente y tiempoRestante leen la expiración del JWT", () => {
    const token = crearTokenFalso({}, 120);
    expect(tokenVigente(token)).toBeTrue();
    expect(tiempoRestante(token)).toBeGreaterThan(100000);
    expect(tokenVigente(crearTokenFalso({}, -5))).toBeFalse();
  });

  it("guardarSesion, leerSesion y limpiarSesion usan localStorage", () => {
    guardarSesion(sesionDePrueba("ADMIN"));
    expect(leerSesion().usuario.rol).toBe("ADMIN");
    limpiarSesion();
    expect(leerSesion()).toBeNull();
  });

  it("Los permisos dependen del rol", () => {
    expect(tienePermiso("ADMIN", "productos.editar")).toBeTrue();
    expect(tienePermiso("VENDEDOR", "productos.ver")).toBeTrue();
    expect(tienePermiso("VENDEDOR", "productos.editar")).toBeFalse();
    expect(tienePermiso("CLIENTE", "ordenes.ver")).toBeFalse();
    expect(rutaInicialPorRol("ADMIN")).toBe("/admin");
  });
});

describe("Cliente HTTP (axios)", () => {
  beforeEach(() => localStorage.clear());

  it("El interceptor agrega el header Authorization con el token guardado", async () => {
    const sesion = sesionDePrueba("CLIENTE");
    guardarSesion(sesion);
    const interceptor = cliente.interceptors.request.handlers[0].fulfilled;
    const config = await interceptor({ headers: {} });
    expect(config.headers.Authorization).toBe("Bearer " + sesion.token);
  });

  it("Sin sesión no agrega el header", async () => {
    const interceptor = cliente.interceptors.request.handlers[0].fulfilled;
    const config = await interceptor({ headers: {} });
    expect(config.headers.Authorization).toBeUndefined();
  });

  it("mensajeError distingue entre servidor caído y error con mensaje", () => {
    expect(mensajeError({})).toContain("No se pudo conectar");
    expect(mensajeError({ response: { data: { error: "Stock insuficiente" } } })).toBe("Stock insuficiente");
  });
});
