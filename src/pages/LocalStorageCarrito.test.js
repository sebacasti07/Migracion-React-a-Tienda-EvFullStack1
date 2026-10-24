import { beforeEach, describe, expect, it } from 'vitest'
import { guardarCarrito, obtenerCarrito, eliminarCarrito } from '../utils/localStorage'

describe('Pruebas de Helpers de Carrito en localStorage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('Retorna un arreglo vacío cuando no hay carrito guardado', () => {
    expect(obtenerCarrito()).toEqual([])
  })

  it('Almacena y recupera los elementos del carrito en el almacenamiento local', () => {
    const carritoMock = [{ id: 10, nombre: 'Silla Gamer', cantidad: 1 }]
    guardarCarrito(carritoMock)

    expect(obtenerCarrito()).toEqual(carritoMock)
  })

  it('Elimina la clave del carrito de localStorage por completo', () => {
    guardarCarrito([{ id: 1, nombre: 'Mouse' }])
    eliminarCarrito()

    expect(obtenerCarrito()).toEqual([])
  })
})