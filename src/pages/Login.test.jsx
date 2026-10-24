import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import Login from './login'

describe('5. Pruebas de login.jsx', () => {
  beforeEach(() => {
    sessionStorage.clear()
  })

  it('Prueba 7: Muestra los campos de usuario, contraseña y el botón ingresar', () => {
    render(
      <MemoryRouter>
        <Login usuarios={[]} />
      </MemoryRouter>
    )

    expect(screen.getByLabelText(/Usuario/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Contraseña/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Ingresar/i })).toBeInTheDocument()
  })

  it('Prueba 8: Guarda la sesión en sessionStorage al ingresar credenciales válidas', async () => {
    const user = userEvent.setup()
    const usuariosMock = [{ usuario: 'pedro', password: 'Password123' }]

    render(
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route path="/login" element={<Login usuarios={usuariosMock} />} />
          <Route path="/carrito" element={<h1>Página del Carrito</h1>} />
        </Routes>
      </MemoryRouter>
    )

    await user.type(screen.getByLabelText(/Usuario/i), 'pedro')
    await user.type(screen.getByLabelText(/Contraseña/i), 'Password123')
    await user.click(screen.getByRole('button', { name: /Ingresar/i }))

    expect(sessionStorage.getItem('usuario')).toBe('pedro')
  })
})