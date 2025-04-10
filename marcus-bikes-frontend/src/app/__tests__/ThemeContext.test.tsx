import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeProvider, useTheme } from '../lib/context/ThemeContext'

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
}
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage })

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// Test component that uses the theme context
const TestComponent = () => {
  const { theme, toggleTheme } = useTheme()
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  )
}

describe('ThemeContext', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockLocalStorage.getItem.mockReturnValue(null)
  })

  it('initializes with system preference when no theme is stored', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )
    
    expect(screen.getByTestId('theme')).toHaveTextContent('light')
  })

  it('initializes with stored theme from localStorage', () => {
    mockLocalStorage.getItem.mockReturnValue('dark')
    
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )
    
    expect(screen.getByTestId('theme')).toHaveTextContent('dark')
  })

  it('toggles theme and updates localStorage', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )
    
    const button = screen.getByText('Toggle Theme')
    fireEvent.click(button)
    
    expect(screen.getByTestId('theme')).toHaveTextContent('dark')
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('theme', 'dark')
    
    fireEvent.click(button)
    
    expect(screen.getByTestId('theme')).toHaveTextContent('light')
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('theme', 'light')
  })
}) 