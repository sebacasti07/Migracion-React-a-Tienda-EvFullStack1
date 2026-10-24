import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import ListaProductos from '../components/ListaProductos'

describe('Pruebas de Filtros y Búsqueda en ListaProductos', () => {
  const productosMock = [
    { id: 1, nombre: 'Teclado Mecánico RGB', precio: 49990, categoria: 'Periféricos', emoji: '⌨️' },
    { id: 2, nombre: 'Mouse Gamer Pro', precio: 19990, categoria: 'Periféricos', emoji: '🖱️' },
    { id: 3, nombre: 'Monitor Gamer 24"', precio: 159990, categoria: 'Monitores', emoji: '🖥️' }
  ]

  it('Filtra correctamente los productos según la categoría seleccionada', () => {
    render(
      <MemoryRouter>
        <ListaProductos productos={productosMock} categoria="Monitores" agregarAlCarrito={vi.fn()} />
      </MemoryRouter>
    )

    expect(screen.getByText('Monitor Gamer 24"')).toBeInTheDocument()
    expect(screen.queryByText('Teclado Mecánico RGB')).not.toBeInTheDocument()
  })

  it('Filtra los productos por coincidencia de texto en la búsqueda', () => {
    render(
      <MemoryRouter>
        <ListaProductos productos={productosMock} busqueda="Mouse" agregarAlCarrito={vi.fn()} />
      </MemoryRouter>
    )

    expect(screen.getByText('Mouse Gamer Pro')).toBeInTheDocument()
    expect(screen.queryByText('Monitor Gamer 24"')).not.toBeInTheDocument()
  })

  it('Ordena los productos de menor a mayor precio (ascendente)', () => {
    render(
      <MemoryRouter>
        <ListaProductos productos={productosMock} ordenPrecio="asc" agregarAlCarrito={vi.fn()} />
      </MemoryRouter>
    )

    const titulos = screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent)
    expect(titulos).toEqual(['Mouse Gamer Pro', 'Teclado Mecánico RGB', 'Monitor Gamer 24"'])
  })
})