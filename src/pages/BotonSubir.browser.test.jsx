import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import BotonSubir from '../components/BotonSubir'

describe('Chromium - Scroll y Posicionamiento en BotonSubir', () => {
  it('Aparece únicamente al superar los 250px de scroll y desplaza la ventana al top', async () => {
    render(
      <div style={{ height: '2000px' }}>
        <BotonSubir />
      </div>
    )

    // En la posición inicial (scrollY = 0), el botón no debe existir en el DOM
    expect(screen.queryByRole('button', { name: /volver arriba/i })).not.toBeInTheDocument()

    // Disparo de scroll real en la ventana de Chromium
    window.scrollTo(0, 300)
    window.dispatchEvent(new Event('scroll'))

    // El componente detecta window.scrollY > 250 y renderiza el botón
    const boton = await screen.findByRole('button', { name: /volver arriba/i })
    expect(boton).toBeInTheDocument()

    const scrollTo = vi.spyOn(window, 'scrollTo')
    boton.click()
    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' })
  })
})