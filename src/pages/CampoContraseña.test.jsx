import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import CampoContraseña from '../components/CampoContraseña'

describe('3. Pruebas de CampoContraseña.jsx', () => {
  it('Prueba 5: Alterna el tipo de input de password a text al pulsar Mostrar', async () => {
    const user = userEvent.setup()
    const { container } = render(<CampoContraseña id="pass" value="Password123" onChange={() => {}} />)

    const input = container.querySelector('input')
    const boton = screen.getByRole('button', { name: /Mostrar/i })

    expect(input.type).toBe('password')
    await user.click(boton)
    expect(input.type).toBe('text')
  })
})