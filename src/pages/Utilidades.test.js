import { beforeEach, describe, expect, it } from 'vitest'
import { correoPermitido, runValido } from '../utils/validaciones'
import { calcularTotal, sincronizarCarrito } from '../utils/carrito'
import { guardarSesion, leerSesion, limpiarSesion, tokenVigente } from '../utils/sesion'
import { tienePermiso, rutaInicialPorRol } from '../utils/permisos'
import cliente from '../api/cliente'
import { crearTokenFalso, sesionDePrueba } from '../test/utilidades'

describe('Validaciones de formularios', () => {
  it('Valida el RUN con módulo 11', () => {
    expect(runValido('123456785')).toBe(true)
    expect(runValido('12.345.678-5')).toBe(true)
    expect(runValido('10000013k')).toBe(true)
    expect(runValido('123456789')).toBe(false)
    expect(runValido('')).toBe(false)
  })

  it('Solo acepta correos de los dominios permitidos', () => {
    expect(correoPermitido('alumno@duoc.cl')).toBe(true)
    expect(correoPermitido('alumno@duocuc.cl')).toBe(true)
    expect(correoPermitido('profe@profesor.duoc.cl')).toBe(true)
    expect(correoPermitido('persona@gmail.com')).toBe(true)
    expect(correoPermitido('persona@hotmail.com')).toBe(false)
  })
})

describe('Cálculos del carrito', () => {
  it('Usa el precio de oferta cuando existe', () => {
    const carrito = [
      { id: 1, precio: 50000, precioFinal: 40000, cantidad: 2 },
      { id: 2, precio: 10000, cantidad: 1 }
    ]
    expect(calcularTotal(carrito)).toBe(90000)
  })

  it('Ajusta el carrito al stock actual y quita productos eliminados', () => {
    const carrito = [
      { id: 1, nombre: 'Viejo', precio: 1, cantidad: 5 },
      { id: 99, nombre: 'Ya no existe', precio: 1, cantidad: 1 }
    ]
    const catalogo = [{ id: 1, nombre: 'Teclado', precio: 1000, precioFinal: 900, stock: 2 }]

    const resultado = sincronizarCarrito(carrito, catalogo)
    expect(resultado).toEqual([{ id: 1, nombre: 'Teclado', precio: 1000, precioFinal: 900, stock: 2, cantidad: 2 }])
  })
})

describe('Sesión y permisos', () => {
  beforeEach(() => localStorage.clear())

  it('Detecta si un token está vigente o expirado', () => {
    expect(tokenVigente(crearTokenFalso({}, 600))).toBe(true)
    expect(tokenVigente(crearTokenFalso({}, -600))).toBe(false)
    expect(tokenVigente('no-es-un-jwt')).toBe(false)
  })

  it('Guarda, lee y limpia la sesión en localStorage', () => {
    guardarSesion(sesionDePrueba('CLIENTE'))
    expect(leerSesion().usuario.rol).toBe('CLIENTE')
    limpiarSesion()
    expect(leerSesion()).toBeNull()
  })

  it('Cada rol tiene solo sus permisos', () => {
    expect(tienePermiso('ADMIN', 'usuarios.editar')).toBe(true)
    expect(tienePermiso('VENDEDOR', 'ordenes.ver')).toBe(true)
    expect(tienePermiso('VENDEDOR', 'productos.editar')).toBe(false)
    expect(tienePermiso('VENDEDOR', 'tienda.comprar')).toBe(false)
    expect(tienePermiso('CLIENTE', 'panel.ver')).toBe(false)
    expect(tienePermiso(null, 'tienda.comprar')).toBe(false)
    expect(rutaInicialPorRol('VENDEDOR')).toBe('/admin')
    expect(rutaInicialPorRol('CLIENTE')).toBe('/')
  })

  it('El interceptor de axios agrega el token en el header Authorization', async () => {
    const sesion = sesionDePrueba('CLIENTE')
    guardarSesion(sesion)
    const interceptor = cliente.interceptors.request.handlers[0].fulfilled
    const config = await interceptor({ headers: {} })
    expect(config.headers.Authorization).toBe(`Bearer ${sesion.token}`)
  })
})
