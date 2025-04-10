import { render, screen, fireEvent, act } from '@testing-library/react'
import { CustomizationProvider, useCustomization } from '../lib/context/CustomizationContext'
import { Product, Option } from '../lib/data/types'

// Mock product data
const mockProduct: Product = {
  id: 1,
  name: 'Test Bike',
  description: 'A test bike for testing',
  category: 'bicycle',
  basePrice: 500,
  components: [
    {
      id: 1,
      name: 'Frame',
      options: [
        { id: 1, name: 'Option 1', price: 100, inStock: true },
        { id: 2, name: 'Option 2', price: 200, inStock: true },
      ],
    },
    {
      id: 2,
      name: 'Wheels',
      options: [
        { id: 3, name: 'Option 3', price: 150, inStock: true },
        { id: 4, name: 'Option 4', price: 250, inStock: true },
      ],
    },
  ],
  dependencies: [],
  priceRules: [],
}

// Test component that uses the customization context
const TestComponent = () => {
  const {
    product,
    selectedOptions,
    currentPrice,
    validation,
    setProduct,
    selectOption,
    addToCart,
    cart,
    cartTotal,
    removeFromCart,
    updateCartItemQuantity,
  } = useCustomization()

  return (
    <div>
      <button onClick={() => setProduct(mockProduct)}>Set Product</button>
      <button onClick={() => selectOption(1, 1)}>Select Option</button>
      <button onClick={addToCart}>Add to Cart</button>
      <button onClick={() => removeFromCart(0)}>Remove from Cart</button>
      <button onClick={() => updateCartItemQuantity(0, 2)}>Update Quantity</button>
      <div data-testid="product">{product?.name}</div>
      <div data-testid="price">{currentPrice}</div>
      <div data-testid="validation">{validation.valid ? 'Valid' : 'Invalid'}</div>
      <div data-testid="cart-count">{cart.length}</div>
      <div data-testid="cart-total">{cartTotal}</div>
    </div>
  )
}

describe('CustomizationContext', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('initializes with default values', () => {
    render(
      <CustomizationProvider>
        <TestComponent />
      </CustomizationProvider>
    )
    
    expect(screen.getByTestId('product')).toBeEmptyDOMElement()
    expect(screen.getByTestId('price')).toHaveTextContent('0')
    expect(screen.getByTestId('validation')).toHaveTextContent('Valid')
    expect(screen.getByTestId('cart-count')).toHaveTextContent('0')
    expect(screen.getByTestId('cart-total')).toHaveTextContent('0')
  })

  it('sets product and calculates initial price', async () => {
    render(
      <CustomizationProvider>
        <TestComponent />
      </CustomizationProvider>
    )
    
    await act(async () => {
      fireEvent.click(screen.getByText('Set Product'))
    })
    
    expect(screen.getByTestId('product')).toHaveTextContent('Test Bike')
    expect(screen.getByTestId('price')).toHaveTextContent('500')
  })

  it('selects options and updates price', async () => {
    render(
      <CustomizationProvider>
        <TestComponent />
      </CustomizationProvider>
    )
    
    // Set product first
    await act(async () => {
      fireEvent.click(screen.getByText('Set Product'))
    })
    
    // Select an option
    await act(async () => {
      fireEvent.click(screen.getByText('Select Option'))
    })
    
    // Price should be base price + option price
    expect(screen.getByTestId('price')).toHaveTextContent('600')
  })

  it('calculates cart total correctly', async () => {
    render(
      <CustomizationProvider>
        <TestComponent />
      </CustomizationProvider>
    )

    // Initial state
    expect(screen.getByTestId('cart-total')).toHaveTextContent('0')
    expect(screen.getByTestId('cart-count')).toHaveTextContent('0')

    // Set up product and select options
    await act(async () => {
      fireEvent.click(screen.getByText('Set Product'))
    })
    await act(async () => {
      fireEvent.click(screen.getByText('Select Option'))
    })

    // Add item to cart
    await act(async () => {
      fireEvent.click(screen.getByText('Add to Cart'))
    })

    expect(screen.getByTestId('cart-count')).toHaveTextContent('1')
    expect(screen.getByTestId('cart-total')).toHaveTextContent('600')

    // Update quantity
    await act(async () => {
      fireEvent.click(screen.getByText('Update Quantity'))
    })

    expect(screen.getByTestId('cart-total')).toHaveTextContent('1200')

    // Remove item
    await act(async () => {
      fireEvent.click(screen.getByText('Remove from Cart'))
    })

    expect(screen.getByTestId('cart-count')).toHaveTextContent('0')
    expect(screen.getByTestId('cart-total')).toHaveTextContent('0')
  })

  it('handles multiple items in cart', async () => {
    render(
      <CustomizationProvider>
        <TestComponent />
      </CustomizationProvider>
    )

    // Set up product and select options
    await act(async () => {
      fireEvent.click(screen.getByText('Set Product'))
    })
    await act(async () => {
      fireEvent.click(screen.getByText('Select Option'))
    })

    // Add two items
    await act(async () => {
      fireEvent.click(screen.getByText('Add to Cart'))
    })
    await act(async () => {
      fireEvent.click(screen.getByText('Add to Cart'))
    })

    expect(screen.getByTestId('cart-count')).toHaveTextContent('2')
    expect(screen.getByTestId('cart-total')).toHaveTextContent('1200')
  })
}) 