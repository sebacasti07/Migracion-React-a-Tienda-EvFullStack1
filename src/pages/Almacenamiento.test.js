import { beforeEach, describe, expect, it, vi } from 'vitest'
import { leerAlmacenamiento, guardarAlmacenamiento } from '../utils/almacenamiento'

describe('Pruebas de la Utilidad almacenamiento.js', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('Guarda y lee correctamente estructuras de datos en localStorage', () => {
    const carritoMock = [{ id: 1, nombre: 'Teclado', cantidad: 2 }]
    guardarAlmacenamiento('carritoPrueba', carritoMock)

    const resultado = leerAlmacenamiento('carritoPrueba', [])
    expect(resultado).toEqual(carritoMock)
  })

  it('Retorna el valor por defecto si la clave no existe en localStorage', () => {
    const resultado = leerAlmacenamiento('claveInexistente', ['porDefecto'])
    expect(resultado).toEqual(['porDefecto'])
  })

  it('Maneja excepciones de JSON corrupto retornando el valor fallback', () => {
    localStorage.setItem('claveInvalida', '{jsonMalo:')
    const spyError = vi.spyOn(console, 'error').mockImplementation(() => {})

    const resultado = leerAlmacenamiento('claveInvalida', 'fallback')
    expect(resultado).toBe('fallback')
    expect(spyError).toHaveBeenCalled()

    spyError.mockRestore()
  })
})