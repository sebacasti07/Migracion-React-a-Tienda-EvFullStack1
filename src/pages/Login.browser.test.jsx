import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'
import Login from './login'
import { renderConAuth } from '../test/utilidades'

describe('Chromium - Foco y Secuencia de Navegación por Teclado', () => {
  it('PF-09 (Browser): Recorre la secuencia exacta del formulario mediante la tecla TAB', async () => {
    localStorage.clear()
    renderConAuth(<Login />, { ruta: '/login' })

    // Obtención de elementos mediante selectores accesibles
    const inputCorreo = screen.getByLabelText(/correo/i)
    const inputPassword = screen.getByLabelText(/contraseña/i)
    const botonMostrar = screen.getByRole('button', { name: /mostrar|ocultar/i })
    const botonIngresar = screen.getByRole('button', { name: /ingresar/i })

    inputCorreo.focus()
    expect(document.activeElement).toBe(inputCorreo)

    // Tab desde Correo -> Contraseña -> Mostrar -> Ingresar
    await userEvent.tab()
    expect(document.activeElement).toBe(inputPassword)

    await userEvent.tab()
    expect(document.activeElement).toBe(botonMostrar)

    await userEvent.tab()
    expect(document.activeElement).toBe(botonIngresar)
  })
})
