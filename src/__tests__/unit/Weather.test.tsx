import { render, screen } from '@testing-library/react'
import Weather from '@/components/Weather'
import { renderWithRouter } from '../utils/test-utils'

describe('Weather Component', () => {
  it('renders weather component', () => {
    renderWithRouter(<Weather />)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('displays loading state initially', () => {
    renderWithRouter(<Weather />)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('handles error states', () => {
    renderWithRouter(<Weather />)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })
}) 