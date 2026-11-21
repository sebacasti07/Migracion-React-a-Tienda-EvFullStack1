import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import Login from './login'
import { AuthProvider } from '../context/AuthContext'
import { authApi } from '../api/servicios'
import { leerSesion } from '../utils/sesion'
import { sesionDePrueba } from '../test/utilidades'

// Mock del servicio: las pruebas no llaman al backend real
vi.mock('../api/servicios', () => ({
  authApi: { login: vi.fn(), registro: vi.fn(), perfil: vi.fn() }
}))

function renderLogin() {
  return render(
    <AuthProvider>
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<h1>Página de inicio</h1>} />
          <Route path="/admin" element={<h1>Panel admin</h1>} />
        </Routes>
      </MemoryRouter>
    </AuthProvider>
  )
}

describe('5. Pruebas de login.jsx (JWT)', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.mocked(authApi.login).mockReset()
  })

  it('Prueba 7: Muestra los campos de correo, contraseña y el botón ingresar', () => {
    renderLogin()

    expect(screen.getByLabelText(/Correo/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Contraseña/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Ingresar/i })).toBeInTheDocument()
  })

  it('Prueba 8: Con credenciales válidas guarda el JWT en localStorage y redirige según el rol', async () => {
    const user = userEvent.setup()
    vi.mocked(authApi.login).mockResolvedValue(sesionDePrueba('ADMIN'))
    renderLogin()

    await user.type(screen.getByLabelText(/Correo/i), 'admin@duoc.cl')
    await user.type(screen.getByLabelText(/Contraseña/i), 'Admin1234@')
    await user.click(screen.getByRole('button', { name: /Ingresar/i }))

    expect(authApi.login).toHaveBeenCalledWith('admin@duoc.cl', 'Admin1234@')
    expect(await screen.findByText('Panel admin')).toBeInTheDocument()
    expect(leerSesion().usuario.rol).toBe('ADMIN')
    expect(leerSesion().token).toBeTruthy()
  })

  it('Prueba 9: Muestra el mensaje del backend cuando las credenciales son incorrectas', async () => {
    const user = userEvent.setup()
    vi.mocked(authApi.login).mockRejectedValue({
      response: { status: 401, data: { error: 'Correo o contraseña incorrectos' } }
    })
    renderLogin()

    await user.type(screen.getByLabelText(/Correo/i), 'admin@duoc.cl')
    await user.type(screen.getByLabelText(/Contraseña/i), 'mala')
    await user.click(screen.getByRole('button', { name: /Ingresar/i }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Correo o contraseña incorrectos')
    expect(leerSesion()).toBeNull()
  })
})
