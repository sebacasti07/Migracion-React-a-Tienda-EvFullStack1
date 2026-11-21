import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import Producto from '../components/Producto'

describe('2. Pruebas de Producto.jsx', () => {
  const productoMock = {
    id: 1,
    nombre: 'Teclado Mecánico RGB',
    precio: 49990,
    emoji: '⌨️'
  }

  it('Prueba 3: Muestra el nombre y el precio formateado del producto', () => {
    render(
      <MemoryRouter>
        <Producto producto={productoMock} agregarAlCarrito={vi.fn()} />
      </MemoryRouter>
    )

    expect(screen.getByText('Teclado Mecánico RGB')).toBeInTheDocument()
    expect(screen.getByText('$49.990')).toBeInTheDocument()
  })

  it('Prueba 4: Ejecuta la función agregarAlCarrito al presionar el botón', async () => {
    const user = userEvent.setup()
    const spyAgregar = vi.fn()

    render(
      <MemoryRouter>
        <Producto producto={productoMock} agregarAlCarrito={spyAgregar} />
      </MemoryRouter>
    )

    const boton = screen.getByRole('button', { name: /Agregar al carrito/i })
    await user.click(boton)

    expect(spyAgregar).toHaveBeenCalledWith(productoMock)
  })

  it('Prueba 4b: Muestra el precio normal tachado y el precio de oferta', () => {
    render(
      <MemoryRouter>
        <Producto
          producto={{ ...productoMock, precioOferta: 39990, precioFinal: 39990, enOferta: true }}
          agregarAlCarrito={vi.fn()}
        />
      </MemoryRouter>
    )

    expect(screen.getByText('$49.990')).toHaveClass('text-decoration-line-through')
    expect(screen.getByText('$39.990')).toBeInTheDocument()
    expect(screen.getByText('Oferta')).toBeInTheDocument()
  })

  it('Prueba 4c: Oculta el botón cuando el rol no puede comprar y lo deshabilita sin stock', () => {
    const { rerender } = render(
      <MemoryRouter>
        <Producto producto={productoMock} agregarAlCarrito={vi.fn()} mostrarAgregar={false} />
      </MemoryRouter>
    )
    expect(screen.queryByRole('button')).not.toBeInTheDocument()

    rerender(
      <MemoryRouter>
        <Producto producto={{ ...productoMock, stock: 0 }} agregarAlCarrito={vi.fn()} />
      </MemoryRouter>
    )
    expect(screen.getByRole('button', { name: /Sin stock/i })).toBeDisabled()
  })
})