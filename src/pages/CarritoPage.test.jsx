import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import CarritoPage from './CarritoPage'

describe('6. Pruebas de CarritoPage.jsx', () => {
  beforeEach(() => {
    sessionStorage.setItem('usuario', 'pedro')
  })

  it('Prueba 9: Muestra los productos y calcula el total acumulado correctamente', () => {
    const carritoMock = [
      { id: 1, nombre: 'Mouse Gamer Pro', precio: 29990, cantidad: 2, emoji: '🖱️' }
    ]

    render(
      <MemoryRouter>
        <CarritoPage
          carrito={carritoMock}
          aumentarCantidad={vi.fn()}
          disminuirCantidad={vi.fn()}
          eliminarDelCarrito={vi.fn()}
        />
      </MemoryRouter>
    )

    expect(screen.getByText('Productos en carrito: 2')).toBeInTheDocument()
    expect(screen.getByText('Total: $59.980')).toBeInTheDocument()
  })

  it('Prueba 10: Despliega el mensaje de carrito vacío cuando la lista no tiene elementos', () => {
    render(
      <MemoryRouter>
        <CarritoPage
          carrito={[]}
          aumentarCantidad={vi.fn()}
          disminuirCantidad={vi.fn()}
          eliminarDelCarrito={vi.fn()}
        />
      </MemoryRouter>
    )

    expect(screen.getByText('El carrito está vacío.')).toBeInTheDocument()
  })
})