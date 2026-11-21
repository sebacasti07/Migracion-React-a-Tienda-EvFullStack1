import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import RutaProtegida from '../components/RutaProtegida'
import { AuthProvider } from '../context/AuthContext'
import { authApi } from '../api/servicios'
import { guardarSesion } from '../utils/sesion'
import { crearTokenFalso, sesionDePrueba } from '../test/utilidades'

vi.mock('../api/servicios', () => ({
  authApi: { login: vi.fn(), registro: vi.fn(), perfil: vi.fn() }
}))

// Simula la app con una ruta /admin protegida para ADMIN y VENDEDOR
function renderRutas(ruta = '/admin') {
  return render(
    <AuthProvider>
      <MemoryRouter initialEntries={[ruta]}>
        <Routes>
          <Route path="/login" element={<h1>Login</h1>} />
          <Route path="/acceso-denegado" element={<h1>Acceso denegado</h1>} />
          <Route
            path="/admin"
            element={
              <RutaProtegida roles={['ADMIN', 'VENDEDOR']}>
                <h1>Panel interno</h1>
              </RutaProtegida>
            }
          />
        </Routes>
      </MemoryRouter>
    </AuthProvider>
  )
}

describe('Restricciones de acceso por rol (RutaProtegida)', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('Sin sesión redirige al login', () => {
    renderRutas()
    expect(screen.getByRole('heading', { name: 'Login' })).toBeInTheDocument()
  })

  it('Un CLIENTE no puede entrar al panel y ve acceso denegado', async () => {
    const sesion = sesionDePrueba('CLIENTE')
    guardarSesion(sesion)
    vi.mocked(authApi.perfil).mockResolvedValue(sesion.usuario)

    renderRutas()

    expect(await screen.findByRole('heading', { name: 'Acceso denegado' })).toBeInTheDocument()
    expect(screen.queryByText('Panel interno')).not.toBeInTheDocument()
  })

  it('Un VENDEDOR sí entra al panel (la sesión persiste tras recargar)', async () => {
    const sesion = sesionDePrueba('VENDEDOR')
    guardarSesion(sesion)
    vi.mocked(authApi.perfil).mockResolvedValue(sesion.usuario)

    renderRutas()

    expect(await screen.findByRole('heading', { name: 'Panel interno' })).toBeInTheDocument()
    expect(authApi.perfil).toHaveBeenCalled()
  })

  it('Si el refresh token ya expiró, la sesión guardada se descarta', () => {
    guardarSesion({
      ...sesionDePrueba('ADMIN'),
      refreshToken: crearTokenFalso({ tipo: 'refresh' }, -60)
    })

    renderRutas()

    expect(screen.getByRole('heading', { name: 'Login' })).toBeInTheDocument()
    expect(localStorage.getItem('sesionTienda')).toBeNull()
  })
})
