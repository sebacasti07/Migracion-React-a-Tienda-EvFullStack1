import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AuthProvider } from '../context/AuthContext'

// Crea un JWT de prueba (sin firma real) que expira en "segundos".
// El frontend solo lee "exp" para saber si la sesión sigue vigente.
export function crearTokenFalso(payload = {}, segundos = 3600) {
  const base64 = (obj) => btoa(JSON.stringify(obj)).replace(/=+$/, '')
  const exp = Math.floor(Date.now() / 1000) + segundos
  return `${base64({ alg: 'HS256' })}.${base64({ sub: 'test', exp, ...payload })}.firma`
}

export function sesionDePrueba(rol = 'CLIENTE') {
  return {
    token: crearTokenFalso({ rol, tipo: 'access' }),
    refreshToken: crearTokenFalso({ rol, tipo: 'refresh' }, 7 * 24 * 3600),
    usuario: { id: 1, nombre: 'Pedro', apellidos: 'González', correo: 'cliente@gmail.com', rol }
  }
}

// Renderiza un componente dentro del AuthProvider y un router en memoria
export function renderConAuth(ui, { ruta = '/' } = {}) {
  return render(
    <AuthProvider>
      <MemoryRouter initialEntries={[ruta]}>{ui}</MemoryRouter>
    </AuthProvider>
  )
}
