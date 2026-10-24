import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'
import contenidoInicial from '../data/contenidoSitio'
import Inicio from './Inicio'

describe('Inicio en Chromium', () => {
  it('PF-01 (Browser): permite escribir en todos los campos del formulario de contacto', async () => {
    render(<Inicio contenido={contenidoInicial} />)

    const campoNombre = screen.getByRole('textbox', { name: 'Nombre' })
    const campoCorreo = screen.getByRole('textbox', { name: 'Correo' })
    const campoMensaje = screen.getByRole('textbox', { name: 'Mensaje' })

    await userEvent.fill(campoNombre, 'Sebastian Castillo')
    await userEvent.fill(campoCorreo, 'seba.castillog@duocuc.cl')
    await userEvent.fill(campoMensaje, 'Hola, quisiera consultar por disponibilidad de un producto.')

    expect(campoNombre).toHaveValue('Sebastian Castillo')
    expect(campoCorreo).toHaveValue('seba.castillog@duocuc.cl')
    expect(campoMensaje).toHaveValue('Hola, quisiera consultar por disponibilidad de un producto.')
  })

  it('PF-02 (Browser): verifica la presencia del iframe del mapa de Google Maps', () => {
    render(<Inicio contenido={contenidoInicial} />)

    const mapa = screen.getByTitle('Mapa de nuestra dirección')
    expect(mapa).toBeInTheDocument()
  })
})