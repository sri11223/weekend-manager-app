import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '../utils/testUtils'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../../components/ui/Card'

describe('Card Component', () => {
  it('renders basic card with content', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Test Card</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Test content</p>
        </CardContent>
      </Card>
    )

    expect(screen.getByText('Test Card')).toBeInTheDocument()
    expect(screen.getByText('Test content')).toBeInTheDocument()
  })

  it('applies variant classes correctly', () => {
    render(
      <Card variant="glass" data-testid="glass-card">
        <CardContent>Glass variant</CardContent>
      </Card>
    )

    const card = screen.getByTestId('glass-card')
    expect(card).toHaveClass('glass')
    expect(card).toHaveClass('rounded-3xl')
  })

  it('handles interactive state', () => {
    const handleClick = vi.fn()
    
    render(
      <Card variant="interactive" onClick={handleClick} data-testid="interactive-card">
        <CardContent>Interactive card</CardContent>
      </Card>
    )

    const card = screen.getByTestId('interactive-card')
    fireEvent.click(card)
    
    expect(handleClick).toHaveBeenCalledTimes(1)
    expect(card).toHaveClass('cursor-pointer')
  })

  it('shows loading state', () => {
    render(
      <Card loading data-testid="loading-card">
        <CardContent>Loading content</CardContent>
      </Card>
    )

    const card = screen.getByTestId('loading-card')
    expect(card).toHaveClass('pointer-events-none')
    // Check for loading overlay
    const loadingOverlay = card.querySelector('.absolute.inset-0')
    expect(loadingOverlay).toBeInTheDocument()
  })

  it('handles selected state', () => {
    render(
      <Card selected data-testid="selected-card">
        <CardContent>Selected card</CardContent>
      </Card>
    )

    const card = screen.getByTestId('selected-card')
    expect(card).toHaveClass('ring-2')
  })

  it('supports keyboard navigation when interactive', () => {
    const handleClick = vi.fn()
    
    render(
      <Card variant="interactive" onClick={handleClick} data-testid="keyboard-card">
        <CardContent>Keyboard accessible</CardContent>
      </Card>
    )

    const card = screen.getByTestId('keyboard-card')
    
    // Test Enter key
    fireEvent.keyDown(card, { key: 'Enter', code: 'Enter' })
    expect(handleClick).toHaveBeenCalledTimes(1)
    
    // Test Space key
    fireEvent.keyDown(card, { key: ' ', code: 'Space' })
    expect(handleClick).toHaveBeenCalledTimes(2)
  })

  it('renders all card subcomponents', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Title</CardTitle>
        </CardHeader>
        <CardContent>Content</CardContent>
        <CardFooter>Footer</CardFooter>
      </Card>
    )

    expect(screen.getByText('Title')).toBeInTheDocument()
    expect(screen.getByText('Content')).toBeInTheDocument()
    expect(screen.getByText('Footer')).toBeInTheDocument()
  })
})
