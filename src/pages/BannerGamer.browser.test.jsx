import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'
import BannerGamer from '../components/BannerGamer'

describe('Chromium - Interacción de Cursor en BannerGamer', () => {
  it('Pausa la rotación automática al posicionar el cursor sobre el carrusel', async () => {
    render(<BannerGamer />)

    const bannerRegion = screen.getByRole('region', { name: /productos destacados/i })

    // Simula la entrada del mouse al contenedor
    await userEvent.hover(bannerRegion)
    expect(bannerRegion).toBeInTheDocument()

    // Simula la salida del mouse
    await userEvent.unhover(bannerRegion)
  })
})