import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'
import { MemoryRouter } from 'react-router-dom'
import Login from './login'

describe('Chromium - Foco y Secuencia de Navegación por Teclado', () => {
  it('PF-09 (Browser): Recorre la secuencia exacta del formulario mediante la tecla TAB', async () => {
    render(
      <MemoryRouter>
        <Login usuarios={[]} />
      </MemoryRouter>
    )

    // Obtención de elementos mediante selectores accesibles
    const inputUsuario = screen.getByLabelText(/usuario/i)
    const inputPassword = screen.getByLabelText(/contraseña/i)
    const botonMostrar = screen.getByRole('button', { name: /mostrar|ocultar/i })
    const botonIngresar = screen.getByRole('button', { name: /ingresar/i })

    inputUsuario.focus()
    expect(document.activeElement).toBe(inputUsuario)

    // Tab desde Usuario -> Contraseña -> Mostrar -> Ingresar
    await userEvent.tab()
    expect(document.activeElement).toBe(inputPassword)

    await userEvent.tab()
    expect(document.activeElement).toBe(botonMostrar)

    await userEvent.tab()
    expect(document.activeElement).toBe(botonIngresar)
  })
})