import { render, screen, fireEvent } from '@testing-library/react'
import Header from '../components/Header'
import { CustomizationProvider } from '../lib/context/CustomizationContext'
import { ThemeProvider } from '../lib/context/ThemeContext'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: () => '/',
}))

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>
  }
})

// Mock CustomizationContext
jest.mock('../lib/context/CustomizationContext', () => ({
  ...jest.requireActual('../lib/context/CustomizationContext'),
  useCustomization: () => ({
    cart: [],
  }),
}))

describe('Header', () => {
  const renderHeader = () => {
    return render(
      <ThemeProvider>
        <CustomizationProvider>
          <Header />
        </CustomizationProvider>
      </ThemeProvider>
    )
  }

  it('renders logo and navigation links', () => {
    renderHeader()
    
    expect(screen.getByText('Marcus Bikes')).toBeInTheDocument()
    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('Categories')).toBeInTheDocument()
    expect(screen.getByText('About')).toBeInTheDocument()
  })

  it('toggles mobile menu when menu button is clicked', () => {
    renderHeader()
    
    const menuButton = screen.getByLabelText('Toggle menu')
    expect(menuButton).toBeInTheDocument()
    
    // Menu should be closed initially
    expect(screen.queryByRole('navigation')).not.toHaveClass('navOpen')
    
    // Click menu button
    fireEvent.click(menuButton)
    
    // Menu should be open
    expect(screen.getByRole('navigation')).toHaveClass('navOpen')
    
    // Click menu button again
    fireEvent.click(menuButton)
    
    // Menu should be closed
    expect(screen.getByRole('navigation')).not.toHaveClass('navOpen')
  })

  it('shows cart badge when cart has items', () => {
    // Mock cart with items
    const mockCart = [{ productId: 1, selectedOptions: {}, price: 100, quantity: 1 }]
    
    jest.spyOn(require('../lib/context/CustomizationContext'), 'useCustomization')
      .mockImplementation(() => ({
        cart: mockCart,
      }))
    
    renderHeader()
    
    expect(screen.getByText('1')).toBeInTheDocument()
  })

  it('does not show cart badge when cart is empty', () => {
    // Mock empty cart
    jest.spyOn(require('../lib/context/CustomizationContext'), 'useCustomization')
      .mockImplementation(() => ({
        cart: [],
      }))
    
    renderHeader()
    
    expect(screen.queryByText('0')).not.toBeInTheDocument()
  })
}) 