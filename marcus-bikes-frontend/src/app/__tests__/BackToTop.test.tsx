import { render, screen, fireEvent, act } from '@testing-library/react'
import BackToTop from '../components/BackToTop'
import styles from '../styles/backToTop.module.css'

describe('BackToTop', () => {
  beforeEach(() => {
    // Mock window.scrollY
    Object.defineProperty(window, 'scrollY', {
      value: 0,
      writable: true,
    })
    
    // Mock window.scrollTo
    window.scrollTo = jest.fn()
  })

  it('is not visible initially', () => {
    render(<BackToTop />)
    const button = screen.getByLabelText('Back to top')
    expect(button).not.toHaveClass(styles.visible)
  })

  it('becomes visible when scrolling down', () => {
    render(<BackToTop />)
    
    // Simulate scrolling down
    act(() => {
      Object.defineProperty(window, 'scrollY', {
        value: 600,
        writable: true,
      })
      
      // Trigger scroll event
      window.dispatchEvent(new Event('scroll'))
    })
    
    const button = screen.getByLabelText('Back to top')
    expect(button).toHaveClass(styles.visible)
  })

  it('scrolls to top when clicked', () => {
    render(<BackToTop />)
    
    // Make button visible
    act(() => {
      Object.defineProperty(window, 'scrollY', {
        value: 600,
        writable: true,
      })
      window.dispatchEvent(new Event('scroll'))
    })
    
    // Click the button
    const button = screen.getByLabelText('Back to top')
    fireEvent.click(button)
    
    // Check if scrollTo was called with correct parameters
    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 0,
      behavior: 'smooth'
    })
  })

  it('becomes hidden when scrolling back to top', () => {
    render(<BackToTop />)
    
    // First scroll down
    act(() => {
      Object.defineProperty(window, 'scrollY', {
        value: 600,
        writable: true,
      })
      window.dispatchEvent(new Event('scroll'))
    })
    
    const button = screen.getByLabelText('Back to top')
    expect(button).toHaveClass(styles.visible)
    
    // Then scroll back to top
    act(() => {
      Object.defineProperty(window, 'scrollY', {
        value: 0,
        writable: true,
      })
      window.dispatchEvent(new Event('scroll'))
    })
    
    expect(button).not.toHaveClass(styles.visible)
  })
}) 