import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import DetalleProducto from './DetalleProducto'

describe('4. Pruebas de DetalleProducto.jsx', () => {
  it('Prueba 6: Carga la información del producto según el parámetro ID de la URL', () => {
    const productosMock = [
      { id: 4, nombre: 'Monitor Gamer 24"', precio: 159990, descripcion: 'Monitor 144 Hz Full HD', categoria: 'Monitores' }
    ]

    render(
      <MemoryRouter initialEntries={['/productos/4']}>
        <Routes>
          <Route path="/productos/:id" element={<DetalleProducto productos={productosMock} />} />
        </Routes>
      </MemoryRouter>
    )

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Monitor Gamer 24"')
    expect(screen.getByText('Monitor 144 Hz Full HD')).toBeInTheDocument()
  })
})