import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import FormularioContacto, { validarContacto } from '../components/FormularioContacto'

describe('Formulario de contacto (RF-006)', () => {
  it('Muestra los errores cuando se envía vacío o con un correo no permitido', async () => {
    const user = userEvent.setup()
    render(<FormularioContacto />)

    await user.type(screen.getByLabelText('Correo'), 'persona@hotmail.com')
    await user.click(screen.getByRole('button', { name: /Enviar mensaje/i }))

    expect(screen.getByText('Ingresa tu nombre.')).toBeInTheDocument()
    expect(screen.getByText(/Usa un correo @duoc.cl/)).toBeInTheDocument()
    expect(screen.getByText('Escribe tu mensaje.')).toBeInTheDocument()
  })

  it('Con datos válidos limpia el formulario y muestra el mensaje de éxito', async () => {
    const user = userEvent.setup()
    render(<FormularioContacto />)

    await user.type(screen.getByLabelText('Nombre'), 'Matías')
    await user.type(screen.getByLabelText('Correo'), 'matias@duoc.cl')
    await user.type(screen.getByLabelText('Mensaje'), '¿Tienen stock del monitor?')
    await user.click(screen.getByRole('button', { name: /Enviar mensaje/i }))

    expect(screen.getByRole('status')).toHaveTextContent('Recibimos tu mensaje')
    expect(screen.getByLabelText('Nombre')).toHaveValue('')
  })

  it('Respeta los largos máximos del requisito', () => {
    const errores = validarContacto({ nombre: 'a'.repeat(101), correo: 'a@gmail.com', mensaje: 'b'.repeat(501) })
    expect(errores.nombre).toMatch(/100/)
    expect(errores.mensaje).toMatch(/500/)
    expect(errores.correo).toBeUndefined()
  })
})
