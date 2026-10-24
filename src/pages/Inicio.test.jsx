import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import contenidoInicial from '../data/contenidoSitio'
import Inicio from './Inicio'

describe('1. Pruebas de Inicio.jsx', () => {
  it('Prueba 1: Permite escribir en todos los campos del formulario de contacto', async () => {
    const user = userEvent.setup()
    render(<Inicio contenido={contenidoInicial} />)

    const campoNombre = screen.getByRole('textbox', { name: 'Nombre' })
    const campoCorreo = screen.getByRole('textbox', { name: 'Correo' })
    const campoMensaje = screen.getByRole('textbox', { name: 'Mensaje' })

    await user.type(campoNombre, 'Sebastian Castillo')
    await user.type(campoCorreo, 'seba.castillog@duocuc.cl')
    await user.type(campoMensaje, 'Hola, me gustaría consultar por un teclado mecánico.')

    expect(campoNombre).toHaveValue('Sebastian Castillo')
    expect(campoCorreo).toHaveValue('seba.castillog@duocuc.cl')
    expect(campoMensaje).toHaveValue('Hola, me gustaría consultar por un teclado mecánico.')
  })

  it('Prueba 2: Renderiza la dirección física y los enlaces de redes sociales', () => {
    render(<Inicio contenido={contenidoInicial} />)

    expect(screen.getByText(/Avenida Providencia 1234/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /WhatsApp/i })).toBeInTheDocument()
  })
})