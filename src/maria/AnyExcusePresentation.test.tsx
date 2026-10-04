import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import AnyExcusePresentation from './AnyExcusePresentation'

describe('AnyExcusePresentation', () => {
  it('shows slides 14 and 15 in positions 9 and 10, with slide 02 second to last', () => {
    render(<AnyExcusePresentation language="ru" />)
    const slideIds = [
      '01', '03', '04', '05', '06', '07', '08', '09',
      '14', '15', '10', '11', '12', '13', '02', '16',
    ]

    for (let slide = 1; slide <= 16; slide += 1) {
      expect(screen.getByRole('img', { name: `Слайд ${slide} из 16` })).toHaveAttribute(
        'src',
        `/assets/maria/anyexcuse-presentation/${slideIds[slide - 1]}.png`,
      )
      if (slide < 16) fireEvent.click(screen.getByRole('button', { name: 'Следующий слайд' }))
    }

    expect(screen.getByRole('button', { name: 'Следующий слайд' })).toBeDisabled()
    fireEvent.keyDown(window, { key: 'ArrowLeft' })
    expect(screen.getByRole('img', { name: 'Слайд 15 из 16' })).toBeInTheDocument()
  })
})
